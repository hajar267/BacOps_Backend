export interface BacTypeInfo {
  nature: string;
  capacite: string | null;
  matiere: string | null;
  couleur: string | null;
  variante: string | null;
}

export interface CurrentInstallation {
  address: string | null;
  arrond: string | null;
  locationLat: number | null;
  locationLng: number | null;
  installedAt: string;
}

export interface BacSearchResult {
  id: number;
  serialNumber: string;
  rfid: string;
  status: string;
  bacType: BacTypeInfo;
  currentInstallation: CurrentInstallation | null;
}

export interface BacHistoryItem {
  type: 'stock' | 'installation';
  date: string;
  address: string | null;
  person: string | null;
}

export interface BacLocation {
  id: number;
  serialNumber: string;
  rfid: string | null;
  locationLat: number | null;
  locationLng: number | null;
  status: string;
}