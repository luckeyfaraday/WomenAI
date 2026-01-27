import { useEffect, useState } from 'react';
import { Crown, Settings, Zap } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import './SubscriptionStatus.css';

export default function SubscriptionStatus() {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/stripe/subscription-status`, {
                withCredentials: true
            });
            setSubscription(response.data);
        } catch (error) {
            console.error('Subscription fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManageBilling = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/stripe/create-portal-session`,
                {},
                { withCredentials: true }
            );

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Portal error:', error);
            alert('Failed to open billing portal. Please try again.');
        }
    };

    if (loading) {
        return <div className="card">Loading subscription...</div>;
    }

    const tier = subscription?.tier || 'free';
    const isPremium = tier === 'premium';
    const isPro = tier === 'pro';
    const isPaid = isPremium || isPro;

    const tierConfig = {
        free: { icon: Settings, badge: '🌱 Free', class: '' },
        premium: { icon: Crown, badge: '👑 Premium', class: 'premium' },
        pro: { icon: Zap, badge: '⚡ Pro', class: 'pro' }
    };

    const config = tierConfig[tier] || tierConfig.free;
    const TierIcon = config.icon;

    return (
        <div className="card subscription-status">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TierIcon className="icon-primary" />
                Subscription
            </h3>

            <div className="subscription-badge-container">
                <div className={`subscription-badge ${config.class}`}>
                    {config.badge}
                </div>
            </div>

            {isPaid ? (
                <>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
                        {isPro 
                            ? 'You have full Pro access with our best AI model' 
                            : 'You have unlimited access to all WomenAI features'}
                    </p>
                    {subscription.currentPeriodEnd && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
                            Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                    )}
                    <button
                        onClick={handleManageBilling}
                        className="btn btn-secondary"
                        style={{ marginTop: 'var(--space-md)', width: '100%' }}
                    >
                        Manage Billing
                    </button>
                </>
            ) : (
                <>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
                        You're on the free plan. Upgrade for unlimited access!
                    </p>
                    <ul style={{ margin: 'var(--space-md) 0', paddingLeft: 'var(--space-md)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        <li>Unlimited AI chat</li>
                        <li>Better AI models</li>
                        <li>Advanced analytics</li>
                        <li>Data export</li>
                    </ul>
                    <a href="/pricing" className="btn btn-primary" style={{ width: '100%' }}>
                        View Plans
                    </a>
                </>
            )}
        </div>
    );
}
