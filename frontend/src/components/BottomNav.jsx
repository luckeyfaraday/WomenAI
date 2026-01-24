import { NavLink } from 'react-router-dom';
import { Calendar, Smile, Shield, MessageCircle } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                <MessageCircle size={24} />
                <span>Chat</span>
            </NavLink>

            <NavLink to="/track" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Calendar size={24} />
                <span>Track</span>
            </NavLink>

            <div className="nav-item-logo">
                🌸
            </div>

            <NavLink to="/safety" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Shield size={24} />
                <span>Safety</span>
            </NavLink>
            <NavLink to="/account" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Smile size={24} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
}
