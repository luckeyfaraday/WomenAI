import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Track from './pages/Track';

import Safety from './pages/Safety';
import Pricing from './pages/Pricing';
import Account from './pages/Account';
import DesignSystem from './pages/DesignSystem';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="track" element={<Track />} />

            <Route path="safety" element={<Safety />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="account" element={<Account />} />
            <Route path="design" element={<DesignSystem />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
