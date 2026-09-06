export interface DechargeBacType {
  nature: string | null;
  capacite: string | null;
  matiere: string | null;
  color: string | null;
  variante: string | null;
}

export interface DechargeBac {
  bacSerie: string | null;
  rfidSerie: string | null;
  bacType: DechargeBacType | null;
}

export interface DechargeSession {
  id: number;
  address: string | null;
  pointDeRegroupement: string | null;
  installedAt: string | null;
  arrondissement: string | null;
  prefecture: string | null;
  ville: string | null;
  bacs: DechargeBac[];
}

export interface Decharge {
  id: number;
  nom: string;
  prenom: string;
  cin: string | null;
  telephone: string;
  createdAt: string;
  signatureBeneficiaireUrl: string | null;
  signatureAgentUrl: string | null;
  session: DechargeSession | null;
}