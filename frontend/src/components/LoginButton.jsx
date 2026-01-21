import { useState, useEffect } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import axios from 'axios';
import './LoginButton.css';

export default function LoginButton() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/user', {
                withCredentials: true
            });
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:3000/auth/logout', {
                withCredentials: true
            });
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <div className="login-loading">...</div>;
    }

    if (user) {
        return (
            <div className="user-menu">
                {user.picture && (
                    <img
                        src={user.picture}
                        alt={user.name}
                        className="user-avatar"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                )}
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary logout-btn">
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        );
    }

    return (
        <button onClick={handleLogin} className="btn btn-primary login-btn">
            <LogIn size={16} />
            Sign in with Google
        </button>
    );
}
