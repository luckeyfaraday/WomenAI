import ChatInterface from '../components/ChatInterface';

export default function Dashboard() {
    return (
        <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-md)' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                    Good Morning
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    How are you feeling today?
                </p>
            </div>

            <ChatInterface />
        </div>
    );
}
