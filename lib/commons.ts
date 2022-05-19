import {useEffect, useState} from "react";

export const DEBUG = false

// @ts-ignore
export function debug(...message) {
  if(DEBUG){
    console.log(...message)
  }
}

// From: https://www.joshwcomeau.com/snippets/react-hooks/use-sticky-state/
export function useStickyState<T>(defaultValue: T, key: string) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    debug(`Get state: ${key}, isAvailable = ${stickyValue !== null}`)

    // @ts-ignore
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });

  useEffect(() => {
    debug(`Store state: ${key}`)

    // @ts-ignore
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}


