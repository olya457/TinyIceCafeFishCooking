import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {SquareButton} from './SquareButton';

export function CoinBadge({coins}: {coins: number}) {
  return <View style={styles.stat}><Text style={styles.coin}>●</Text><Text style={styles.value}>{coins}</Text></View>;
}

export function TopBar({hearts, coins, onSettings, showSettings = false}: {hearts: number; coins: number; onSettings: () => void; showSettings?: boolean}) {
  return <View style={styles.bar}>
    <View style={styles.stat}><Text style={styles.heart}>♥</Text><Text style={styles.value}>{hearts}</Text></View>
    <CoinBadge coins={coins} />
    {showSettings && <SquareButton icon="⚙" onPress={onSettings} />}
  </View>;
}

const styles = StyleSheet.create({
  bar: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingTop: 8},
  stat: {height: 34, minWidth: 72, paddingHorizontal: 8, backgroundColor: colors.darkBlue, borderWidth: 3, borderColor: colors.outline, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 7},
  heart: {fontSize: 23, color: '#ff3dab', lineHeight: 27},
  coin: {fontSize: 30, color: colors.yellow, lineHeight: 31},
  value: {color: colors.white, fontWeight: '900', fontSize: 16},
});
