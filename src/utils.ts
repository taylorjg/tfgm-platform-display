export const range = (n: number): number[] => Array.from(Array(n).keys());
export const first = <T>(xs: T[]): T => xs[0];
export const last = <T>(xs: T[]): T => xs[xs.length - 1];
