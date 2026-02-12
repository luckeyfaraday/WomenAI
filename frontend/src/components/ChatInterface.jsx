import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, LogIn } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';
import UpgradePrompt from './UpgradePrompt';
import './ChatInterface.css';

export default function ChatInterface() {
    const { user, login } = useAuth();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m your ClaraAI companion. I\'m here to support you with health tracking, emotional wellness, and safety information. How can I help you today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const messagesEndRef = useRef(null);

    const isGuest = user?.is_guest === true;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        // Check if guest - prompt login instead of trying to chat
        if (isGuest) {
            setShowLoginPrompt(true);
            setMessages(prev => [...prev, 
                { role: 'user', content: input.trim() },
                { role: 'assistant', content: 'To chat with me, please sign in with your Google account. It only takes a moment! 💜' }
            ]);
            setInput('');
            return;
        }

        const userMessage = input.trim();
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/chat`, {
                message: userMessage,
                history: messages
            }, { withCredentials: true });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.response
            }]);
        } catch (error) {
            console.error('Chat error:', error);

            // Handle rate limit error
            if (error.response?.status === 429) {
                setShowUpgrade(true);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'You\'ve reached your free tier limit for today. Upgrade to Premium for unlimited chat! 💜'
                }]);
            } else if (error.response?.status === 401) {
                // Unauthorized - prompt login
                setShowLoginPrompt(true);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Please sign in to continue chatting with me. 💜'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'I\'m having trouble connecting right now. Please try again in a moment.'
                }]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showUpgrade && (
                <UpgradePrompt
                    limit={10}
                    resourceType="messages"
                    onClose={() => setShowUpgrade(false)}
                />
            )}
            
            {showLoginPrompt && (
                <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
                    <div className="login-prompt-modal" onClick={e => e.stopPropagation()}>
                        <h3>Sign in to Chat</h3>
                        <p>Create a free account to start chatting with ClaraAI. Your conversations and health data will be saved securely.</p>
                        <button className="btn btn-primary" onClick={login} style={{ width: '100%', marginTop: 'var(--space-md)' }}>
                            <LogIn size={18} style={{ marginRight: '0.5rem' }} />
                            Sign in with Google
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => setShowLoginPrompt(false)} 
                            style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            )}

            <div className="chat-container card">
                <div className="chat-header">
                    <MessageCircle className="icon-primary" />
                    <h3>Chat with ClaraAI</h3>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message assistant">
                            <div className="message-content typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="chat-input-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isGuest ? "Sign in to chat..." : "Ask me anything..."}
                        disabled={loading}
                        className="chat-input"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="btn btn-primary chat-send-btn"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </>
    );
}
