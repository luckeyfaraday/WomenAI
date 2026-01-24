import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
