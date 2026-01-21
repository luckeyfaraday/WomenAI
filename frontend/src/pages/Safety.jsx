import SafetyResources from '../components/SafetyResources';

export default function Safety() {
    return (
        <div className="container">
            <h1 style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-primary)' }}>
                Safety & Support
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
                You are not alone. Here are trusted resources available 24/7.
            </p>

            <SafetyResources />
        </div>
    );
}
