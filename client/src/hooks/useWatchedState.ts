import { useState, useEffect } from "react";

const STORAGE_KEY = "mcu_watched_productions";

export function useWatchedState() {
  const [watched, setWatched] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  });

  // Sincronizar com localStorage sempre que watched muda
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(watched)));
  }, [watched]);

  const toggleWatched = (title: string) => {
    setWatched((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const isWatched = (title: string) => watched.has(title);

  return { watched, toggleWatched, isWatched };
}

