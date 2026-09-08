import { useCallback, useEffect, useState } from 'react';
import { FavoriteItem, MediaItem } from '../types';

const STORAGE_KEY = 'movielot_favorites_v1';
const EVENT_NAME = 'movielot_favorites_updated';

function getStoredFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteItem[];
  } catch (e) {
    console.warn('Failed to load favorites from localStorage:', e);
    return [];
  }
}

function saveStoredFavorites(items: FavoriteItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (e) {
    console.warn('Failed to save favorites to localStorage:', e);
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(getStoredFavorites);

  useEffect(() => {
    const handleUpdate = () => {
      setFavorites(getStoredFavorites());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const isFavorite = useCallback(
    (id: number): boolean => {
      return favorites.some((f) => f.id === id);
    },
    [favorites]
  );

  const addFavorite = useCallback((item: MediaItem) => {
    const current = getStoredFavorites();
    if (current.some((f) => f.id === item.id)) return;

    const newItem: FavoriteItem = {
      id: item.id,
      mediaType: item.mediaType,
      title: item.title,
      posterPath: item.posterPath,
      backdropPath: item.backdropPath,
      releaseDate: item.releaseDate,
      voteAverage: item.voteAverage,
      genres: item.genres.map((g) => g.name),
      addedAt: Date.now()
    };

    const updated = [newItem, ...current];
    saveStoredFavorites(updated);
    setFavorites(updated);
  }, []);

  const removeFavorite = useCallback((id: number) => {
    const current = getStoredFavorites();
    const updated = current.filter((f) => f.id !== id);
    saveStoredFavorites(updated);
    setFavorites(updated);
  }, []);

  const toggleFavorite = useCallback(
    (item: MediaItem) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id);
      } else {
        addFavorite(item);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const clearFavorites = useCallback(() => {
    saveStoredFavorites([]);
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    count: favorites.length
  };
}
