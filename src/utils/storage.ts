import { SavedItem } from '../types/career';

const STORAGE_KEY = 'ai_career_buddy_saved_items_v1';

export function getSavedItems(): SavedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved items from localStorage:', err);
    return [];
  }
}

export function saveItem(item: Omit<SavedItem, 'id' | 'timestamp'>): SavedItem {
  const items = getSavedItems();
  const newItem: SavedItem = {
    ...item,
    id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };
  const updated = [newItem, ...items].slice(0, 30); // keep last 30
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newItem;
}

export function deleteSavedItem(id: string): SavedItem[] {
  const items = getSavedItems();
  const filtered = items.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}
