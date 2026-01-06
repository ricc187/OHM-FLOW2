
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { User } from './types';
import { getStoredUser, setStoredUser } from './store';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChantierDetail from './components/ChantierDetail';

const Navbar: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
  <nav className="bg-card border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
    <Link to="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-background font-bold group-hover:scale-105 transition-transform">
        Ω
      </div>
      <span className="text-xl font-black tracking-tighter text-accent">OHM FLOW</span>
    </Link>
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-text">{user.username}</p>
        <p className="text-[10px] uppercase tracking-widest text-accent font-medium">{user.role}</p>
      </div>
      <button 
        onClick={onLogout}
        className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-accent transition-colors"
        title="Se déconnecter"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>
  </nav>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(getStoredUser());

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setStoredUser(loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setStoredUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background text-text">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="container mx-auto max-w-5xl px-4 py-8">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/chantier/:id" 
              element={user ? <ChantierDetail user={user} /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
