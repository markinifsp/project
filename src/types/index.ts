export interface Cable {
  id: string;
  name: string;
  type: string;
  totalQuantity: number;
  availableQuantity: number;
  minQuantity: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
  cabosEmUso: { [cableId: string]: number };
}

export interface Movement {
  id: string;
  cableId: string;
  personId: string;
  quantity: number;
  type: 'entry' | 'exit' | 'return' | 'utilizacao';
  date: string;
  notes: string;
}

export interface AppState {
  cables: Cable[];
  people: Person[];
  movements: Movement[];
}