import { Check } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useState } from 'react';
import './Pricing.css';

export default function Pricing() {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async (priceId, tier) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_BASE_URL}/api/stripe/create-checkout-session`,
                { priceId, tier },
                { withCredentials: true }
            );

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to start checkout. Please try again or login first.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container pricing-page">
            <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Choose Your Plan</h1>
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
                Start free, upgrade anytime
            </p>

            <div className="pricing-grid">
                {/* Free Tier */}
                <div className="pricing-card">
                    <div className="pricing-header">
                        <h3>Free</h3>
                        <div className="pricing-price">
                            <span className="price">$0</span>
                            <span className="period">/month</span>
                        </div>
                    </div>

                    <ul className="pricing-features">
                        <li><Check size={20} /> <span>10 AI chat messages/day</span></li>
                        <li><Check size={20} /> <span>10 cycle entries/month</span></li>
                        <li><Check size={20} /> <span>10 mood logs/month</span></li>
                        <li><Check size={20} /> <span>Basic safety resources</span></li>
                    </ul>

                    <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
                        Current Plan
                    </button>
                </div>

                {/* Premium Tier */}
                <div className="pricing-card pricing-card-featured">
                    <div className="featured-badge">Most Popular</div>
                    <div className="pricing-header">
                        <h3>Premium</h3>
                        <div className="pricing-price">
                            <span className="price">$19.99</span>
                            <span className="period">/month</span>
                        </div>
                    </div>

                    <ul className="pricing-features">
                        <li><Check size={20} /> <span><strong>Unlimited</strong> AI chat</span></li>
                        <li><Check size={20} /> <span><strong>Unlimited</strong> cycle tracking</span></li>
                        <li><Check size={20} /> <span><strong>Unlimited</strong> mood logging</span></li>
                        <li><Check size={20} /> <span>Advanced analytics</span></li>
                        <li><Check size={20} /> <span>Data export (CSV)</span></li>
                        <li><Check size={20} /> <span>Priority support</span></li>
                        <li><Check size={20} /> <span>Ad-free experience</span></li>
                    </ul>

                    <button
                        className="btn btn-primary"
                        onClick={() => handleUpgrade('PRICE_ID_HERE', 'premium')}
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Loading...' : 'Upgrade to Premium'}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                        7-day free trial included
                    </p>
                </div>
            </div>

            <div className="pricing-faq" style={{ marginTop: 'var(--space-xl)', maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>FAQ</h3>
                <details className="faq-item">
                    <summary>Can I cancel anytime?</summary>
                    <p>Yes, you can cancel your subscription at any time. You'll retain Premium access until the end of your billing period.</p>
                </details>
                <details className="faq-item">
                    <summary>Is there a free trial?</summary>
                    <p>Yes! Premium includes a 7-day free trial. No credit card required to start.</p>
                </details>
                <details className="faq-item">
                    <summary>Is my data private and secure?</summary>
                    <p>Absolutely. Your health data is encrypted and never shared. We're HIPAA-compliant and you always own your data.</p>
                </details>
            </div>
        </div>
    );
}
