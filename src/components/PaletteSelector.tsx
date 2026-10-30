import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { ColorPalette, PALETTES } from '../utils/themePalettes';

interface PaletteSelectorProps {
  currentPalette: ColorPalette;
  onSelectPalette: (palette: ColorPalette) => void;
}

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({
  currentPalette,
  onSelectPalette,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeConfig = PALETTES[currentPalette] || PALETTES.sage;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-zinc-100 border border-black/[0.05] dark:border-white/[0.06] shadow-clean-xs flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
        title="Change color scheme"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shadow-xs shrink-0 ring-1 ring-black/10 dark:ring-white/20"
          style={{ backgroundColor: activeConfig.dotColor }}
        />
        <span className="hidden sm:inline text-[11px] font-medium">{activeConfig.name}</span>
        <Palette size={12} className="text-stone-400 dark:text-zinc-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-50 w-56 p-2 rounded-2xl bg-white dark:bg-[#161615] border border-black/[0.08] dark:border-white/[0.08] shadow-clean-modal animate-clean-modal">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
            Color Palette
          </div>
          <div className="space-y-0.5">
            {Object.values(PALETTES).map((pal) => {
              const isSelected = pal.id === currentPalette;
              return (
                <button
                  key={pal.id}
                  onClick={() => {
                    onSelectPalette(pal.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all btn-tactile cursor-pointer ${
                    isSelected
                      ? 'bg-black/[0.04] dark:bg-white/[0.06] text-stone-900 dark:text-zinc-100 font-medium'
                      : 'hover:bg-black/[0.025] dark:hover:bg-white/[0.03] text-stone-600 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-1 ring-black/10 dark:ring-white/20"
                      style={{ backgroundColor: pal.dotColor }}
                    />
                    <div>
                      <div className="text-xs leading-none">{pal.name}</div>
                      <div className="text-[10px] text-stone-400 dark:text-zinc-500 mt-0.5">
                        {pal.subtitle}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={13} className="text-stone-700 dark:text-zinc-200" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
