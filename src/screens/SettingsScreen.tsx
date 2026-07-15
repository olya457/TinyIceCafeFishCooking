import React, {useState} from 'react';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {backgrounds} from '../assets';
import {colors} from '../theme/colors';

type SettingsScreenProps = {
  sound: boolean;
  music: boolean;
  onSound: (value: boolean) => void;
  onMusic: (value: boolean) => void;
  onResetCooking: () => void;
  onResetFishing: () => void;
  onFishing: () => void;
  onShop: () => void;
  onHome: () => void;
};

export function SettingsScreen({
  sound,
  music,
  onSound,
  onMusic,
  onResetCooking,
  onResetFishing,
  onFishing,
  onShop,
  onHome,
}: SettingsScreenProps) {
  const {height} = useWindowDimensions();
  const compact = height < 720;
  const [message, setMessage] = useState('');

  return (
    <ImageBackground
      source={backgrounds.settings}
      style={styles.fill}
      resizeMode="cover">
      <StatusBar hidden />
      <SafeAreaView style={styles.fill}>
        <View style={[styles.card, compact && styles.cardCompact]}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound</Text>
            <Switch
              value={sound}
              onValueChange={onSound}
              trackColor={{false: '#7c9aad', true: colors.darkBlue}}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Music</Text>
            <Switch
              value={music}
              onValueChange={onMusic}
              trackColor={{false: '#7c9aad', true: colors.darkBlue}}
            />
          </View>

          <Text style={styles.progressTitle}>Reset progress</Text>

          <Pressable
            style={styles.resetButton}
            onPress={() => {
              onResetCooking();
              setMessage('Café progress has been reset');
            }}>
            <Text style={styles.resetButtonText}>Reset Café</Text>
          </Pressable>

          <Pressable
            style={styles.resetButton}
            onPress={() => {
              onResetFishing();
              setMessage('Fishing progress has been reset');
            }}>
            <Text style={styles.resetButtonText}>Reset Fishing</Text>
          </Pressable>

          {!!message && <Text style={styles.message}>{message}</Text>}
        </View>

        <View style={[styles.nav, compact && styles.navCompact]}>
          <Nav icon="🎣" label="Fishing" onPress={onFishing} />
          <Nav icon="🚚" label="Shop" onPress={onShop} />
          <Nav icon="🐟" label="Home" onPress={onHome} />
          <Nav icon="📖" label="Menu" active onPress={() => {}} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function Nav({
  icon,
  label,
  onPress,
  active = false,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      style={[styles.navItem, active && styles.activeTab]}
      onPress={onPress}>
      <Text style={styles.emoji}>{icon}</Text>
      <Text style={styles.navLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  card: {
    width: '88%',
    maxWidth: 390,
    alignSelf: 'center',
    marginTop: '24%',
    backgroundColor: 'rgba(95, 188, 237, 0.96)',
    borderWidth: 7,
    borderColor: colors.outline,
    borderRadius: 42,
    padding: 24,
  },
  cardCompact: {marginTop: 56, padding: 16, borderRadius: 30, borderWidth: 5},
  title: {
    fontFamily: 'Georgia',
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 13,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },
  settingLabel: {
    fontFamily: 'Georgia',
    color: colors.white,
    fontSize: 25,
    fontWeight: '900',
  },
  progressTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  resetButton: {
    backgroundColor: colors.darkBlue,
    borderWidth: 3,
    borderColor: colors.outline,
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  resetButtonText: {color: colors.white, fontSize: 16, fontWeight: '900'},
  message: {
    color: '#fff16c',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },
  nav: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 30,
    height: 86,
    backgroundColor: colors.darkBlue,
    borderRadius: 18,
    flexDirection: 'row',
    padding: 4,
  },
  navCompact: {bottom: 8, height: 76},
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  activeTab: {
    backgroundColor: colors.blue,
    borderWidth: 3,
    borderColor: colors.outline,
  },
  emoji: {fontSize: 29},
  navLabel: {fontSize: 12, color: colors.white, fontWeight: '800'},
});
