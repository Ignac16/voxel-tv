import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { Spacing } from '@/constants/theme';

interface SettingsContentProps {
  onClose: () => void;
}

export function SettingsContent({ onClose }: SettingsContentProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <ThemedText type="default" style={styles.title}>
          Settings
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ThemedView style={styles.content}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: Spacing.two,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  content: {
    padding: Spacing.four,
  },
  contentSpacing: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
});