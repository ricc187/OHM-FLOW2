
export type Role = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  role: Role;
}

export interface Chantier {
  id: number;
  nom: string;
  annee: number;
  pdf_path?: string;
  actif: boolean;
}

export interface Entry {
  id: number;
  user_id: number;
  chantier_id: number;
  date: string;
  heures: number;
  materiel: number;
}

export interface EntryWithUser extends Entry {
  username: string;
}
