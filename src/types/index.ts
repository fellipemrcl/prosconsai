export interface ProConItem {
  id: string;
  text: string;
  createdAt: Date;
}

export interface ProConList {
  id: string;
  title: string;
  description?: string;
  pros: ProConItem[];
  cons: ProConItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type ItemType = 'pro' | 'con';
