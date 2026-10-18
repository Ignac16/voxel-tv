import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        contentInset={insets}
      >
        <ThemedText type="title" style={styles.title}>
          Settings
        </ThemedText>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="General">
            <ThemedText type="default">
              App settings and preferences
            </ThemedText>
            <ThemedText type="default" style={styles.contentSpacing}>
              Configure your Voxel TV experience
            </ThemedText>
          </Collapsible>

          <Collapsible title="Playback">
            <ThemedText type="default">
              Video playback settings
            </ThemedText>
            <ThemedText type="default" style={styles.contentSpacing}>
              Quality, subtitles, and audio options
            </ThemedText>
          </Collapsible>

          <Collapsible title="Account">
            <ThemedText type="default">
              Account information
            </ThemedText>
            <ThemedText type="default" style={styles.contentSpacing}>
              Manage your profile and preferences
            </ThemedText>
          </Collapsible>

          <Collapsible title="About">
            <ThemedText type="default">
              Voxel TV v1.0.0
            </ThemedText>
            <ThemedText type="default" style={styles.contentSpacing}>
              © 2026 Voxel TV. All rights reserved.
            </ThemedText>
          </Collapsible>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
  },
  title: {
    marginBottom: Spacing.four,
  },
  backButton: {
    marginBottom: Spacing.three,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionsWrapper: {
    gap: Spacing.five,
  },
  contentSpacing: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
});