import { CategoryType, CategoryDef, QuickTemplate } from './types';
import { Target, Users, Palette, Code, Heart, BookOpen, Coffee } from 'lucide-react';

export const CATEGORIES: Record<CategoryType, CategoryDef> = {
  [CategoryType.FOCUS]: { id: CategoryType.FOCUS, label: 'Deep Work', color: '#4A90E2', icon: 'Target' },
  [CategoryType.MEETING]: { id: CategoryType.MEETING, label: 'Meeting', color: '#3FBACC', icon: 'Users' },
  [CategoryType.CREATIVE]: { id: CategoryType.CREATIVE, label: 'Creative', color: '#9B59B6', icon: 'Palette' },
  [CategoryType.BUILDING]: { id: CategoryType.BUILDING, label: 'Building', color: '#D4A356', icon: 'Code' },
  [CategoryType.WELLNESS]: { id: CategoryType.WELLNESS, label: 'Wellness', color: '#FF6B9D', icon: 'Heart' },
  [CategoryType.LEARNING]: { id: CategoryType.LEARNING, label: 'Learning', color: '#2ECC71', icon: 'BookOpen' },
  [CategoryType.BREAK]: { id: CategoryType.BREAK, label: 'Break', color: '#95A5A6', icon: 'Coffee' },
};

export const QUICK_TEMPLATES: QuickTemplate[] = [
  { label: 'Focus Block', duration: 1.5, category: CategoryType.FOCUS },
  { label: 'Quick Sync', duration: 0.5, category: CategoryType.MEETING },
  { label: 'Coffee Break', duration: 0.25, category: CategoryType.BREAK },
  { label: 'Gym', duration: 1, category: CategoryType.WELLNESS },
];

export const INITIAL_TASKS: any[] = [
  {
    id: '1',
    title: 'Morning Standup',
    category: CategoryType.MEETING,
    startTime: 9.0,
    endTime: 9.5,
    notes: 'Discuss daily blockers',
    completed: false,
    energyLevel: 2
  },
  {
    id: '2',
    title: 'Deep Work: Core Feature',
    category: CategoryType.FOCUS,
    startTime: 10.0,
    endTime: 12.0,
    notes: 'Implement the new radial algorithm',
    completed: false,
    energyLevel: 3
  },
  {
    id: '3',
    title: 'Lunch Break',
    category: CategoryType.BREAK,
    startTime: 12.0,
    endTime: 13.0,
    completed: false,
    energyLevel: 1
  },
  {
    id: '4',
    title: 'Design Review',
    category: CategoryType.CREATIVE,
    startTime: 14.0,
    endTime: 15.0,
    completed: false,
    energyLevel: 2
  },
   {
    id: '5',
    title: 'Gym',
    category: CategoryType.WELLNESS,
    startTime: 17.5,
    endTime: 19.0,
    completed: false,
    energyLevel: 3
  }
];