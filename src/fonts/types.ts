export type CharacterDescriptor = {
  dotLines: string[];
};

export type Font = {
  name: string;
  fontMap: Map<string, CharacterDescriptor>;
  numVerticalDots: number;
};
