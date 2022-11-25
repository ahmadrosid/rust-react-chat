import { useEffect, useState } from "react";

export default function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(defaultValue);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      let data = item ? JSON.parse(item) : defaultValue;
      setStoredValue(data)
    } catch (error) {}
  }, [])

  return [storedValue, setValue];
}
