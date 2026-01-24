import React from 'react';

const DesignSystem = () => {
    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h1>Design System</h1>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>
                Reference for WomenAI UI components and tokens.
            </p>

            <section className="card" style={{ marginBottom: '2rem' }}>
                <h2>Colors</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <ColorSwatch name="Primary" varName="--color-primary" />
                    <ColorSwatch name="Primary Light" varName="--color-primary-light" />
                    <ColorSwatch name="Primary Dark" varName="--color-primary-dark" />
                    <ColorSwatch name="Secondary" varName="--color-secondary" />
                    <ColorSwatch name="Background" varName="--color-bg" />
                    <ColorSwatch name="Surface" varName="--color-surface" />
                    <ColorSwatch name="Text" varName="--color-text" />
                </div>
            </section>

            <section className="card" style={{ marginBottom: '2rem' }}>
                <h2>Typography</h2>
                <div style={{ marginTop: '1rem' }}>
                    <h1>Heading 1 (Playfair Display)</h1>
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <p>Body text (Inter). Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <p className="text-muted">Muted text. Ut enim ad minim veniam, quis nostrud exercitation.</p>
                </div>
            </section>

            <section className="card" style={{ marginBottom: '2rem' }}>
                <h2>Buttons</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <button className="btn btn-primary">Primary Button</button>
                    <button className="btn btn-secondary">Secondary Button</button>
                    <button className="btn btn-glass">Glass Button</button>
                </div>
            </section>

            <section className="card" style={{ marginBottom: '2rem' }}>
                <h2>Inputs</h2>
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem', maxWidth: '400px' }}>
                    <input type="text" placeholder="Text Input" />
                    <input type="text" placeholder="Focused Input" autoFocus />
                    <select>
                        <option>Select Option</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                    </select>
                </div>
            </section>

            <section className="card glass-panel" style={{ marginBottom: '2rem' }}>
                <h2>Glassmorphism</h2>
                <p>This card uses the <code>.glass-panel</code> utility.</p>
                <div style={{ marginTop: '1rem' }}>
                    <button className="btn btn-primary">Action</button>
                </div>
            </section>
        </div>
    );
};

const ColorSwatch = ({ name, varName }) => (
    <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ height: '80px', background: `var(${varName})` }}></div>
        <div style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
            <strong>{name}</strong><br />
            <code style={{ fontSize: '0.7rem' }}>{varName}</code>
        </div>
    </div>
);

export default DesignSystem;
