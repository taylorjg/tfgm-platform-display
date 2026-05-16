export type RowCol = {
  row: number;
  col: number;
};

export interface MatrixEffect {
  tick(deltaMs: number): void;
  nextRowCol(row: number, col: number): RowCol;
}
