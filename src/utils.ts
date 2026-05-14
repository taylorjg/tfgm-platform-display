export const range = (n: number): number[] => Array.from(Array(n).keys());
export const first = <T>(xs: T[]): T => xs[0];
export const last = <T>(xs: T[]): T => xs[xs.length - 1];
export const sumBy = <T>(xs: T[], fn: (x: T) => number): number =>
  xs.reduce((acc, x) => acc + fn(x), 0);
export const isOdd = (n: number): boolean => n % 2 === 1;
export const isEven = (n: number): boolean => n % 2 === 0;
export const reverseString = (s: string): string =>
  Array.from(s).reverse().join("");
