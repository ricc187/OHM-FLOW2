
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Chantier } from '../types';
import { fetchChantiers } from '../store';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [filter, setFilter] = useState<'all' | 'active'>('active');

  useEffect(() => {
    const load = async () => {
      let list = await fetchChantiers();
      if (user.role === 'user') {
        list = list.filter(c => c.actif);
      }
      setChantiers(list);
    };
    load();
  }, [user]);

  const filteredList = filter === 'active' ? chantiers.filter(c => c.actif) : chantiers;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Tableau de Bord</h1>
          <p className="text-white/50 font-medium">Gestion des chantiers en cours et archivés</p>
        </div>
        
        {user.role === 'admin' && (
          <div className="flex p-1 bg-card rounded-xl border border-white/10 self-start">
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'active' ? 'bg-accent text-background shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              ACTIFS
            </button>
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-accent text-background shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              TOUS
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map(chantier => (
          <Link 
            key={chantier.id} 
            to={`/chantier/${chantier.id}`}
            className="group bg-card p-6 rounded-2xl border border-white/5 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-widest ${chantier.actif ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-white/40'}`}>
                  {chantier.actif ? 'En Cours' : 'Terminé'}
                </span>
                <span className="text-white/40 font-bold text-sm">{chantier.annee}</span>
              </div>
              <h2 className="text-2xl font-black group-hover:text-accent transition-colors">{chantier.nom}</h2>
            </div>
            
            <div className="mt-8 flex items-center justify-between text-white/60">
              <span className="text-xs font-bold uppercase tracking-tighter">Ouvrir le dossier</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredList.length === 0 && (
        <div className="text-center py-20 bg-card/50 rounded-3xl border border-dashed border-white/5">
          <p className="text-white/40 font-bold">Aucun chantier à afficher</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
