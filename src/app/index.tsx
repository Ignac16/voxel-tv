import * as Device from 'expo-device';
import React from 'react';
import { Platform, StyleSheet, ScrollView, View, Modal, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChannelList } from '@/components/channel-list';
import { CustomVideoPlayer } from '@/components/CustomVideoPlayer';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { loadChannels } from '@/utils/loadChannels';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const channels = loadChannels();
  const [selectedChannel, setSelectedChannel] = React.useState<any>(null);

  const handleChannelPress = (channel: any) => {
    console.log('Channel pressed:', channel.NOMBRE, 'Stream:', channel.STREAM);
    if (channel.STREAM) {
      setSelectedChannel(channel);
    } else {
      console.log('No stream available for this channel');
    }
  };

  const handleClosePlayer = () => {
    setSelectedChannel(null);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.heroSection}>
            <AnimatedIcon />
            <ThemedText type="title" style={styles.title}>
              Welcome to&nbsp;Voxel TV
            </ThemedText>
          </ThemedView>

          <ThemedText type="default" style={styles.channelsTitle}>
            Channels
          </ThemedText>

          <ChannelList channels={channels} onChannelPress={handleChannelPress} />
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={!!selectedChannel}
        animationType="slide"
        onRequestClose={handleClosePlayer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleClosePlayer} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <ThemedText type="default" style={styles.modalTitle}>
              {selectedChannel?.NOMBRE || 'Channel'}
            </ThemedText>
            <View style={styles.placeholder} />
          </View>

          {selectedChannel?.STREAM && (
            <CustomVideoPlayer
              sourceUrl={selectedChannel.STREAM.trim()}
              useNativeControls={true}
              autoPlay={true}
              onLoad={() => console.log('Channel loaded:', selectedChannel.NOMBRE)}
              onError={(error) => console.error('Channel error:', error)}
            />
          )}
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  channelsTitle: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: Spacing.four,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
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
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
});
