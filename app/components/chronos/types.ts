export interface AppUsage {
  name: string;
  minutes: number;
  color: string;
  icon?: string;
}

export interface CategoryNode {
  name: string;
  children: AppUsage[];
  color: string;
}

export interface ScreenTimeData {
  totalMinutes: number;
  categories: CategoryNode[];
}

export type ViewMode = 'flower' | 'tree';

export interface SelectionState {
  type: 'category' | 'app' | 'none';
  id: string | null;
  data?: AppUsage | CategoryNode;
}
