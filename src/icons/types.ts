export type IconStyle = "fas" | "far" | "fal" | "fak";
export type IconGlyph = { viewBox: string; paths: readonly { d: string; opacity?: number }[] };
export type IconRegistry = Record<string, Partial<Record<IconStyle, IconGlyph>>>;
