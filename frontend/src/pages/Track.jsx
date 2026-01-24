import { useState, useEffect } from 'react';
import { Calendar, Smile } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import CycleLog from '../components/CycleLog';
import MoodTracker from '../components/MoodTracker';

export default function Track() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [cycles, setCycles] = useState([]);
    const [moods, setMoods] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Fetch history whenever a new log is added (refreshKey changes)
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [cyclesRes, moodsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/cycles`),
                    axios.get(`${API_BASE_URL}/api/mood`)
                ]);
                setCycles(cyclesRes.data);
                setMoods(moodsRes.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [refreshKey]);

    return (
        <div className="container">
            <h1 style={{ marginBottom: 'var(--space-md)', color: 'var(--color-primary)' }}>
                Track Your Health
            </h1>

            {/* Loggers */}
            <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: 'var(--space-xl)' }}>
                <CycleLog onSuccess={handleSuccess} />
                <MoodTracker onSuccess={handleSuccess} />
            </div>

            {/* History Section */}
            <h2 style={{ marginBottom: 'var(--space-md)', color: 'var(--color-text-muted)', fontSize: '1.5rem' }}>
                History
            </h2>

            <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Cycle History */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
                        <Calendar className="icon-primary" />
                        Cycle Logs
                    </h3>
                    {loadingHistory ? (
                        <p>Loading...</p>
                    ) : cycles.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)' }}>No cycles logged yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {cycles.map(cycle => (
                                <div
                                    key={cycle.id}
                                    style={{
                                        padding: 'var(--space-sm)',
                                        background: 'var(--color-bg)',
                                        borderRadius: 'var(--radius-sm)',
                                        borderLeft: '4px solid var(--color-primary)'
                                    }}
                                >
                                    <div style={{ fontWeight: 500 }}>
                                        {new Date(cycle.start_date).toLocaleDateString()}
                                    </div>
                                    {cycle.end_date && (
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                            Ended: {new Date(cycle.end_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mood History */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
                        <Smile className="icon-primary" />
                        Mood Logs
                    </h3>
                    {loadingHistory ? (
                        <p>Loading...</p>
                    ) : moods.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)' }}>No moods logged yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {moods.map(mood => (
                                <div
                                    key={mood.id}
                                    style={{
                                        padding: 'var(--space-sm)',
                                        background: 'var(--color-bg)',
                                        borderRadius: 'var(--radius-sm)',
                                        borderLeft: '4px solid var(--color-secondary)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 500 }}>
                                            Mood: {mood.mood_score}/5
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                            {new Date(mood.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {mood.tags && mood.tags.length > 0 && (
                                        <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                            {mood.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        padding: '0.125rem 0.5rem',
                                                        background: 'var(--color-secondary-light)',
                                                        borderRadius: 'var(--radius-sm)'
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {mood.notes && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontStyle: 'italic' }}>
                                            "{mood.notes}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
