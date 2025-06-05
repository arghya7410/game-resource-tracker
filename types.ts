
export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export interface Material {
  id: string;
  name: string;
  iconUrl?: string;
  needed: number;
  possessed: number;
  farmableDays: DayOfWeek[];
}

export enum ItemType {
  Character = "Character",
  Weapon = "Weapon",
}

export interface TrackedItem {
  id: string;
  name: string;
  photoUrl?: string;
  type: ItemType;
  materials: Material[];
  totalMaterialsScreenshotUrl?: string;
}

export type AppView = 
  | { type: 'dashboard' }
  | { type: 'addItem' }
  | { type: 'editItem'; itemId: string }
  | { type: 'viewItem'; itemId: string };
