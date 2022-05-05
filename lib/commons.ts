import {useEffect, useState} from "react";

export const DEBUG = false

// @ts-ignore
export function debug(...message) {
  if(DEBUG){
    console.log(...message)
  }
}

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


export function sumTogether(timePerRowInMs: number[]): number {
  let sum: number = 0;
  timePerRowInMs
    .filter(each => each != null)
    .forEach(each => sum += each)
  return sum;
}

export function toSum(currentGuess: string): number {
  if(currentGuess == undefined){
    return 0;
  }

  let first = parseInt(currentGuess[0])
  let second = parseInt(currentGuess[1])
  let third = parseInt(currentGuess[2])
  let fourth = parseInt(currentGuess[3])
  let fifth = parseInt(currentGuess[4])

  let currentGuessSum = first * 10000 + second * 1000 + third * 100 + fourth * 10 + fifth;
  return currentGuessSum;
}
