import { Link, Outlet } from 'react-router-dom';
import { Calendar, Smile, Shield } from 'lucide-react';
import LoginButton from './LoginButton';
import './Layout.css';

export default function Layout() {
    return (
        <div className="layout">
            <nav className="navbar">
                <div className="container">
                    <div className="nav-brand">
                        <span style={{ fontSize: '2rem' }}>🌸</span>
                        <span className="nav-title">WomenAI</span>
                    </div>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">
                            <Calendar size={20} />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/history" className="nav-link">
                            <Smile size={20} />
                            <span>History</span>
                        </Link>
                        <Link to="/safety" className="nav-link">
                            <Shield size={20} />
                            <span>Safety</span>
                        </Link>
                    </div>
                    <LoginButton />
                </div>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
