import {
  first,
  isEven,
  isOdd,
  last,
  range,
  reverseString,
  sumBy,
} from "./utils.ts";

describe("range", () => {
  it("returns an empty array for zero", () => {
    expect(range(0)).toEqual([]);
  });

  it("returns consecutive integers starting at zero", () => {
    expect(range(4)).toEqual([0, 1, 2, 3]);
  });
});

describe("first", () => {
  it("returns the first element of an array", () => {
    expect(first(["a", "b", "c"])).toBe("a");
  });
});

describe("last", () => {
  it("returns the last element of an array", () => {
    expect(last(["a", "b", "c"])).toBe("c");
  });
});

describe("sumBy", () => {
  it("sums values returned by the selector", () => {
    expect(sumBy([1, 2, 3], (n) => n * 2)).toBe(12);
  });

  it("returns zero for an empty array", () => {
    expect(sumBy([], (n) => n)).toBe(0);
  });
});

describe("isOdd", () => {
  it("returns true for positive odd integers", () => {
    expect(isOdd(3)).toBe(true);
    expect(isOdd(1)).toBe(true);
  });

  it("returns false for even integers, zero, and negative odds", () => {
    expect(isOdd(4)).toBe(false);
    expect(isOdd(0)).toBe(false);
    expect(isOdd(-5)).toBe(false);
  });
});

describe("isEven", () => {
  it("returns true for even integers and zero", () => {
    expect(isEven(4)).toBe(true);
    expect(isEven(0)).toBe(true);
    expect(isEven(-2)).toBe(true);
  });

  it("returns false for odd integers", () => {
    expect(isEven(3)).toBe(false);
    expect(isEven(-1)).toBe(false);
  });
});

describe("reverseString", () => {
  it("reverses a string", () => {
    expect(reverseString("abc")).toBe("cba");
  });

  it("returns an empty string for an empty input", () => {
    expect(reverseString("")).toBe("");
  });
});
