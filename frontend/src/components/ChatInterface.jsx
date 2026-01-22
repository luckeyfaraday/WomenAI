import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import './ChatInterface.css';

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m your WomenAI companion. I\'m here to support you with health tracking, emotional wellness, and safety information. How can I help you today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            // TODO: Replace with actual AI API call
            const response = await axios.post(`${API_BASE_URL}/api/chat`, {
                message: userMessage,
                history: messages
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.response
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I\'m having trouble connecting right now. Please try again in a moment.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container card">
            <div className="chat-header">
                <MessageCircle className="icon-primary" />
                <h3>Chat with WomenAI</h3>
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
                    placeholder="Ask me anything..."
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
    );
}
