import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import API_BASE_URL from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            // Check for token in URL (Web Handoff)
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (token) {
                console.log("Token detected in URL, attempting exchange...", token);
                try {
                    // Exchange token for session cookie
                    const res = await axios.post(`${API_BASE_URL}/auth/mobile-login`, { token }, { withCredentials: true });
                    console.log("Token exchange successful:", res.data);

                    // Clear token from URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (err) {
                    console.error("Token Exchange Failed:", err);
                }
            }

            console.log("Checking auth status...");
            await checkAuth();
        };

        initAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/user`, {
                withCredentials: true
            });
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        // Check if running in native app
        const isNative = window.Capacitor?.isNative;
        const currentOrigin = window.location.origin;

        if (isNative) {
            // Use Browser plugin for secure auth
            await Browser.open({
                url: `${API_BASE_URL}/auth/google?platform=mobile`
            });
        } else {
            // Standard Web Redirect - Pass current origin so backend knows where to return
            window.location.href = `${API_BASE_URL}/auth/google?origin=${encodeURIComponent(currentOrigin)}`;
        }
    };

    const loginAsGuest = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/auth/guest`, {}, { withCredentials: true });
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Guest login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${API_BASE_URL}/auth/logout`, {
                withCredentials: true
            });
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Listen for Deep Links (Mobile)
    useEffect(() => {
        if (!window.Capacitor?.isNative) return;

        const handleDeepLink = async (event) => {
            if (event.url.includes('womenai://auth/success')) {
                const url = new URL(event.url);
                const token = url.searchParams.get('token');

                if (token) {
                    // Close the browser window
                    await Browser.close();

                    // Exchange token for session cookie
                    try {
                        setLoading(true);
                        await axios.post(`${API_BASE_URL}/auth/mobile-login`, { token }, { withCredentials: true });
                        await checkAuth(); // Refresh user state
                    } catch (err) {
                        console.error("Token Exchange Failed:", err);
                    } finally {
                        setLoading(false);
                    }
                }
            }
        };

        App.addListener('appUrlOpen', handleDeepLink);

        return () => {
            App.removeAllListeners();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, loginAsGuest, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
