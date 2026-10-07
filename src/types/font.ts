export type FontCategory = 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';

export interface VariableAxis {
  tag: string;
  name: string;
  min: number;
  max: number;
  default: number;
  step?: number;
}

export interface GoogleFont {
  family: string;
  category: FontCategory;
  variants: string[];
  subsets: string[];
  version?: string;
  lastModified?: string;
  isVariable?: boolean;
  axes?: VariableAxis[];
  popularityRank?: number;
  designer?: string;
}

export interface ParsedVariant {
  raw: string;
  weight: number;
  weightName: string;
  isItalic: boolean;
  label: string;
}

export interface PreviewSettings {
  text: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  textColor: string;
  bgColor: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export type SortOption = 'popularity' | 'alpha-asc' | 'alpha-desc' | 'variants-desc' | 'newest';

export interface FilterState {
  search: string;
  category: string;
  subset: string;
  variableOnly: boolean;
  italicOnly: boolean;
  multipleWeightsOnly: boolean;
  favoritesOnly: boolean;
  sortBy: SortOption;
}

export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'violet';
export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'vi' | 'en' | 'zh';
