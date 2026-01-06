import { User, Chantier, Entry, EntryWithUser } from './types';

const API_BASE = '/api';

// Utilitaire pour détecter si on tourne en local ou via le serveur Flask
const isLocalOnly = () => window.location.hostname !== 'localhost' && !window.location.port;

// --- GESTION UTILISATEUR ---

export const getStoredUser = (): User | null => {
  const user = localStorage.getItem('ohm_user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: User | null) => {
  if (user) localStorage.setItem('ohm_user', JSON.stringify(user));
  else localStorage.removeItem('ohm_user');
};

// Fixed type inference by explicitly setting return type to User[]
export const getUsers = (): User[] => [
  { id: 1, username: 'Patron', role: 'admin' },
  { id: 2, username: 'Thomas', role: 'user' },
  { id: 3, username: 'Lucas', role: 'user' },
];

// --- GESTION API / DATA ---

export const fetchChantiers = async (): Promise<Chantier[]> => {
  try {
    const res = await fetch(`${API_BASE}/chantiers`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (e) {
    // Fallback localStorage pour la preview
    const stored = localStorage.getItem('ohm_chantiers');
    return stored ? JSON.parse(stored) : [
      { id: 1, nom: 'Villa Bel-Air', annee: 2024, actif: true },
      { id: 2, nom: 'Résidence Azur', annee: 2024, actif: true },
      { id: 3, nom: 'Clinique du Parc', annee: 2023, actif: false },
    ];
  }
};

export const fetchEntries = async (chantierId: number): Promise<EntryWithUser[]> => {
  try {
    const res = await fetch(`${API_BASE}/chantiers/${chantierId}/entries`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (e) {
    const stored = localStorage.getItem('ohm_entries');
    const allEntries: Entry[] = stored ? JSON.parse(stored) : [];
    const users = getUsers();
    return allEntries
      .filter(e => e.chantier_id === chantierId)
      .map(e => ({
        ...e,
        username: users.find(u => u.id === e.user_id)?.username || 'Inconnu'
      }));
  }
};

export const saveEntry = async (entry: Omit<Entry, 'id'>) => {
  try {
    const res = await fetch(`${API_BASE}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    return await res.json();
  } catch (e) {
    // Fallback localStorage
    const stored = localStorage.getItem('ohm_entries');
    const entries = stored ? JSON.parse(stored) : [];
    const newEntry = { ...entry, id: Date.now() };
    localStorage.setItem('ohm_entries', JSON.stringify([...entries, newEntry]));
    return newEntry;
  }
};