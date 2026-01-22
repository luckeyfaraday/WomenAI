import SubscriptionStatus from '../components/SubscriptionStatus';

export default function Account() {
    return (
        <div className="container">
            <h1 style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-primary)' }}>
                Account Settings
            </h1>

            <div style={{ maxWidth: '600px' }}>
                <SubscriptionStatus />
            </div>
        </div>
    );
}
