import React, { useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Channel, loadChannels } from '@/utils/loadChannels';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHANNELS_PER_PAGE = 2;
const CHANNEL_CARD_WIDTH = (SCREEN_WIDTH - Spacing.six * 2 - Spacing.four) / CHANNELS_PER_PAGE;

interface ChannelCardProps {
  channel: Channel;
}

function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.channelCard}>
      {channel.LOGO ? (
        <Image 
          source={{ uri: channel.LOGO }} 
          style={styles.channelLogo}
          resizeMode="contain"
        />
      ) : (
        <>
          <ThemedText type="subtitle" style={styles.channelNumber}>
            {channel['Nº']}
          </ThemedText>
          <ThemedText type="default" style={styles.channelName}>
            {channel.NOMBRE}
          </ThemedText>
        </>
      )}
    </ThemedView>
  );
}

interface ChannelListProps {
  channels: Channel[];
}

export function ChannelList({ channels }: ChannelListProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalPages = Math.ceil(channels.length / CHANNELS_PER_PAGE);

  const handleScrollLeft = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollViewRef.current?.scrollTo({
        x: newIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const handleScrollRight = () => {
    if (currentIndex < totalPages - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollViewRef.current?.scrollTo({
        x: newIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleScrollLeft}
        style={[styles.floatingArrow, styles.leftArrow, currentIndex === 0 && styles.arrowDisabled]}
        disabled={currentIndex === 0}
      >
        <View style={styles.arrowContainer}>
          <Image source={require('@/assets/images/chev_iqz.png')} style={styles.arrowImage} />
        </View>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <View key={pageIndex} style={styles.page}>
            {channels
              .slice(pageIndex * CHANNELS_PER_PAGE, (pageIndex + 1) * CHANNELS_PER_PAGE)
              .map((channel) => (
                <ChannelCard key={channel['Nº']} channel={channel} />
              ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={handleScrollRight}
        style={[styles.floatingArrow, styles.rightArrow, currentIndex >= totalPages - 1 && styles.arrowDisabled]}
        disabled={currentIndex >= totalPages - 1}
      >
        <View style={styles.arrowContainer}>
          <Image source={require('@/assets/images/chev_der.png')} style={styles.arrowImage} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  page: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.six,
  },
  channelCard: {
    width: CHANNEL_CARD_WIDTH,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  channelLogo: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
  channelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.two,
  },
  channelName: {
    textAlign: 'center',
    fontSize: 14,
  },
  floatingArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    zIndex: 10,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  arrowImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  leftArrow: {
    left: Spacing.two,
  },
  rightArrow: {
    right: Spacing.two,
  },
});
