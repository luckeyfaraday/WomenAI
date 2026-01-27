import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Pricing.css';

export default function Pricing() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = (tier) => {
        if (!user) {
            alert('Please login to upgrade.');
            return;
        }

        // Use Stripe Payment Links with client_reference_id for webhook matching
        const paymentLinks = {
            premium: `https://buy.stripe.com/bJe4gy1yk2Bj5nTdte4wM01?client_reference_id=${user.id}`,
            pro: `https://buy.stripe.com/PRO_PAYMENT_LINK_HERE?client_reference_id=${user.id}`
        };

        window.location.href = paymentLinks[tier];
    };

    const currentTier = user?.subscription_tier || 'free';

    return (
        <div className="container pricing-page">
            <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Choose Your Plan</h1>
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
                Start free, upgrade anytime
            </p>

            <div className="pricing-grid pricing-grid-3">
                {/* Free Tier */}
                <div className={`pricing-card ${currentTier === 'free' ? 'pricing-card-current' : ''}`}>
                    <div className="pricing-header">
                        <div className="tier-icon"><Sparkles size={24} /></div>
                        <h3>Free</h3>
                        <div className="pricing-price">
                            <span className="price">$0</span>
                            <span className="period">/month</span>
                        </div>
                    </div>

                    <ul className="pricing-features">
                        <li><Check size={20} /> <span>10 AI chat messages/day</span></li>
                        <li><Check size={20} /> <span>Basic AI model</span></li>
                        <li><Check size={20} /> <span>Cycle tracking</span></li>
                        <li><Check size={20} /> <span>Mood logging</span></li>
                        <li><Check size={20} /> <span>Safety resources</span></li>
                    </ul>

                    <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
                        {currentTier === 'free' ? 'Current Plan' : 'Free Plan'}
                    </button>
                </div>

                {/* Premium Tier */}
                <div className={`pricing-card pricing-card-featured ${currentTier === 'premium' ? 'pricing-card-current' : ''}`}>
                    <div className="featured-badge">Most Popular</div>
                    <div className="pricing-header">
                        <div className="tier-icon"><Crown size={24} /></div>
                        <h3>Premium</h3>
                        <div className="pricing-price">
                            <span className="price">$19.99</span>
                            <span className="period">/month</span>
                        </div>
                    </div>

                    <ul className="pricing-features">
                        <li><Check size={20} /> <span><strong>Unlimited</strong> AI chat</span></li>
                        <li><Check size={20} /> <span>Enhanced AI model</span></li>
                        <li><Check size={20} /> <span>Longer responses</span></li>
                        <li><Check size={20} /> <span>Unlimited tracking</span></li>
                        <li><Check size={20} /> <span>Data export (CSV)</span></li>
                        <li><Check size={20} /> <span>Ad-free experience</span></li>
                    </ul>

                    {currentTier === 'premium' ? (
                        <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
                            Current Plan
                        </button>
                    ) : currentTier === 'pro' ? (
                        <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
                            Included in Pro
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={() => handleUpgrade('premium')}
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Loading...' : 'Upgrade to Premium'}
                        </button>
                    )}
                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                        7-day free trial included
                    </p>
                </div>

                {/* Pro Tier */}
                <div className={`pricing-card pricing-card-pro ${currentTier === 'pro' ? 'pricing-card-current' : ''}`}>
                    <div className="pro-badge">Best Value</div>
                    <div className="pricing-header">
                        <div className="tier-icon"><Zap size={24} /></div>
                        <h3>Pro</h3>
                        <div className="pricing-price">
                            <span className="price">$99.99</span>
                            <span className="period">/month</span>
                        </div>
                    </div>

                    <ul className="pricing-features">
                        <li><Check size={20} /> <span><strong>Everything in Premium</strong></span></li>
                        <li><Check size={20} /> <span><strong>Best AI model</strong> (most accurate)</span></li>
                        <li><Check size={20} /> <span><strong>Longest responses</strong> (1000 tokens)</span></li>
                        <li><Check size={20} /> <span>Priority support</span></li>
                        <li><Check size={20} /> <span>Advanced analytics</span></li>
                        <li><Check size={20} /> <span>Early access to new features</span></li>
                    </ul>

                    {currentTier === 'pro' ? (
                        <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
                            Current Plan
                        </button>
                    ) : (
                        <button
                            className="btn btn-pro"
                            onClick={() => handleUpgrade('pro')}
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Loading...' : 'Go Pro'}
                        </button>
                    )}
                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                        For power users
                    </p>
                </div>
            </div>

            <div className="pricing-faq" style={{ marginTop: 'var(--space-xl)', maxWidth: '600px', margin: 'var(--space-xl) auto 0' }}>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>FAQ</h3>
                <details className="faq-item">
                    <summary>Can I cancel anytime?</summary>
                    <p>Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.</p>
                </details>
                <details className="faq-item">
                    <summary>What's the difference between Premium and Pro?</summary>
                    <p>Pro uses our most advanced AI model for more accurate, detailed responses. You also get priority support and early access to new features.</p>
                </details>
                <details className="faq-item">
                    <summary>Is my data private and secure?</summary>
                    <p>Absolutely. Your health data is encrypted and never shared. You always own your data.</p>
                </details>
            </div>
        </div>
    );
}
