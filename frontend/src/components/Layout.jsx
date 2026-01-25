import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { user, loading, login } = useAuth();

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg)'
            }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return <LoginPage />;
    }

    return (
        <div className="layout">
            {!isMobile && <Sidebar />}

            <main className="main-content">
                <Outlet />
            </main>

            {isMobile && <BottomNav />}
        </div>
    );
}
