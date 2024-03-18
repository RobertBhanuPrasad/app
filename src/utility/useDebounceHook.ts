import { useEffect, useState } from "react";

/**
 * A custom React hook for implementing debounce functionality.
 *
 * @param {*} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds before the value update is debounced.
 * @returns {*} - The debounced value.
 */

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
