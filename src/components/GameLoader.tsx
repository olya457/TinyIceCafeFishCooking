import React from 'react';
import {Animated, ImageBackground, Modal, StyleSheet, Text, View} from 'react-native';
import {backgrounds} from '../assets';
import {colors} from '../theme/colors';
import type {Game} from '../types/navigation';

export function GameLoader({game, level, progress}: {game: Game | null; level: number; progress: Animated.Value}) {
  return <Modal transparent visible={!!game} animationType="fade"><ImageBackground source={game === 'fishing' ? backgrounds.fishingHome : backgrounds.cafe} style={styles.screen} resizeMode="cover"><View style={styles.box}><Text style={styles.title}>Level {level}</Text><Text style={styles.text}>Preparing your {game === 'fishing' ? 'fishing spot' : 'ice café'}…</Text><View style={styles.track}><Animated.View style={[styles.pill, {transform: [{translateX: progress.interpolate({inputRange: [0, 1], outputRange: [0, 144]})}]}]} /></View></View></ImageBackground></Modal>;
}
const styles = StyleSheet.create({screen: {flex: 1, justifyContent: 'center', alignItems: 'center'}, box: {width: 300, backgroundColor: colors.blue, borderWidth: 7, borderColor: colors.outline, borderRadius: 30, padding: 24, alignItems: 'center'}, title: {fontSize: 30, color: colors.white, fontFamily: 'Georgia', fontWeight: '900'}, text: {color: colors.white, fontWeight: '700', marginVertical: 15}, track: {width: 190, height: 15, borderRadius: 8, backgroundColor: colors.white, padding: 3, overflow: 'hidden'}, pill: {height: 9, width: 40, borderRadius: 5, backgroundColor: colors.darkBlue}});
