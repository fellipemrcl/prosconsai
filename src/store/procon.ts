import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProConList, ProConItem, ItemType, AIAnalysis, AnalysisLanguage } from '@/types';
import { deserializeState, generateId } from '@/utils/storage';

/**
 * Zustand store for managing Pros and Cons lists
 * Features:
 * - Create, update, and delete lists
 * - Add, edit, and remove pros/cons items
 * - AI analysis of pros and cons
 * - Persistent storage with automatic date serialization
 * - Type-safe operations with full TypeScript support
 */
interface ProConStore {
  // State
  lists: ProConList[];
  currentList: ProConList | null;
  currentAnalysis: AIAnalysis | null;
  isAnalyzing: boolean;
  analysisLanguage: AnalysisLanguage;
  
  // List management actions
  createList: (title: string, description?: string) => string;
  deleteList: (listId: string) => void;
  setCurrentList: (listId: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  updateListDescription: (listId: string, description: string) => void;
  
  // Item management actions
  addItem: (listId: string, type: ItemType, text: string) => void;
  updateItem: (listId: string, type: ItemType, itemId: string, text: string) => void;
  deleteItem: (listId: string, type: ItemType, itemId: string) => void;
  
  // AI Analysis actions
  analyzeCurrentList: (language?: AnalysisLanguage) => Promise<void>;
  clearAnalysis: () => void;
  setAnalysisLanguage: (language: AnalysisLanguage) => void;
  
  // Navigation actions
  clearCurrentList: () => void;
}

export const useProConStore = create<ProConStore>()(
  persist(
    (set, get) => ({
      lists: [],
      currentList: null,
      currentAnalysis: null,
      isAnalyzing: false,
      analysisLanguage: 'en-US' as AnalysisLanguage,
      
      createList: (title: string, description?: string) => {
        const newList: ProConList = {
          id: generateId(),
          title,
          description,
          pros: [],
          cons: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          lists: [...state.lists, newList],
          currentList: newList,
        }));
        
        return newList.id;
      },
      
      deleteList: (listId: string) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== listId),
          currentList: state.currentList?.id === listId ? null : state.currentList,
        }));
      },
      
      setCurrentList: (listId: string): void => {
        const { lists } = get();
        const list = lists.find((l) => l.id === listId);
        if (list) {
          set({ currentList: list });
        }
      },
      
      updateListTitle: (listId: string, title: string): void => {
        const now = new Date();
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, title, updatedAt: now }
              : list
          ),
          currentList:
            state.currentList?.id === listId
              ? { ...state.currentList, title, updatedAt: now }
              : state.currentList,
        }));
      },
      
      updateListDescription: (listId: string, description: string): void => {
        const now = new Date();
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, description, updatedAt: now }
              : list
          ),
          currentList:
            state.currentList?.id === listId
              ? { ...state.currentList, description, updatedAt: now }
              : state.currentList,
        }));
      },
      
      addItem: (listId: string, type: ItemType, text: string): void => {
        const newItem: ProConItem = {
          id: generateId(),
          text,
          createdAt: new Date(),
        };
        
        const now = new Date();
        const itemKey = type === 'pro' ? 'pros' : 'cons';
        
        set((state) => {
          const updatedLists = state.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                [itemKey]: [...list[itemKey], newItem],
                updatedAt: now,
              };
            }
            return list;
          });
          
          const updatedCurrentList = state.currentList?.id === listId
            ? updatedLists.find((l) => l.id === listId) || null
            : state.currentList;
          
          return {
            lists: updatedLists,
            currentList: updatedCurrentList,
          };
        });
      },
      
      updateItem: (listId: string, type: ItemType, itemId: string, text: string): void => {
        const now = new Date();
        const itemKey = type === 'pro' ? 'pros' : 'cons';
        
        set((state) => {
          const updatedLists = state.lists.map((list) => {
            if (list.id === listId) {
              const updatedItems = list[itemKey].map((item) =>
                item.id === itemId ? { ...item, text } : item
              );
              return {
                ...list,
                [itemKey]: updatedItems,
                updatedAt: now,
              };
            }
            return list;
          });
          
          const updatedCurrentList = state.currentList?.id === listId
            ? updatedLists.find((l) => l.id === listId) || null
            : state.currentList;
          
          return {
            lists: updatedLists,
            currentList: updatedCurrentList,
          };
        });
      },
      
      deleteItem: (listId: string, type: ItemType, itemId: string): void => {
        const now = new Date();
        const itemKey = type === 'pro' ? 'pros' : 'cons';
        
        set((state) => {
          const updatedLists = state.lists.map((list) => {
            if (list.id === listId) {
              const updatedItems = list[itemKey].filter((item) => item.id !== itemId);
              return {
                ...list,
                [itemKey]: updatedItems,
                updatedAt: now,
              };
            }
            return list;
          });
          
          const updatedCurrentList = state.currentList?.id === listId
            ? updatedLists.find((l) => l.id === listId) || null
            : state.currentList;
          
          return {
            lists: updatedLists,
            currentList: updatedCurrentList,
          };
        });
      },
      
      analyzeCurrentList: async (language?: AnalysisLanguage): Promise<void> => {
        const { currentList, analysisLanguage } = get();
        if (!currentList) {
          throw new Error('No current list to analyze');
        }

        if (currentList.pros.length === 0 && currentList.cons.length === 0) {
          throw new Error('Cannot analyze empty pros and cons list');
        }

        const selectedLanguage = language || analysisLanguage;
        set({ isAnalyzing: true, currentAnalysis: null });

        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ proConList: currentList, language: selectedLanguage }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze list');
          }

          const analysis: AIAnalysis = await response.json();
          set({ currentAnalysis: analysis, isAnalyzing: false });
        } catch (error) {
          set({ isAnalyzing: false });
          throw error;
        }
      },

      clearAnalysis: (): void => {
        set({ currentAnalysis: null });
      },

      setAnalysisLanguage: (language: AnalysisLanguage): void => {
        set({ analysisLanguage: language });
      },
      
      clearCurrentList: (): void => {
        set({ currentList: null, currentAnalysis: null });
      },
    }),
    {
      name: 'procon-storage',
      storage: {
        getItem: (name: string) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const parsed = JSON.parse(str);
            // Convert date strings back to Date objects using our utility functions
            if (parsed.state?.lists || parsed.state?.currentList) {
              const deserializedState = deserializeState(parsed.state);
              return {
                ...parsed,
                state: deserializedState,
              };
            }
            return parsed;
          } catch (error) {
            console.warn('Failed to parse stored data:', error);
            return null;
          }
        },
        setItem: (name: string, value: unknown): void => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Failed to save to localStorage:', error);
          }
        },
        removeItem: (name: string): void => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error('Failed to remove from localStorage:', error);
          }
        },
      },
    }
  )
);
