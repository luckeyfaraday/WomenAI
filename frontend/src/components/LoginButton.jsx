import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginButton.css';

export default function LoginButton() {
    const { user, login, logout } = useAuth();

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
                <button onClick={logout} className="btn btn-secondary logout-btn">
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        );
    }

    return (
        <button onClick={login} className="btn btn-primary login-btn">
            <LogIn size={16} />
            Sign in with Google
        </button>
    );
}
