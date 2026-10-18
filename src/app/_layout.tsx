import { DarkTheme, ThemeProvider as ExpoThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ThemeProvider } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <ThemeProvider>
      <ExpoThemeProvider value={DarkTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ExpoThemeProvider>
    </ThemeProvider>
  );
}
