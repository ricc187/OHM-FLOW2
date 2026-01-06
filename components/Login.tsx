
import React, { useState } from 'react';
import { getUsers } from '../store';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError("Identifiant inconnu (Essayez 'Patron' ou 'Thomas')");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-background text-3xl font-black mb-4 shadow-xl">
            Ω
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-accent">OHM FLOW</h1>
          <p className="text-white/60 mt-2 font-medium">Gestion Électrique Professionnelle</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-white/80">Identifiant</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: Patron, Thomas..."
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-accent text-background py-4 rounded-xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            CONNEXION
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-white/40 uppercase tracking-widest">Logiciel de Gestion Interne</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
