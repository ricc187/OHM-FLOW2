
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Chantier, EntryWithUser } from '../types';
import { fetchChantiers, fetchEntries, saveEntry } from '../store';

interface ChantierDetailProps {
  user: User;
}

const ChantierDetail: React.FC<ChantierDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [chantier, setChantier] = useState<Chantier | null>(null);
  const [entries, setEntries] = useState<EntryWithUser[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formHeures, setFormHeures] = useState(0);
  const [formMateriel, setFormMateriel] = useState(0);

  const loadData = async () => {
    const cid = parseInt(id || '0');
    const allChantiers = await fetchChantiers();
    const siteEntries = await fetchEntries(cid);
    
    const current = allChantiers.find(c => c.id === cid);
    if (current) {
      setChantier(current);
      setEntries(siteEntries);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const stats = useMemo(() => {
    const totalMat = entries.reduce((acc, curr) => acc + curr.materiel, 0);
    const totalHours = entries.reduce((acc, curr) => acc + curr.heures, 0);
    
    const hoursByWorker = entries.reduce((acc, curr) => {
      acc[curr.username] = (acc[curr.username] || 0) + curr.heures;
      return acc;
    }, {} as Record<string, number>);

    return { totalMat, totalHours, hoursByWorker };
  }, [entries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chantier) return;

    await saveEntry({
      user_id: user.id,
      chantier_id: chantier.id,
      date: formDate,
      heures: formHeures,
      materiel: formMateriel
    });

    setShowModal(false);
    setFormHeures(0);
    setFormMateriel(0);
    loadData();
  };

  if (!chantier) return <div className="text-center py-20 text-white/40">Chargement...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-white/10 hover:border-accent hover:text-accent transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">{chantier.nom}</h1>
            <p className="text-white/50 font-medium">Référence {chantier.annee}-{chantier.id.toString().padStart(3, '0')}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-accent text-background px-6 py-4 rounded-xl font-black hover:scale-105 transition-transform shadow-lg shadow-accent/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          SAISIR UNE ENTRÉE
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-white/5">
          <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">TOTAL MATÉRIEL</p>
          <p className="text-3xl font-black text-accent">{stats.totalMat.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-white/5">
          <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">CUMUL HEURES</p>
          <p className="text-3xl font-black text-accent">{stats.totalHours.toFixed(1)} <span className="text-sm">Heures</span></p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
          <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">DOCUMENTS</p>
          <button className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            Consulter le plan PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-black uppercase tracking-widest text-white/80 flex items-center gap-2">
            <div className="w-1 h-6 bg-accent rounded-full"></div>
            Historique des Saisies
          </h3>
          <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Technicien</th>
                    <th className="px-6 py-4">Heures</th>
                    <th className="px-6 py-4">Matériel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {entries.map(entry => (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white/60">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 font-bold">{entry.username}</td>
                      <td className="px-6 py-4 text-accent">{entry.heures}h</td>
                      <td className="px-6 py-4">{entry.materiel > 0 ? `${entry.materiel}€` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase tracking-widest text-white/80 flex items-center gap-2">
            <div className="w-1 h-6 bg-accent rounded-full"></div>
            Répartition Heures
          </h3>
          <div className="bg-card p-6 rounded-2xl border border-white/5 space-y-4">
            {Object.entries(stats.hoursByWorker).map(([name, h]) => (
              <div key={name} className="flex justify-between items-center group">
                <span className="font-bold text-white/60 group-hover:text-white transition-colors">{name}</span>
                <span className="font-black text-accent">{h.toFixed(1)}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-lg bg-card border border-white/10 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black mb-6 text-accent">Nouvelle Saisie</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Date d'intervention</label>
                  <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Heures</label>
                  <input type="number" step="0.5" value={formHeures} onChange={(e) => setFormHeures(parseFloat(e.target.value))} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Matériel (€)</label>
                  <input type="number" step="0.01" value={formMateriel} onChange={(e) => setFormMateriel(parseFloat(e.target.value))} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent font-bold" />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 rounded-xl font-black text-white/40 hover:bg-white/5 transition-all">ANNULER</button>
                <button type="submit" className="flex-[2] bg-accent text-background px-6 py-4 rounded-xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all">ENREGISTRER</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChantierDetail;
