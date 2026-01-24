import { useState } from 'react';
import { Smile, Frown, Meh } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';

const MOOD_OPTIONS = [
    { score: 5, label: 'Excellent', emoji: '😊', color: 'hsl(140, 60%, 50%)' },
    { score: 4, label: 'Good', emoji: '🙂', color: 'hsl(100, 50%, 50%)' },
    { score: 3, label: 'Okay', emoji: '😐', color: 'hsl(45, 70%, 50%)' },
    { score: 2, label: 'Not Great', emoji: '😟', color: 'hsl(30, 70%, 50%)' },
    { score: 1, label: 'Difficult', emoji: '😢', color: 'hsl(0, 60%, 50%)' }
];

const TAG_OPTIONS = ['Anxious', 'Calm', 'Tired', 'Energetic', 'Focused', 'Stressed', 'Happy', 'Sad'];

export default function MoodTracker({ onSuccess }) {
    const [moodScore, setMoodScore] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);


    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!moodScore) {
            alert('Please select a mood');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/mood`, {
                mood_score: moodScore,
                tags: selectedTags,
                notes: notes || null,
                user_id: 1
            });

            if (onSuccess) onSuccess();
            setMoodScore(null);
            setSelectedTags([]);
            setNotes('');
            alert('Mood logged successfully!');
        } catch (error) {
            console.error('Error logging mood:', error);
            alert('Failed to log mood');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smile className="icon-primary" />
                How are you feeling?
            </h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} key={`mood-${moodScore}`}>
                        {MOOD_OPTIONS.map(mood => {
                            const isSelected = moodScore === mood.score;
                            return (
                                <button
                                    key={mood.score}
                                    type="button"
                                    data-selected={isSelected ? 'true' : 'false'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setMoodScore(mood.score);
                                    }}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: isSelected ? `4px solid ${mood.color}` : '2px solid #ddd',
                                        background: isSelected ? mood.color : 'white',
                                        color: isSelected ? 'white' : '#333',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        flex: '1 1 0px',
                                        minWidth: '0',
                                        fontSize: '2rem',
                                        textAlign: 'center',
                                        outline: 'none',
                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    <div>{mood.emoji}</div>
                                    <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{mood.label}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Tags (optional)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {TAG_OPTIONS.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={selectedTags.includes(tag) ? 'btn btn-primary' : 'btn btn-secondary'}
                                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="notes" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Notes (optional)
                    </label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="3"
                        placeholder="How are you feeling today?"
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging...' : 'Log Mood'}
                </button>
            </form>
        </div>
    );
}
