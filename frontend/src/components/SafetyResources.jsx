import { useEffect, useState } from 'react';
import { Shield, Phone, Globe } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function SafetyResources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/safety`);
                if (response.data && response.data.length > 0) {
                    setResources(response.data);
                } else {
                    throw new Error('No data');
                }
            } catch (error) {
                console.warn('Backend not available, using fallback data');
                setResources([
                    { id: 1, name: 'National Domestic Violence Hotline', category: 'Domestic Violence', phone: '1-800-799-7233', website: 'https://www.thehotline.org' },
                    { id: 2, name: 'RAINN (National Sexual Assault Hotline)', category: 'Sexual Assault', phone: '1-800-656-4673', website: 'https://www.rainn.org' },
                    { id: 3, name: 'Crisis Text Line', category: 'Crisis Support', phone: 'Text HOME to 741741', website: 'https://www.crisistextline.org' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    if (loading) {
        return <div className="card">Loading resources...</div>;
    }

    return (
        <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Shield className="icon-primary" />
                Safety Resources
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {resources.map(resource => (
                    <div
                        key={resource.id}
                        style={{
                            padding: '1.5rem',
                            border: '2px solid var(--color-primary-light)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                            e.currentTarget.style.background = 'var(--color-surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-primary-light)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                            {resource.name}
                        </h4>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                            {resource.category}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {resource.phone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Phone size={16} />
                                    <a href={`tel:${resource.phone}`} style={{ color: 'var(--color-text)', textDecoration: 'none' }}>
                                        {resource.phone}
                                    </a>
                                </div>
                            )}
                            {resource.website && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Globe size={16} />
                                    <a
                                        href={resource.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
