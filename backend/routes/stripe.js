const express = require('express');
const router = express.Router();
const { query } = require('../db');

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('STRIPE_SECRET_KEY is missing. Stripe features will be disabled.');
}

// Middleware to check if Stripe is configured
const ensureStripeConfigured = (req, res, next) => {
    if (!stripe) {
        return res.status(503).json({
            error: 'Stripe is not configured on this server.'
        });
    }
    next();
};

// Create Stripe Checkout Session
router.post('/create-checkout-session', ensureStripeConfigured, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { priceId, tier } = req.body;

        if (!priceId || !tier) {
            return res.status(400).json({ error: 'Missing priceId or tier' });
        }

        // Get or create Stripe customer
        let customer;
        const subscription = await query(
            'SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1',
            [req.user.id]
        );

        if (subscription.rows[0]?.stripe_customer_id) {
            customer = { id: subscription.rows[0].stripe_customer_id };
        } else {
            customer = await stripe.customers.create({
                email: req.user.email,
                metadata: {
                    user_id: req.user.id.toString()
                }
            });

            // Store customer ID
            await query(
                `INSERT INTO subscriptions (user_id, stripe_customer_id, tier)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = $2`,
                [req.user.id, customer.id, 'free']
            );
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/account?success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing?canceled=true`,
            metadata: {
                user_id: req.user.id.toString(),
                tier: tier
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Checkout session error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Create Customer Portal Session
router.post('/create-portal-session', ensureStripeConfigured, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const subscription = await query(
            'SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1',
            [req.user.id]
        );

        if (!subscription.rows[0]?.stripe_customer_id) {
            return res.status(404).json({ error: 'No Stripe customer found' });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.rows[0].stripe_customer_id,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/account`
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Portal session error:', error);
        res.status(500).json({ error: 'Failed to create portal session' });
    }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), ensureStripeConfigured, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                await handleCheckoutComplete(session);
                break;

            case 'customer.subscription.updated':
                const updatedSub = event.data.object;
                await handleSubscriptionUpdate(updatedSub);
                break;

            case 'customer.subscription.deleted':
                const deletedSub = event.data.object;
                await handleSubscriptionCanceled(deletedSub);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Get subscription status
router.get('/subscription-status', async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const result = await query(
            `SELECT u.subscription_tier, s.status, s.current_period_end
       FROM users u
       LEFT JOIN subscriptions s ON u.id = s.user_id
       WHERE u.id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            tier: result.rows[0].subscription_tier || 'free',
            status: result.rows[0].status || 'active',
            currentPeriodEnd: result.rows[0].current_period_end
        });
    } catch (error) {
        console.error('Subscription status error:', error);
        res.status(500).json({ error: 'Failed to get subscription status' });
    }
});

// Helper functions
async function handleCheckoutComplete(session) {
    const userId = parseInt(session.metadata.user_id);
    const tier = session.metadata.tier;

    // Update user's subscription tier
    await query(
        'UPDATE users SET subscription_tier = $1 WHERE id = $2',
        [tier, userId]
    );

    // Update subscriptions table
    await query(
        `UPDATE subscriptions 
     SET stripe_subscription_id = $1, tier = $2, status = $3
     WHERE user_id = $4`,
        [session.subscription, tier, 'active', userId]
    );

    console.log(`User ${userId} subscribed to tier ${tier}`);
}

async function handleSubscriptionUpdate(subscription) {
    const result = await query(
        'SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1',
        [subscription.id]
    );

    if (result.rows.length === 0) return;

    const userId = result.rows[0].user_id;
    const status = subscription.status;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    await query(
        `UPDATE subscriptions 
     SET status = $1, current_period_end = $2
     WHERE stripe_subscription_id = $3`,
        [status, currentPeriodEnd, subscription.id]
    );

    console.log(`Subscription ${subscription.id} updated to status ${status}`);
}

async function handleSubscriptionCanceled(subscription) {
    const result = await query(
        'SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1',
        [subscription.id]
    );

    if (result.rows.length === 0) return;

    const userId = result.rows[0].user_id;

    // Revert to free tier
    await query(
        'UPDATE users SET subscription_tier = $1 WHERE id = $2',
        ['free', userId]
    );

    await query(
        `UPDATE subscriptions 
     SET status = $1, tier = $2
     WHERE stripe_subscription_id = $3`,
        ['canceled', 'free', subscription.id]
    );

    console.log(`User ${userId} subscription canceled, reverted to free tier`);
}

module.exports = router;
