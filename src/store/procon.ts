import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProConList, ProConItem, ItemType } from '@/types';

interface ProConStore {
  lists: ProConList[];
  currentList: ProConList | null;
  
  // Actions
  createList: (title: string, description?: string) => string;
  deleteList: (listId: string) => void;
  setCurrentList: (listId: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  updateListDescription: (listId: string, description: string) => void;
  
  addItem: (listId: string, type: ItemType, text: string) => void;
  updateItem: (listId: string, type: ItemType, itemId: string, text: string) => void;
  deleteItem: (listId: string, type: ItemType, itemId: string) => void;
  
  clearCurrentList: () => void;
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const useProConStore = create<ProConStore>()(
  persist(
    (set, get) => ({
      lists: [],
      currentList: null,
      
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
      
      setCurrentList: (listId: string) => {
        const list = get().lists.find((l) => l.id === listId);
        if (list) {
          set({ currentList: list });
        }
      },
      
      updateListTitle: (listId: string, title: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, title, updatedAt: new Date() }
              : list
          ),
          currentList:
            state.currentList?.id === listId
              ? { ...state.currentList, title, updatedAt: new Date() }
              : state.currentList,
        }));
      },
      
      updateListDescription: (listId: string, description: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, description, updatedAt: new Date() }
              : list
          ),
          currentList:
            state.currentList?.id === listId
              ? { ...state.currentList, description, updatedAt: new Date() }
              : state.currentList,
        }));
      },
      
      addItem: (listId: string, type: ItemType, text: string) => {
        const newItem: ProConItem = {
          id: generateId(),
          text,
          createdAt: new Date(),
        };
        
        set((state) => {
          const updatedLists = state.lists.map((list) => {
            if (list.id === listId) {
              const updatedList = {
                ...list,
                [type === 'pro' ? 'pros' : 'cons']: [
                  ...list[type === 'pro' ? 'pros' : 'cons'],
                  newItem,
                ],
                updatedAt: new Date(),
              };
              return updatedList;
            }
            return list;
          });
          
          return {
            lists: updatedLists,
            currentList:
              state.currentList?.id === listId
                ? updatedLists.find((l) => l.id === listId) || null
                : state.currentList,
          };
        });
      },
      
      updateItem: (listId: string, type: ItemType, itemId: string, text: string) => {
        set((state) => {
          const updatedLists = state.lists.map((list) => {
            if (list.id === listId) {
              const items = type === 'pro' ? 'pros' : 'cons';
              const updatedItems = list[items].map((item) =>
                item.id === itemId ? { ...item, text } : item
              );
              const updatedList = {
                ...list,
                [items]: updatedItems,
                updatedAt: new Date(),
              };
              return updatedList;
            }
            return list;
          });
          
          return {
            lists: updatedLists,
            currentList:
              state.currentList?.id === listId
                ? updatedLists.find((l) => l.id === listId) || null
                : state.currentList,
          };
        });
      },
      
      deleteItem: (listId: string, type: ItemType, itemId: string) => {
        set((state) => {
          const updatedLists = state.lists.map((list) => {
            if (list.id === listId) {
              const items = type === 'pro' ? 'pros' : 'cons';
              const updatedItems = list[items].filter((item) => item.id !== itemId);
              const updatedList = {
                ...list,
                [items]: updatedItems,
                updatedAt: new Date(),
              };
              return updatedList;
            }
            return list;
          });
          
          return {
            lists: updatedLists,
            currentList:
              state.currentList?.id === listId
                ? updatedLists.find((l) => l.id === listId) || null
                : state.currentList,
          };
        });
      },
      
      clearCurrentList: () => {
        set({ currentList: null });
      },
    }),
    {
      name: 'procon-storage',
    }
  )
);
