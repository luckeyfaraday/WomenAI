import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import './UpgradePrompt.css';

export default function UpgradePrompt({ limit, resourceType, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="upgrade-prompt-overlay" onClick={handleClose}>
            <div className="upgrade-prompt-modal" onClick={(e) => e.stopPropagation()}>
                <button className="upgrade-prompt-close" onClick={handleClose}>
                    <X size={20} />
                </button>

                <div className="upgrade-prompt-icon">
                    <Sparkles size={48} />
                </div>

                <h3>Upgrade to Premium</h3>
                <p>
                    You've reached your free tier limit of <strong>{limit} {resourceType} per day</strong>.
                </p>
                <p>
                    Upgrade to Premium for unlimited access and support women's health innovation 💜
                </p>

                <div className="upgrade-prompt-actions">
                    <a href="/pricing" className="btn btn-primary">
                        View Pricing
                    </a>
                    <button onClick={handleClose} className="btn btn-secondary">
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}
