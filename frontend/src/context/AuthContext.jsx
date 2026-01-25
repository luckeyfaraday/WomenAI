import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import API_BASE_URL from '../config';

const AuthContext = createContext(null);

// Configure Axios to include token or guest header
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    const isGuest = localStorage.getItem('isGuest');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (isGuest === 'true') {
        config.headers['x-guest-mode'] = 'true';
    }
    
    return config;
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setToken = (token) => {
        if (token) {
            localStorage.setItem('authToken', token);
            localStorage.removeItem('isGuest'); // clear guest if logging in
        } else {
            localStorage.removeItem('authToken');
        }
    };

    const setGuest = (enable) => {
        if (enable) {
            localStorage.setItem('isGuest', 'true');
            localStorage.removeItem('authToken');
        } else {
            localStorage.removeItem('isGuest');
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            // Check for token in URL (Web Handoff)
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (token) {
                console.log("Token detected in URL, saving...", token);
                setToken(token);
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            console.log("Checking auth status...");
            await checkAuth();
        };

        initAuth();
    }, []);

    const checkAuth = async () => {
        // If guest mode is active locally, set user immediately
        if (localStorage.getItem('isGuest') === 'true') {
            setUser({ id: -1, name: 'Guest', email: 'guest@womenai.local', is_guest: true });
            setLoading(false);
            return;
        }

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
        const isNative = window.Capacitor?.isNative;
        const currentOrigin = window.location.origin;

        if (isNative) {
            await Browser.open({
                url: `${API_BASE_URL}/auth/google?platform=mobile`
            });
        } else {
            window.location.href = `${API_BASE_URL}/auth/google?origin=${encodeURIComponent(currentOrigin)}`;
        }
    };

    const loginAsGuest = () => {
        setGuest(true);
        setUser({ id: -1, name: 'Guest', email: 'guest@womenai.local', is_guest: true });
    };

    const logout = async () => {
        try {
            // Only call logout if not guest (guests have no session on server to clear)
            if (!user?.is_guest) {
                await axios.get(`${API_BASE_URL}/auth/logout`, {
                    withCredentials: true
                });
            }
            setToken(null);
            setGuest(false);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Force clear anyway
            setToken(null);
            setUser(null);
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
                    await Browser.close();
                    console.log("Deep link token received, saving...");
                    setToken(token);
                    await checkAuth();
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
