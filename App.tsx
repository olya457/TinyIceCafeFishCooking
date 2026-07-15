import React, {useEffect, useRef, useState} from 'react';
import {Animated, AppState, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import {media} from './src/assets';
import {GameLoader} from './src/components/GameLoader';
import {LevelModal} from './src/components/GameModals';
import {CookingScreen} from './src/screens/CookingScreen';
import {FishingScreen} from './src/screens/FishingScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {OnboardingScreen} from './src/screens/OnboardingScreen';
import {ShopScreen} from './src/screens/ShopScreen';
import {SplashScreen} from './src/screens/SplashScreen';
import {SettingsScreen} from './src/screens/SettingsScreen';
import {loadProgress, saveProgress} from './src/storage/progress';
import type {Game, Screen} from './src/types/navigation';

const HEARTS_PER_DAY = 5;
const HEART_PRICE = 10;
const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('splash');
  const [onboardingPage, setOnboardingPage] = useState(-1);
  const [cookingLevel, setCookingLevel] = useState(1);
  const [highestCookingLevel, setHighestCookingLevel] = useState(1);
  const [fishingLevel, setFishingLevel] = useState(1);
  const [highestFishingLevel, setHighestFishingLevel] = useState(1);
  const [cookingCoins, setCookingCoins] = useState(0);
  const [fishingCoins, setFishingCoins] = useState(0);
  const [purchasedShopItems, setPurchasedShopItems] = useState<string[]>([]);
  const [hearts, setHearts] = useState(5);
  const [lastHeartRefreshDate, setLastHeartRefreshDate] = useState(getLocalDate);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [homeGame, setHomeGame] = useState<Game>('cooking');
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);
  const [levelModal, setLevelModal] = useState<Game | null>(null);
  const [loadingGame, setLoadingGame] = useState<Game | null>(null);
  const loaderProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(loaderProgress, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(loaderProgress, {
          toValue: 0,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    const timer = setTimeout(() => setScreen('onboarding'), 5000);
    return () => {
      clearTimeout(timer);
      animation.stop();
    };
  }, [loaderProgress]);

  useEffect(() => {
    loadProgress().then(saved => {
      if (saved) {
        setCookingLevel(Math.min(Math.max(saved.cookingLevel, 1), 11));
        setHighestCookingLevel(
          Math.min(Math.max(saved.highestCookingLevel, 1), 11),
        );
        setFishingLevel(Math.min(Math.max(saved.fishingLevel, 1), 11));
        setHighestFishingLevel(
          Math.min(Math.max(saved.highestFishingLevel, 1), 11),
        );
        setCookingCoins(Math.max(saved.cookingCoins, 0));
        setFishingCoins(Math.max(saved.fishingCoins, 0));
        setPurchasedShopItems(saved.purchasedShopItems ?? []);
        const today = getLocalDate();
        if (saved.lastHeartRefreshDate === today) {
          setHearts(Math.max(saved.hearts ?? HEARTS_PER_DAY, 0));
        } else {
          setHearts(HEARTS_PER_DAY);
        }
        setLastHeartRefreshDate(today);
      }
      setProgressLoaded(true);
    });
  }, []);

  useEffect(() => {
    const refreshDailyHearts = () => {
      const today = getLocalDate();
      if (today !== lastHeartRefreshDate) {
        setHearts(HEARTS_PER_DAY);
        setLastHeartRefreshDate(today);
      }
    };
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refreshDailyHearts();
      }
    });
    return () => subscription.remove();
  }, [lastHeartRefreshDate]);

  useEffect(() => {
    if (!progressLoaded) return;
    saveProgress({
      cookingLevel,
      highestCookingLevel,
      fishingLevel,
      highestFishingLevel,
      cookingCoins,
      fishingCoins,
      purchasedShopItems,
      hearts,
      lastHeartRefreshDate,
    });
  }, [
    cookingCoins,
    cookingLevel,
    fishingCoins,
    fishingLevel,
    highestCookingLevel,
    highestFishingLevel,
    hearts,
    lastHeartRefreshDate,
    progressLoaded,
    purchasedShopItems,
  ]);

  const startGame = () => {
    if (!levelModal) return;
    const game = levelModal;
    setLevelModal(null);
    setLoadingGame(game);
    setTimeout(() => {
      setLoadingGame(null);
      setScreen(game);
    }, 1600);
  };
  const finishCookingLevel = () => {
    const nextLevel = Math.min(cookingLevel + 1, 11);
    setCookingLevel(nextLevel);
    setHighestCookingLevel(current => Math.max(current, nextLevel));
    setHearts(5);
    setHomeGame('cooking');
    setScreen('home');
  };
  const finishFishingLevel = () => {
    const nextLevel = Math.min(fishingLevel + 1, 11);
    setFishingLevel(nextLevel);
    setHighestFishingLevel(current => Math.max(current, nextLevel));
    setHomeGame('fishing');
    setScreen('home');
  };
  const restartAfterGameOver = () => {
    setCookingLevel(current => Math.max(1, current - 1));
    setHearts(5);
    setHomeGame('cooking');
    setScreen('home');
  };
  const selectedLevel = levelModal === 'fishing' ? fishingLevel : cookingLevel;
  const selectedHighestLevel =
    levelModal === 'fishing' ? highestFishingLevel : highestCookingLevel;
  const selectLevel = (nextLevel: number) =>
    levelModal === 'fishing'
      ? setFishingLevel(nextLevel)
      : setCookingLevel(nextLevel);
  const buyShopItem = (id: string, price: number) => {
    if (purchasedShopItems.includes(id) || cookingCoins < price) return false;
    setCookingCoins(current => current - price);
    setPurchasedShopItems(current => [...current, id]);
    return true;
  };
  const buyHeart = () => {
    if (cookingCoins < HEART_PRICE) return false;
    setCookingCoins(current => current - HEART_PRICE);
    setHearts(current => current + 1);
    return true;
  };
  const resetCookingProgress = () => {
    setCookingLevel(1);
    setHighestCookingLevel(1);
    setCookingCoins(0);
    setPurchasedShopItems([]);
    setHearts(5);
  };
  const resetFishingProgress = () => {
    setFishingLevel(1);
    setHighestFishingLevel(1);
    setFishingCoins(0);
  };
  return (
    <View style={styles.fill}>
      {screen === 'splash' && <SplashScreen progress={loaderProgress} />}
      {screen === 'onboarding' && (
        <OnboardingScreen
          page={onboardingPage}
          sound={sound}
          onPage={setOnboardingPage}
          onDone={() => setScreen('home')}
        />
      )}
      {screen !== 'splash' && screen !== 'onboarding' && (
        <>
          {screen === 'home' && (
            <HomeScreen
              cookingCoins={cookingCoins}
              fishingCoins={fishingCoins}
              hearts={hearts}
              initialGame={homeGame}
              onGame={setLevelModal}
              onShop={() => setScreen('shop')}
              onSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'cooking' && (
            <CookingScreen
              level={cookingLevel}
              coins={cookingCoins}
              hearts={hearts}
              onCoins={value => setCookingCoins(current => current + value)}
              onLoseHeart={() => setHearts(current => Math.max(0, current - 1))}
              onHome={() => {
                setHomeGame('cooking');
                setScreen('home');
              }}
              onGameOver={restartAfterGameOver}
              onLevelComplete={finishCookingLevel}
              onSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'fishing' && (
            <FishingScreen
              level={fishingLevel}
              coins={fishingCoins}
              onCoins={value => setFishingCoins(current => current + value)}
              onHome={() => {
                setHomeGame('fishing');
                setScreen('home');
              }}
              onLevelComplete={finishFishingLevel}
              onSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'shop' && (
            <ShopScreen
              coins={cookingCoins}
              hearts={hearts}
              purchasedItems={purchasedShopItems}
              onBuy={buyShopItem}
              onBuyHeart={buyHeart}
              onHome={() => {
                setHomeGame('cooking');
                setScreen('home');
              }}
              onFishing={() => {
                setHomeGame('fishing');
                setScreen('home');
              }}
              onSettings={() => setScreen('settings')}
            />
          )}
          {screen === 'settings' && (
            <SettingsScreen
              sound={sound}
              music={music}
              onSound={setSound}
              onMusic={setMusic}
              onResetCooking={resetCookingProgress}
              onResetFishing={resetFishingProgress}
              onFishing={() => {
                setHomeGame('fishing');
                setScreen('home');
              }}
              onShop={() => setScreen('shop')}
              onHome={() => {
                setHomeGame('cooking');
                setScreen('home');
              }}
            />
          )}
          <LevelModal
            game={levelModal}
            level={selectedLevel}
            maxUnlockedLevel={selectedHighestLevel}
            onLevel={selectLevel}
            onClose={() => setLevelModal(null)}
            onPlay={startGame}
          />
          <GameLoader
            game={loadingGame}
            level={loadingGame === 'fishing' ? fishingLevel : cookingLevel}
            progress={loaderProgress}
          />
        </>
      )}
      {music && (
        <Video
          source={media.backgroundMusic}
          repeat
          volume={0.18}
          ignoreSilentSwitch="ignore"
          playInBackground
          style={styles.media}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  media: {width: 1, height: 1, position: 'absolute'},
});
