/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import React from 'react';

const ThemeContext = React.createContext<{
  theme: 'dark';
}>({
  theme: 'dark',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(
    ThemeContext.Provider,
    { value: { theme: 'dark' } },
    children
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  const colors = Colors.dark;

  return {
    ...colors,
    dark: true,
  };
}
