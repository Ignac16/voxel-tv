import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, Modal, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomVideoPlayer } from '@/components/CustomVideoPlayer';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { loadChannels } from '@/utils/loadChannels';

export default function ChannelsScreen() {
  const channels = loadChannels();
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const safeAreaInsets = useSafeAreaInsets();

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
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          All Channels
        </ThemedText>

        {channels.map((channel) => (
          <TouchableOpacity
            key={channel['Nº']}
            onPress={() => handleChannelPress(channel)}
            disabled={!channel.STREAM}
            style={styles.channelItem}
          >
            <ThemedView type="backgroundElement" style={styles.channelCard}>
              {channel.LOGO ? (
                <Image 
                  source={{ uri: channel.LOGO }} 
                  style={styles.channelLogo}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.channelInfo}>
                  <ThemedText type="subtitle" style={styles.channelNumber}>
                    {channel['Nº']}
                  </ThemedText>
                  <ThemedText type="default" style={styles.channelName}>
                    {channel.NOMBRE}
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  title: {
    marginBottom: Spacing.four,
  },
  channelItem: {
    marginBottom: Spacing.three,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    borderRadius: Spacing.three,
    minHeight: 100,
  },
  channelLogo: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
  channelInfo: {
    flex: 1,
    alignItems: 'center',
  },
  channelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  channelName: {
    fontSize: 16,
    textAlign: 'center',
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
