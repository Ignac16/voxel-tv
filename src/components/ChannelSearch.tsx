import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ChannelSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function ChannelSearch({ value, onChangeText, placeholder = 'Search channels...' }: ChannelSearchProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.searchContainer}>
        <ThemedText style={styles.searchIcon}>🔍</ThemedText>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
        />
        {value.length > 0 && (
          <ThemedText style={styles.clearButton} onPress={() => onChangeText('')}>
            ✕
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.three,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  searchIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    fontSize: 18,
    padding: Spacing.one,
  },
});