import { useState } from 'react';
import CycleLog from '../components/CycleLog';
import MoodTracker from '../components/MoodTracker';
import ChatInterface from '../components/ChatInterface';

export default function Dashboard() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="container">
            <h1 style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-primary)' }}>
                Welcome to WomenAI
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
                Your personal health and wellness companion
            </p>

            <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <CycleLog onSuccess={handleSuccess} />
                <MoodTracker onSuccess={handleSuccess} />
            </div>

            <div style={{ marginTop: 'var(--space-xl)' }}>
                <ChatInterface />
            </div>
        </div>
    );
}
