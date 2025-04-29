import { useLayoutEffect, useState } from 'react';

const ALL_PALETTE_TYPES_ = [
  'default',
  'amber-minimal',
  'bold-tech',
  'bubblegum',
  'caffeine',
  'candyland',
  'catppuccin',
  'claude',
  'claymorphism',
  'clean-slate',
  'cosmis-night',
  'cyberpunk',
  'doom-64',
  'elegant-luxury',
  'graphite',
  'kodama-grove',
  'midnight-bloom',
  'mocha-mousse',
  'modern-minimal',
  'mono',
  'nature',
  'neo-brutalism',
  'northern-lights',
  'ocean-breeze',
  'pastel-dreams',
  'perpetuity',
  'quantum-rose',
  'retro-arcade',
  'solar-dusk',
  'starry-night',
  'sunset-horizon',
  'supabase',
  't3-chat',
  'tangerine',
  'twitter',
  'vercel',
  'vintage-paper',
  'random',
] as const;

export type Palette = (typeof ALL_PALETTE_TYPES_)[number];
export const ALL_PALETTE_TYPES: Palette[] = [...ALL_PALETTE_TYPES_];

export function usePalette() {
  const [palette, setPalette] = useState<Palette>(
    () => (localStorage.getItem('palette') as Palette) || 'default'
  );

  useLayoutEffect(() => {
    const html = document.documentElement;
    if (palette === 'random') {
      html.setAttribute(
        'data-theme',
        ALL_PALETTE_TYPES[
          Math.floor(Math.random() * (ALL_PALETTE_TYPES.length - 1))
        ]
      );
    } else {
      html.setAttribute('data-theme', palette);
    }
    localStorage.setItem('palette', palette);
  }, [palette]);

  return { palette, setPalette };
}
