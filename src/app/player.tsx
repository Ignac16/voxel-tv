import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomVideoPlayer } from '@/components/CustomVideoPlayer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function PlayerScreen() {
  const router = useRouter();
  const { streamUrl, channelName } = useLocalSearchParams();

  const handleBack = () => {
    router.back();
  };

  // Decode the URL parameters
  const decodedStreamUrl = streamUrl ? decodeURIComponent(streamUrl as string) : null;
  const decodedChannelName = channelName ? decodeURIComponent(channelName as string) : null;

  console.log('Player screen received:', { streamUrl, channelName });
  console.log('Decoded:', { decodedStreamUrl, decodedChannelName });

  if (!decodedStreamUrl) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="default" style={styles.errorText}>
          No stream URL provided
        </ThemedText>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <ThemedText type="default" style={styles.title}>
            {decodedChannelName || 'Channel'}
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <CustomVideoPlayer
          sourceUrl={decodedStreamUrl}
          useNativeControls={true}
          autoPlay={true}
          onLoad={() => console.log('Channel loaded:', decodedChannelName)}
          onError={(error) => console.error('Channel error:', error)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
});