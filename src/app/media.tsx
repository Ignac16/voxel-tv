import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function MediaScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="Series">
            <ThemedText type="default">
              Discover your favorite TV series and binge-watch the latest episodes.
            </ThemedText>
            <ThemedText type="default" style={styles.contentSpacing}>
              Popular series include drama, comedy, action, and sci-fi shows from around the world.
            </ThemedText>
            <ThemedText type="default">
              New episodes are added regularly so you never miss your favorite shows.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Movies">
            <ThemedText type="default">
              Watch the latest blockbuster movies and classic films anytime.
            </ThemedText>
            <ThemedText type="default" style={styles.contentSpacing}>
              From action-packed adventures to heartwarming dramas, find movies for every mood.
            </ThemedText>
            <ThemedText type="default">
              High-quality streaming with multiple language options and subtitles available.
            </ThemedText>
          </Collapsible>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  contentSpacing: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
});