import { NavLink } from 'react-router-dom';
import { Calendar, Smile, Shield, MessageCircle, Settings } from 'lucide-react';
import LoginButton from './LoginButton';
import './Sidebar.css';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="logo-icon">🌸</span>
                <span className="logo-text">WomenAI</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} end>
                    <MessageCircle size={20} />
                    <span>Chat & Dashboard</span>
                </NavLink>
                <NavLink to="/track" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Calendar size={20} />
                    <span>Track Health</span>
                </NavLink>

                <NavLink to="/safety" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Shield size={20} />
                    <span>Safety Resources</span>
                </NavLink>
                <NavLink to="/account" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>

            </nav>

            <div className="sidebar-footer">
                <LoginButton />
            </div>
        </aside>
    );
}
