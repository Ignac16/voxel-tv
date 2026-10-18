import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, Modal, Text, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomVideoPlayer } from '@/components/CustomVideoPlayer';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { loadChannels } from '@/utils/loadChannels';
import { useTheme } from '@/hooks/use-theme';

export default function ChannelsScreen() {
  const channels = loadChannels();
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

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

  const filteredChannels = channels.filter((channel: any) => {
    const query = searchQuery.toLowerCase();
    return (
      channel.NOMBRE?.toLowerCase().includes(query) ||
      channel['Nº']?.toString().includes(query) ||
      (channel.LOGO && channel.LOGO.toLowerCase().includes(query))
    );
  });

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

        <ThemedView type="backgroundElement" style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Image 
              source={require('@/assets/images/glass.png')} 
              style={styles.searchIcon}
              resizeMode="contain"
            />
          </View>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search channels..."
            placeholderTextColor={theme.textSecondary}
          />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <ThemedText style={styles.clearText}>✕</ThemedText>
              </TouchableOpacity>
            )}
        </ThemedView>

        {filteredChannels.map((channel) => (
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  searchIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: Spacing.one,
  },
  clearText: {
    fontSize: 18,
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
