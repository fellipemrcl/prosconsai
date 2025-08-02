import { ProConList, ProConItem } from '@/types';

/**
 * Utility functions for handling date serialization/deserialization
 * in localStorage with Zustand persist middleware
 */

// Define the serialized versions for localStorage
export interface SerializedProConItem {
  id: string;
  text: string;
  createdAt: string; // ISO date string
}

export interface SerializedProConList {
  id: string;
  title: string;
  description?: string;
  pros: SerializedProConItem[];
  cons: SerializedProConItem[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Converts a serialized ProCon item back to a ProConItem with Date objects
 */
export const deserializeItem = (item: SerializedProConItem): ProConItem => ({
  ...item,
  createdAt: new Date(item.createdAt),
});

/**
 * Converts a serialized ProCon list back to a ProConList with Date objects
 */
export const deserializeList = (list: SerializedProConList): ProConList => ({
  ...list,
  createdAt: new Date(list.createdAt),
  updatedAt: new Date(list.updatedAt),
  pros: list.pros.map(deserializeItem),
  cons: list.cons.map(deserializeItem),
});

/**
 * Converts the entire serialized state back to proper objects with Date instances
 */
export const deserializeState = (
  serialized: { lists: SerializedProConList[]; currentList: SerializedProConList | null }
): { lists: ProConList[]; currentList: ProConList | null } => ({
  lists: serialized.lists.map(deserializeList),
  currentList: serialized.currentList ? deserializeList(serialized.currentList) : null,
});

/**
 * Generates a unique ID using random characters and timestamp
 */
export const generateId = (): string => 
  Math.random().toString(36).substring(2) + Date.now().toString(36);
