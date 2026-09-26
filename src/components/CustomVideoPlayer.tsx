import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface CustomVideoPlayerProps {
  sourceUrl: string;
  posterUrl?: string;
  onLoad?: () => void;
  onError?: (error: any) => void;
  isLooping?: boolean;
  useNativeControls?: boolean;
  autoPlay?: boolean;
}

export function CustomVideoPlayer({
  sourceUrl,
  posterUrl,
  onLoad,
  onError,
  isLooping = false,
  useNativeControls = true,
  autoPlay = true,
}: CustomVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isIOSDASHFallback, setIsIOSDASHFallback] = useState(false);
  const [isWebDASHFallback, setIsWebDASHFallback] = useState(false);

  useEffect(() => {
    // Check if this is a DASH stream on iOS and suggest fallback
    if (Platform.OS === 'ios' && sourceUrl.endsWith('.mpd')) {
      setIsIOSDASHFallback(true);
    }
    // Check if this is a DASH stream on web (limited support)
    if (Platform.OS === 'web' && sourceUrl.endsWith('.mpd')) {
      setIsWebDASHFallback(true);
    }
  }, [sourceUrl]);

  const player = useVideoPlayer(sourceUrl, (player) => {
    player.loop = isLooping;
    if (autoPlay) {
      player.play();
    }
    setIsLoading(false);
    setIsError(false);
    onLoad?.();
  });

  useEffect(() => {
    if (player) {
      const subscription = player.addListener('statusChange', (status) => {
        if (status.error) {
          console.error('Video Player Error:', status.error);
          setIsLoading(false);
          setIsError(true);
          setErrorMessage(
            status.error.message || 
            'Unable to load video stream. Please check your connection.'
          );
          onError?.(status.error);
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, [player, onError]);

  // Web DASH fallback warning
  if (isWebDASHFallback) {
    return (
      <ThemedView style={styles.fallbackContainer}>
        <ThemedText type="default" style={styles.fallbackText}>
          ⚠️ DASH (.mpd) streams are not supported on web.
        </ThemedText>
        <ThemedText type="small" style={styles.fallbackSubtext}>
          Use HLS (.m3u8) format for web compatibility, or test on mobile.
        </ThemedText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setIsWebDASHFallback(false)}
        >
          <ThemedText type="default" style={styles.retryButtonText}>
            Try Anyway (May Not Work)
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // iOS DASH fallback warning
  if (isIOSDASHFallback) {
    return (
      <ThemedView style={styles.fallbackContainer}>
        <ThemedText type="default" style={styles.fallbackText}>
          ⚠️ DASH (.mpd) streams have limited support on iOS.
        </ThemedText>
        <ThemedText type="small" style={styles.fallbackSubtext}>
          Consider using HLS (.m3u8) format for better iOS compatibility.
        </ThemedText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setIsIOSDASHFallback(false)}
        >
          <ThemedText type="default" style={styles.retryButtonText}>
            Try Anyway
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Error state
  if (isError) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="default" style={styles.errorText}>
          ❌ Error Loading Video
        </ThemedText>
        <ThemedText type="small" style={styles.errorMessage}>
          {errorMessage}
        </ThemedText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setIsError(false);
            setIsLoading(true);
            player.replay();
          }}
        >
          <ThemedText type="default" style={styles.retryButtonText}>
            Retry
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <VideoView
          style={styles.video}
          player={player}
          nativeControls={useNativeControls}
        />
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#208AEF" />
          <ThemedText type="small" style={styles.loadingText}>
            Loading stream...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Normal video player
  return (
    <ThemedView style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={useNativeControls}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
  },
  errorContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1a1a1a',
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  retryButton: {
    backgroundColor: '#208AEF',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    marginTop: Spacing.two,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fallbackContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#fff3cd',
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  fallbackSubtext: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  fullscreenButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Spacing.two,
    borderRadius: Spacing.one,
  },
  fullscreenButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});