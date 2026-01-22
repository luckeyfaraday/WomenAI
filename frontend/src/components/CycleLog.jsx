import { useState } from 'react';
import { Calendar } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function CycleLog({ onSuccess }) {
    const [startDate, setStartDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/cycles`, {
                start_date: startDate,
                user_id: 1
            });

            if (onSuccess) onSuccess();
            setStartDate('');
            alert('Cycle logged successfully!');
        } catch (error) {
            console.error('Error logging cycle:', error);
            alert('Failed to log cycle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar className="icon-primary" />
                Log Period Start
            </h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="start-date" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Start Date
                    </label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging...' : 'Log Cycle'}
                </button>
            </form>
        </div>
    );
}
