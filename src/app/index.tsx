import * as Device from 'expo-device';
import React from 'react';
import { Platform, StyleSheet, ScrollView, View, Modal, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChannelList } from '@/components/channel-list';
import { CustomVideoPlayer } from '@/components/CustomVideoPlayer';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { loadChannels } from '@/utils/loadChannels';
import { useTheme } from '@/hooks/use-theme';
import { Collapsible } from '@/components/ui/collapsible';

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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSettings, setShowSettings] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState({
    newReleases: false,
    pendingEpisodes: false,
  });
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

  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleShowHistory = () => {
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleShowEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const toggleNewReleases = () => {
    setNotificationsEnabled(prev => ({ ...prev, newReleases: !prev.newReleases }));
  };

  const togglePendingEpisodes = () => {
    setNotificationsEnabled(prev => ({ ...prev, pendingEpisodes: !prev.pendingEpisodes }));
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
      <TouchableOpacity 
        onPress={handleSettingsPress} 
        style={styles.settingsButton}
      >
        <Image 
          source={require('@/assets/images/tabIcons/settings.png')} 
          style={[styles.settingsIcon, { tintColor: theme.text }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.heroSection}>
            <AnimatedIcon />
            <ThemedText type="title" style={styles.title}>
              Welcome to&nbsp;Voxel TV
            </ThemedText>
          </ThemedView>

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

          <ThemedText type="default" style={styles.channelsTitle}>
            Channels
          </ThemedText>

          <ChannelList channels={filteredChannels} onChannelPress={handleChannelPress} />
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

      <Modal
        visible={showSettings}
        animationType="slide"
        onRequestClose={handleCloseSettings}
      >
        <View style={styles.settingsModalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseSettings} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <ThemedText type="default" style={styles.modalTitle}>
              Settings
            </ThemedText>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.settingsScrollView}>
            <ThemedView style={styles.settingsSection}>
              <ThemedText type="default" style={[styles.sectionTitle, { color: theme.text }]}>
                Mi Perfil
              </ThemedText>
              <TouchableOpacity style={styles.settingsItem}>
                <ThemedText type="default">Cambiar de usuario</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={handleShowEditProfile}>
                <ThemedText type="default">Editar foto o nombre</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={handleShowHistory}>
                <ThemedText type="default">Ver historial</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.settingsSection}>
              <ThemedText type="default" style={[styles.sectionTitle, { color: theme.text }]}>
                Notificaciones
              </ThemedText>
              <TouchableOpacity style={styles.settingsItem} onPress={toggleNewReleases}>
                <View style={styles.switchRow}>
                  <ThemedText type="default">Activar avisos para nuevos estrenos</ThemedText>
                  <View style={[styles.switchIndicator, { backgroundColor: notificationsEnabled.newReleases ? '#4CAF50' : '#666' }]} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={togglePendingEpisodes}>
                <View style={styles.switchRow}>
                  <ThemedText type="default">Recordatorios de capítulos pendientes</ThemedText>
                  <View style={[styles.switchIndicator, { backgroundColor: notificationsEnabled.pendingEpisodes ? '#4CAF50' : '#666' }]} />
                </View>
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showHistory}
        animationType="slide"
        onRequestClose={handleCloseHistory}
      >
        <View style={styles.settingsModalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseHistory} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <ThemedText type="default" style={styles.modalTitle}>
              Historial
            </ThemedText>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.settingsScrollView}>
            <ThemedText type="default" style={styles.emptyState}>
              No hay historial de reproducción aún
            </ThemedText>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showEditProfile}
        animationType="slide"
        onRequestClose={handleCloseEditProfile}
      >
        <View style={styles.settingsModalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseEditProfile} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <ThemedText type="default" style={styles.modalTitle}>
              Editar Perfil
            </ThemedText>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.settingsScrollView}>
            <ThemedView style={styles.settingsSection}>
              <ThemedText type="default" style={styles.sectionTitle}>
                Foto de perfil
              </ThemedText>
              <TouchableOpacity style={styles.settingsItem}>
                <ThemedText type="default">Cambiar foto</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.settingsSection}>
              <ThemedText type="default" style={styles.sectionTitle}>
                Nombre
              </ThemedText>
              <TouchableOpacity style={styles.settingsItem}>
                <ThemedText type="default">Editar nombre</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ScrollView>
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
  settingsButton: {
    position: 'absolute',
    top: Spacing.four,
    right: Spacing.two,
    zIndex: 100,
    padding: Spacing.three,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
  },
  settingsIcon: {
    width: 32,
    height: 32,
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
  settingsModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  settingsScrollView: {
    flex: 1,
    padding: Spacing.four,
  },
  contentSpacing: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  settingsSection: {
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
    color: '#fff',
  },
  settingsItem: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.two,
    marginBottom: Spacing.two,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchIndicator: {
    width: 40,
    height: 24,
    borderRadius: 12,
  },
  emptyState: {
    textAlign: 'center',
    marginTop: Spacing.six,
    color: '#888',
    fontSize: 16,
  },
});
