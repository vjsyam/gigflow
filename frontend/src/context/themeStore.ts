import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

const stored = localStorage.getItem('gf_theme');
const initial = stored ? stored === 'dark' : true;

if (initial) document.documentElement.classList.add('dark');
else document.documentElement.classList.remove('dark');

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: initial,
  toggle: () => {
    const next = !get().isDark;
    localStorage.setItem('gf_theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    set({ isDark: next });
  },
}));
