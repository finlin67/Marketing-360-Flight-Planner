import { useState } from 'react';

/**
 * Hook to persist state to localStorage with optional TTL
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  ttl?: number // Time to live in milliseconds
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);
      
      // Check if TTL has expired
      if (ttl && parsed.timestamp) {
        const now = Date.now();
        if (now - parsed.timestamp > ttl) {
          window.localStorage.removeItem(key);
          return initialValue;
        }
      }

      // Return the value (or the value from parsed object if it has timestamp)
      return parsed.value !== undefined ? parsed.value : parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Save to localStorage whenever state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      const itemToStore = ttl
        ? { value: valueToStore, timestamp: Date.now() }
        : valueToStore;
      
      window.localStorage.setItem(key, JSON.stringify(itemToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

