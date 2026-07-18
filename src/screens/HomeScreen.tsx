import React, {useState} from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {backgrounds} from '../assets';
import {GameButton} from '../components/GameButton';
import {TopBar} from '../components/TopBar';
import {colors} from '../theme/colors';
import type {Game} from '../types/navigation';

type HomeTab = 'fishing' | 'shop' | 'home' | 'menu';

type HomeScreenProps = {
  cookingCoins: number;
  fishingCoins: number;
  hearts: number;
  initialGame: Game;
  onSettings: () => void;
  onGame: (game: Game) => void;
  onShop: () => void;
};

export function HomeScreen({
  cookingCoins,
  fishingCoins,
  hearts,
  initialGame,
  onSettings,
  onGame,
  onShop,
}: HomeScreenProps) {
  const {height} = useWindowDimensions();
  const compact = height < 720;
  const [game, setGame] = useState<Game>(initialGame);
  const [activeTab, setActiveTab] = useState<HomeTab>(
    initialGame === 'fishing' ? 'fishing' : 'home',
  );

  const selectGame = (selectedGame: Game, tab: HomeTab) => {
    setGame(selectedGame);
    setActiveTab(tab);
  };

  return (
    <ImageBackground
      source={
        game === 'cooking' ? backgrounds.cookingHome : backgrounds.fishingHome
      }
      style={styles.fill}
      resizeMode="cover">
      <StatusBar hidden />
      <SafeAreaView
        style={[
          styles.content,
          Platform.OS === 'android' && styles.contentAndroid,
        ]}>
        <TopBar
          hearts={hearts}
          coins={game === 'cooking' ? cookingCoins : fishingCoins}
          showHearts={game === 'cooking'}
          onSettings={onSettings}
        />
        <View style={[styles.launchArea, compact && styles.launchAreaCompact]}>
          <GameButton
            title={game === 'cooking' ? 'Open Café' : 'Go Fishing'}
            onPress={() => onGame(game)}
          />
        </View>
        <View style={[styles.nav, compact && styles.navCompact]}>
          <Nav
            icon="🎣"
            label="Fishing"
            active={activeTab === 'fishing'}
            onPress={() => selectGame('fishing', 'fishing')}
          />
          <Nav icon="🚚" label="Shop" onPress={onShop} />
          <Nav
            icon="🐟"
            label="Home"
            active={activeTab === 'home'}
            onPress={() => selectGame('cooking', 'home')}
          />
          <Nav icon="📖" label="Menu" onPress={onSettings} />
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
      style={[styles.navItem, active && styles.active]}
      onPress={onPress}>
      <Text style={styles.emoji}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  content: {flex: 1, alignItems: 'center'},
  contentAndroid: {paddingTop: 15},
  launchArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 142,
    alignItems: 'center',
    zIndex: 2,
  },
  launchAreaCompact: {bottom: 105},
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
  active: {
    backgroundColor: colors.blue,
    borderWidth: 3,
    borderColor: colors.outline,
  },
  emoji: {fontSize: 29},
  label: {fontSize: 12, color: colors.white, fontWeight: '800'},
});
