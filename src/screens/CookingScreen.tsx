import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {backgrounds, characters, cooking} from '../assets';
import {CompleteModal, GameOverModal, PauseModal} from '../components/GameModals';
import {SquareButton} from '../components/SquareButton';
import {TopBar} from '../components/TopBar';
import {LEVELS} from '../data/levels';
import {colors} from '../theme/colors';

type FishState = 'raw' | 'cooking' | 'ready' | 'plated';
type Sauce = 'orange' | 'yellow' | null;

const recipes = [
  {name: 'Green Fish', image: cooking.fishWithGreens, needsTea: false, needsLemon: false},
  {name: 'Fish & Tea', image: cooking.cookedDish, needsTea: true, needsLemon: false},
  {name: 'Lemon Fish', image: cooking.cookedDish, needsTea: false, needsLemon: true},
] as const;

const randomDifferentIndex = (current: number, length: number) =>
  (current + 1 + Math.floor(Math.random() * (length - 1))) % length;

export function CookingScreen({level, coins, hearts, onCoins, onLoseHeart, onHome, onGameOver, onLevelComplete, onSettings}: {level: number; coins: number; hearts: number; onCoins: (n: number) => void; onLoseHeart: () => void; onHome: () => void; onGameOver: () => void; onLevelComplete: () => void; onSettings: () => void}) {
  const target = LEVELS[level - 1][0];
  const [served, setServed] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [teapotVisible, setTeapotVisible] = useState(false);
  const [cupVisible, setCupVisible] = useState(false);
  const [greensOnPlate, setGreensOnPlate] = useState(false);
  const [lemonOnPlate, setLemonOnPlate] = useState(false);
  const [sauceOnPlate, setSauceOnPlate] = useState<Sauce>(null);
  const [fishState, setFishState] = useState<FishState>('raw');
  const [fishAvailable, setFishAvailable] = useState(true);
  const [cookingSeconds, setCookingSeconds] = useState(3);
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [customerIndex, setCustomerIndex] = useState(0);
  const [usedCustomers, setUsedCustomers] = useState<number[]>([0]);
  const [paused, setPaused] = useState(false);
  const [complete, setComplete] = useState(false);
  const [orderSeconds, setOrderSeconds] = useState(30);
  const recipe = recipes[recipeIndex];
  const orderReady = fishState === 'plated' && (!recipe.needsTea || cupVisible) && (!recipe.needsLemon || lemonOnPlate);

  useEffect(() => {
    if (fishState !== 'cooking' || paused || hearts <= 0) return;
    if (cookingSeconds <= 0) {
      setFishState('ready');
      return;
    }
    const timer = setTimeout(() => setCookingSeconds(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cookingSeconds, fishState, hearts, paused]);

  useEffect(() => {
    if (paused || complete || orderReady || hearts <= 0) return;
    if (orderSeconds <= 0) {
      onLoseHeart();
      setOrderSeconds(30);
      setFishState('raw');
      setFishAvailable(true);
      setCookingSeconds(3);
      setGreensOnPlate(false);
      setLemonOnPlate(false);
      setSauceOnPlate(null);
      setTeapotVisible(false);
      setCupVisible(false);
      return;
    }
    const timer = setTimeout(() => setOrderSeconds(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [complete, hearts, onLoseHeart, orderReady, orderSeconds, paused]);

  const putFishInPan = () => {
    if (fishState === 'raw' && fishAvailable) {
      setFishAvailable(false);
      setCookingSeconds(3);
      setFishState('cooking');
    }
  };

  const moveFishToPlate = () => {
    if (fishState === 'ready' && greensOnPlate) setFishState('plated');
  };

  const clearWorktop = () => {
    setFishState('raw');
    setFishAvailable(true);
    setCookingSeconds(3);
    setGreensOnPlate(false);
    setLemonOnPlate(false);
    setSauceOnPlate(null);
    setTeapotVisible(false);
    setCupVisible(false);
  };

  const showNextCustomer = () => {
    let available = characters.map((_, index) => index).filter(index => !usedCustomers.includes(index));
    if (available.length === 0) available = characters.map((_, index) => index).filter(index => index !== customerIndex);
    const nextIndex = available[Math.floor(Math.random() * available.length)];
    setCustomerIndex(nextIndex);
    setUsedCustomers(current => current.length >= characters.length ? [nextIndex] : [...current, nextIndex]);
  };

  const serveDish = () => {
    if (!orderReady) return;
    onCoins(10);
    setEarnedCoins(value => value + 10);
    setOrderSeconds(30);
    clearWorktop();

    const nextCustomerCount = served + 1;
    setServed(nextCustomerCount);
    if (nextCustomerCount >= target) {
      setComplete(true);
      return;
    }

    setRecipeIndex(index => randomDifferentIndex(index, recipes.length));
    showNextCustomer();
  };

  return <ImageBackground source={backgrounds.cafe} style={styles.fill} resizeMode="cover">
    <StatusBar hidden />
    <SafeAreaView style={styles.fill}>
      <TopBar hearts={hearts} coins={coins} onSettings={onSettings} showSettings={false} />
      <View style={[styles.orderTimer, orderSeconds <= 10 && styles.orderTimerDanger]}><Text style={styles.orderTimerText}>⏱ {orderSeconds}</Text></View>

      <Pressable style={styles.customerArea} onPress={serveDish}>
        <Image source={characters[customerIndex]} style={styles.customer} resizeMode="contain" />
        <View style={styles.orderCard}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Image source={recipe.image} style={styles.orderDish} resizeMode="contain" />
          {recipe.needsTea && <><Text style={styles.orderPlus}>+</Text><Image source={cooking.teaMug} style={styles.orderMug} resizeMode="contain" /></>}
          {recipe.needsLemon && <><Text style={styles.orderPlus}>+</Text><Image source={cooking.lemon} style={styles.orderMug} resizeMode="contain" /></>}
        </View>
      </Pressable>

      <View style={styles.kitchenArea}>
        <Image source={cooking.counter} style={styles.counter} resizeMode="stretch" />

        <Pressable style={styles.teapotSlot} onPress={() => setTeapotVisible(true)}>
          {teapotVisible && <Image source={cooking.teapot} style={styles.teapot} resizeMode="contain" />}
        </Pressable>
        <Pressable style={styles.cupSlot} onPress={() => teapotVisible && setCupVisible(true)}>
          {cupVisible && <Image source={cooking.teaMug} style={styles.cup} resizeMode="contain" />}
        </Pressable>

        <View style={styles.plateOne}>
          <Image source={cooking.plate} style={styles.plate} resizeMode="contain" />
          {greensOnPlate && fishState !== 'plated' && <Image source={cooking.greens} style={styles.plateGreens} resizeMode="contain" />}
          {lemonOnPlate && fishState !== 'plated' && <Image source={cooking.lemon} style={styles.plateLemon} resizeMode="contain" />}
          {sauceOnPlate && <Image source={sauceOnPlate === 'orange' ? cooking.orangeSauce : cooking.yellowSauce} style={styles.plateSauce} resizeMode="contain" />}
          {fishState === 'plated' && <View style={styles.finishedPress}><Image source={recipe.image} style={styles.finishedDish} resizeMode="contain" /></View>}
        </View>
        <View style={styles.plateTwo}><Image source={cooking.plate} style={styles.plate} resizeMode="contain" /></View>

        <Pressable style={styles.pan} onPress={moveFishToPlate}>
          {fishState === 'cooking' && <View style={styles.timer}><Text style={styles.timerText}>{cookingSeconds}</Text></View>}
          {fishState === 'ready' && <Image source={cooking.fish} style={styles.panFish} resizeMode="contain" />}
        </Pressable>

        <Pressable style={styles.orangeSauceSlot} onPress={() => setSauceOnPlate('orange')}>
          <Image source={cooking.orangeSauce} style={styles.sauceBowl} resizeMode="contain" />
        </Pressable>
        <Pressable style={styles.yellowSauceSlot} onPress={() => setSauceOnPlate('yellow')}>
          <Image source={cooking.yellowSauce} style={styles.sauceBowl} resizeMode="contain" />
        </Pressable>

        <Pressable style={styles.rawFishPress} onPress={putFishInPan}>
          {fishAvailable && <Image source={cooking.fish} style={styles.shelfFish} resizeMode="contain" />}
        </Pressable>
        <Pressable style={styles.rawGreensPress} onPress={() => setGreensOnPlate(true)}>
          {!greensOnPlate && <Image source={cooking.greens} style={styles.shelfGreens} resizeMode="contain" />}
        </Pressable>
        <Pressable style={styles.rawLemonPress} onPress={() => recipe.needsLemon && setLemonOnPlate(true)}>
          {recipe.needsLemon && !lemonOnPlate && <Image source={cooking.lemon} style={styles.shelfLemon} resizeMode="contain" />}
        </Pressable>
      </View>

      <Pressable disabled={!orderReady} onPress={serveDish} style={[styles.progress, orderReady && styles.progressReady]}><Text style={styles.progressText}>{orderReady ? 'Tap customer to serve' : `${served}/${target} customers`}</Text></Pressable>
      <View style={styles.pause}><SquareButton icon="Ⅱ" onPress={() => setPaused(true)} /></View>
      <PauseModal visible={paused} onResume={() => setPaused(false)} onHome={onHome} onSettings={onSettings} />
      <CompleteModal visible={complete} coins={earnedCoins} onHome={onLevelComplete} />
      <GameOverModal visible={hearts <= 0 && !complete} onRestart={onGameOver} />
    </SafeAreaView>
  </ImageBackground>;
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  customerArea: {position: 'absolute', top: '9%', left: 0, right: 0, height: '38%', alignItems: 'center', justifyContent: 'flex-end', transform: [{translateY: 120}], zIndex: 1},
  customer: {height: '112%', width: '68%'},
  orderCard: {position: 'absolute', right: '5%', top: '3%', width: 82, minHeight: 132, paddingVertical: 7, borderRadius: 13, backgroundColor: colors.white, borderWidth: 3, borderColor: colors.outline, alignItems: 'center', justifyContent: 'space-around'},
  recipeName: {fontSize: 9, color: colors.darkBlue, fontWeight: '900', textAlign: 'center'}, orderDish: {width: 58, height: 45}, orderMug: {width: 36, height: 31}, orderPlus: {fontSize: 16, fontWeight: '900', color: colors.darkBlue},
  kitchenArea: {position: 'absolute', left: 0, right: 0, top: '37%', height: '37%', transform: [{translateY: 120}], zIndex: 2},
  counter: {position: 'absolute', width: '100%', height: '100%'},
  teapotSlot: {position: 'absolute', left: '3%', top: '4%', width: '15%', height: '15%', alignItems: 'center', justifyContent: 'center'}, teapot: {width: 52, height: 45},
  cupSlot: {position: 'absolute', left: '4%', top: '18%', width: '13%', height: '13%', alignItems: 'center', justifyContent: 'center'}, cup: {width: 39, height: 34},
  plateOne: {position: 'absolute', left: '21%', top: '16%', width: '18%', height: '16%', alignItems: 'center', justifyContent: 'center'},
  plateTwo: {position: 'absolute', left: '40%', top: '16%', width: '18%', height: '16%', alignItems: 'center', justifyContent: 'center'},
  plate: {position: 'absolute', width: '100%', height: '100%'}, plateGreens: {width: '72%', height: '72%'}, plateLemon: {position: 'absolute', right: 0, bottom: 0, width: '45%', height: '45%'}, plateSauce: {position: 'absolute', left: '30%', top: '34%', width: '40%', height: '40%', zIndex: 3},
  finishedPress: {width: 90, height: 74, alignItems: 'center', justifyContent: 'center'}, finishedDish: {width: 100, height: 82},
  pan: {position: 'absolute', right: '4%', top: '15%', width: '18%', height: '17%', alignItems: 'center', justifyContent: 'center'}, panFish: {width: 62, height: 52},
  timer: {width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,154,38,.9)', alignItems: 'center', justifyContent: 'center'}, timerText: {fontSize: 22, color: colors.white, fontWeight: '900'},
  orangeSauceSlot: {position: 'absolute', left: '2%', top: '33%', width: '18%', height: '14%', alignItems: 'center', justifyContent: 'center'}, yellowSauceSlot: {position: 'absolute', left: '21%', top: '33%', width: '18%', height: '14%', alignItems: 'center', justifyContent: 'center'}, sauceBowl: {width: '76%', height: '76%'},
  rawFishPress: {position: 'absolute', left: '20%', bottom: '2%', width: '20%', height: '19%', alignItems: 'center', justifyContent: 'center'}, rawGreensPress: {position: 'absolute', left: '40%', bottom: '2%', width: '20%', height: '19%', alignItems: 'center', justifyContent: 'center'}, rawLemonPress: {position: 'absolute', left: '60%', bottom: '2%', width: '18%', height: '19%', alignItems: 'center', justifyContent: 'center'},
  shelfFish: {width: 68, height: 57}, shelfGreens: {width: 68, height: 57}, shelfLemon: {width: 58, height: 50},
  progress: {position: 'absolute', left: 12, bottom: 38, backgroundColor: colors.darkBlue, borderWidth: 3, borderColor: colors.outline, borderRadius: 15, paddingHorizontal: 14, paddingVertical: 10}, progressReady: {backgroundColor: '#25a85a'}, progressText: {color: colors.white, fontWeight: '900', fontSize: 15},
  orderTimer: {position: 'absolute', right: 18, top: 58, minWidth: 72, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, backgroundColor: colors.darkBlue, borderWidth: 3, borderColor: colors.outline, alignItems: 'center', zIndex: 5}, orderTimerDanger: {backgroundColor: '#dc3f50'}, orderTimerText: {color: colors.white, fontSize: 17, fontWeight: '900'},
  pause: {position: 'absolute', right: 12, bottom: 32},
});
