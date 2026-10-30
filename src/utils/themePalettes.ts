export type ColorPalette = 'sage' | 'cobalt' | 'monochrome' | 'bordeaux' | 'amber';

export interface PaletteConfig {
  id: ColorPalette;
  name: string;
  subtitle: string;
  dotColor: string;
  cssVars: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryText: string;
    accentQuote: string;
    accentGlow: string;
    bgMain: string;
    bgSidebar: string;
    bgCard: string;
    borderHairline: string;
  };
  darkCssVars: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryText: string;
    accentQuote: string;
    accentGlow: string;
    bgMain: string;
    bgSidebar: string;
    bgCard: string;
    borderHairline: string;
  };
}

export const PALETTES: Record<ColorPalette, PaletteConfig> = {
  sage: {
    id: 'sage',
    name: 'Nordic Sage',
    subtitle: 'Spruce & Crisp Mint',
    dotColor: '#185848',
    cssVars: {
      primary: '#185848',
      primaryHover: '#114236',
      primaryLight: '#E8F4F0',
      primaryText: '#0F3D32',
      accentQuote: '#1E6E5A',
      accentGlow: 'rgba(24, 88, 72, 0.12)',
      bgMain: '#F6F9F8',
      bgSidebar: '#EEF4F1',
      bgCard: '#FFFFFF',
      borderHairline: 'rgba(24, 88, 72, 0.08)',
    },
    darkCssVars: {
      primary: '#34D399',
      primaryHover: '#10B981',
      primaryLight: '#0E2922',
      primaryText: '#A7F3D0',
      accentQuote: '#34D399',
      accentGlow: 'rgba(52, 211, 153, 0.15)',
      bgMain: '#0C1210',
      bgSidebar: '#101715',
      bgCard: '#141E1A',
      borderHairline: 'rgba(52, 211, 153, 0.12)',
    },
  },
  cobalt: {
    id: 'cobalt',
    name: 'Linear Cobalt',
    subtitle: 'Deep Ultramarine & Slate',
    dotColor: '#2563EB',
    cssVars: {
      primary: '#2563EB',
      primaryHover: '#1D4ED8',
      primaryLight: '#EFF6FF',
      primaryText: '#1E40AF',
      accentQuote: '#3B82F6',
      accentGlow: 'rgba(37, 99, 235, 0.12)',
      bgMain: '#F8FAFC',
      bgSidebar: '#F1F5F9',
      bgCard: '#FFFFFF',
      borderHairline: 'rgba(37, 99, 235, 0.08)',
    },
    darkCssVars: {
      primary: '#60A5FA',
      primaryHover: '#3B82F6',
      primaryLight: '#142544',
      primaryText: '#BFDBFE',
      accentQuote: '#60A5FA',
      accentGlow: 'rgba(96, 165, 250, 0.15)',
      bgMain: '#0B0F17',
      bgSidebar: '#101622',
      bgCard: '#151D2C',
      borderHairline: 'rgba(96, 165, 250, 0.12)',
    },
  },
  monochrome: {
    id: 'monochrome',
    name: 'Pure Carbon',
    subtitle: 'Monochrome & Zinc',
    dotColor: '#18181B',
    cssVars: {
      primary: '#18181B',
      primaryHover: '#09090B',
      primaryLight: '#F4F4F5',
      primaryText: '#27272A',
      accentQuote: '#52525B',
      accentGlow: 'rgba(24, 24, 27, 0.10)',
      bgMain: '#FAFAFA',
      bgSidebar: '#F4F4F5',
      bgCard: '#FFFFFF',
      borderHairline: 'rgba(0, 0, 0, 0.06)',
    },
    darkCssVars: {
      primary: '#FAFAFA',
      primaryHover: '#E4E4E7',
      primaryLight: '#27272A',
      primaryText: '#F4F4F5',
      accentQuote: '#A1A1AA',
      accentGlow: 'rgba(250, 250, 250, 0.12)',
      bgMain: '#09090B',
      bgSidebar: '#111114',
      bgCard: '#18181B',
      borderHairline: 'rgba(255, 255, 255, 0.08)',
    },
  },
  bordeaux: {
    id: 'bordeaux',
    name: 'Bordeaux & Fig',
    subtitle: 'Deep Wine & Warm Rose',
    dotColor: '#831843',
    cssVars: {
      primary: '#831843',
      primaryHover: '#701A75',
      primaryLight: '#FDF2F8',
      primaryText: '#500724',
      accentQuote: '#9D174D',
      accentGlow: 'rgba(131, 24, 67, 0.12)',
      bgMain: '#FAF7F9',
      bgSidebar: '#F5EEF2',
      bgCard: '#FFFFFF',
      borderHairline: 'rgba(131, 24, 67, 0.08)',
    },
    darkCssVars: {
      primary: '#F472B6',
      primaryHover: '#EC4899',
      primaryLight: '#3D0721',
      primaryText: '#FBCFE8',
      accentQuote: '#F472B6',
      accentGlow: 'rgba(244, 114, 182, 0.15)',
      bgMain: '#120A0E',
      bgSidebar: '#190F14',
      bgCard: '#22141C',
      borderHairline: 'rgba(244, 114, 182, 0.12)',
    },
  },
  amber: {
    id: 'amber',
    name: 'Classic Amber',
    subtitle: 'Warm Sandstone & Brass',
    dotColor: '#B45309',
    cssVars: {
      primary: '#B45309',
      primaryHover: '#92400E',
      primaryLight: '#FEF3C7',
      primaryText: '#78350F',
      accentQuote: '#D97706',
      accentGlow: 'rgba(180, 83, 9, 0.12)',
      bgMain: '#FAF9F6',
      bgSidebar: '#F4F2EC',
      bgCard: '#FFFFFF',
      borderHairline: 'rgba(180, 83, 9, 0.08)',
    },
    darkCssVars: {
      primary: '#FBBF24',
      primaryHover: '#F59E0B',
      primaryLight: '#382006',
      primaryText: '#FDE68A',
      accentQuote: '#FBBF24',
      accentGlow: 'rgba(251, 191, 36, 0.15)',
      bgMain: '#121110',
      bgSidebar: '#181615',
      bgCard: '#1E1C1A',
      borderHairline: 'rgba(251, 191, 36, 0.12)',
    },
  },
};

export function applyPaletteToDom(paletteKey: ColorPalette, isDark: boolean) {
  const palette = PALETTES[paletteKey] || PALETTES.sage;
  const vars = isDark ? palette.darkCssVars : palette.cssVars;
  const root = document.documentElement;

  root.style.setProperty('--theme-primary', vars.primary);
  root.style.setProperty('--theme-primary-hover', vars.primaryHover);
  root.style.setProperty('--theme-primary-light', vars.primaryLight);
  root.style.setProperty('--theme-primary-text', vars.primaryText);
  root.style.setProperty('--theme-accent-quote', vars.accentQuote);
  root.style.setProperty('--theme-accent-glow', vars.accentGlow);
  root.style.setProperty('--bg-main', vars.bgMain);
  root.style.setProperty('--bg-sidebar', vars.bgSidebar);
  root.style.setProperty('--bg-card', vars.bgCard);
  root.style.setProperty('--border-hairline', vars.borderHairline);
}
