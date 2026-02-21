'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // Use initial value on error
    }
    setIsLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Ignore storage errors
    }
  }, [key, storedValue, isLoaded]);

  return [storedValue, setStoredValue];
}
