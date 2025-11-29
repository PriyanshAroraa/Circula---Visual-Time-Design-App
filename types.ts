export enum CategoryType {
  FOCUS = 'focus',
  MEETING = 'meeting',
  CREATIVE = 'creative',
  BUILDING = 'building',
  WELLNESS = 'wellness',
  LEARNING = 'learning',
  BREAK = 'break',
}

export interface Task {
  id: string;
  title: string;
  category: CategoryType;
  startTime: number; // 0-24 float representation (e.g., 14.5 is 2:30 PM)
  endTime: number;   // 0-24 float representation
  notes?: string;
  completed: boolean;
  energyLevel?: number; // 1: Low, 2: Medium, 3: High
}

export interface CategoryDef {
  id: CategoryType;
  label: string;
  color: string;
  icon: string;
}

export interface QuickTemplate {
  label: string;
  duration: number; // in hours
  category: CategoryType;
}

export type ViewState = 'daily' | 'weekly' | 'analytics' | 'settings';