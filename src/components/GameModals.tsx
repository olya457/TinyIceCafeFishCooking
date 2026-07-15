import React from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {LEVELS} from '../data/levels';
import {colors} from '../theme/colors';
import type {Game} from '../types/navigation';
import {GameButton} from './GameButton';
import {SquareButton} from './SquareButton';

const Overlay = ({children}: {children: React.ReactNode}) => <View style={styles.overlay}>{children}</View>;

export function LevelModal({game, level, maxUnlockedLevel, onLevel, onClose, onPlay}: {game: Game | null; level: number; maxUnlockedLevel: number; onLevel: (n: number) => void; onClose: () => void; onPlay: () => void}) {
  const goal = LEVELS[level - 1];
  return <Modal transparent visible={!!game} animationType="fade"><Overlay><View style={styles.levelCard}>
    <Pressable onPress={onClose} style={styles.topClose}><Text style={styles.closeText}>×</Text></Pressable>
    <Text style={styles.title}>Level {level}</Text><Text style={styles.subtitle}>Goals:</Text>
    <View style={styles.goalRow}><Text style={styles.goalIcon}>●</Text><Text style={styles.goalText}>+ {goal[1]}</Text><Text style={styles.goalIcon}>♟</Text><Text style={styles.goalText}>{goal[0]}</Text></View>
    <Text style={styles.hint}>{game === 'cooking' ? `Serve ${goal[0]} customers` : `Catch ${goal[0]} fish`} and collect {goal[1]} coins</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelStrip}>{LEVELS.map((_, i) => { const locked = i + 1 > maxUnlockedLevel; return <Pressable key={i} disabled={locked} onPress={() => onLevel(i + 1)} style={[styles.levelChip, i + 1 === level && styles.activeChip, locked && styles.lockedChip]}><Text style={styles.chipText}>{locked ? '🔒' : i + 1}</Text></Pressable>; })}</ScrollView>
    <GameButton title="Play" onPress={onPlay} />
  </View></Overlay></Modal>;
}

export function PauseModal({visible, onResume, onHome, onSettings}: {visible: boolean; onResume: () => void; onHome: () => void; onSettings: () => void}) {
  void onSettings;
  return <Modal transparent visible={visible} animationType="fade"><Overlay><View style={styles.smallCard}><Text style={styles.title}>Pause</Text><Text style={styles.hint}>Take a warm little break</Text><View style={styles.actions}><SquareButton icon="⌂" onPress={onHome} /><SquareButton icon="▶" onPress={onResume} /></View></View></Overlay></Modal>;
}

export function CompleteModal({visible, coins, onHome}: {visible: boolean; coins: number; onHome: () => void}) {
  return <Modal transparent visible={visible} animationType="fade"><Overlay><View style={styles.smallCard}><Text style={styles.stars}>★ ★ ★</Text><Text style={styles.complete}>LEVEL{`\n`}COMPLETED</Text><Text style={styles.reward}>●  + {coins}</Text><GameButton title="Nice" onPress={onHome} /></View></Overlay></Modal>;
}

export function GameOverModal({visible, onRestart}: {visible: boolean; onRestart: () => void}) {
  return <Modal transparent visible={visible} animationType="fade"><Overlay><View style={styles.smallCard}><Text style={styles.gameOver}>GAME OVER</Text><Text style={styles.hint}>You ran out of hearts</Text><Text style={styles.gameOverHeart}>♡</Text><GameButton title="Start Again" onPress={onRestart} /></View></Overlay></Modal>;
}

export function SettingsModal({visible, sound, music, onSound, onMusic, onClose}: {visible: boolean; sound: boolean; music: boolean; onSound: (v: boolean) => void; onMusic: (v: boolean) => void; onClose: () => void}) {
  return <Modal transparent visible={visible} animationType="fade"><Overlay><View style={styles.settingsCard}><Text style={styles.settingsTitle}>Settings</Text><View style={styles.settingRow}><Text style={styles.settingLabel}>Sound</Text><Switch value={sound} onValueChange={onSound} trackColor={{false: '#7c9aad', true: colors.darkBlue}} /></View><View style={styles.settingRow}><Text style={styles.settingLabel}>Music</Text><Switch value={music} onValueChange={onMusic} trackColor={{false: '#7c9aad', true: colors.darkBlue}} /></View><Pressable onPress={onClose} style={styles.closeButton}><Text style={styles.closeText}>×</Text></Pressable></View></Overlay></Modal>;
}

const styles = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0,20,45,.62)', justifyContent: 'center', alignItems: 'center', padding: 18},
  levelCard: {width: '100%', maxWidth: 410, backgroundColor: colors.blue, borderWidth: 8, borderColor: colors.outline, borderRadius: 48, padding: 22, alignItems: 'center'},
  smallCard: {width: 330, backgroundColor: colors.blue, borderWidth: 8, borderColor: colors.outline, borderRadius: 48, padding: 24, alignItems: 'center'},
  topClose: {position: 'absolute', right: 15, top: 10, zIndex: 2}, closeText: {fontSize: 36, color: colors.white, fontWeight: '900'},
  title: {fontFamily: 'Georgia', fontSize: 30, color: colors.white, fontWeight: '900', marginBottom: 10}, subtitle: {fontFamily: 'Georgia', fontSize: 21, color: colors.white, fontWeight: '900'},
  goalRow: {flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 12}, goalIcon: {fontSize: 38, color: colors.yellow}, goalText: {color: colors.white, fontSize: 20, fontWeight: '900', marginRight: 18}, hint: {color: colors.white, fontWeight: '700', textAlign: 'center'},
  levelStrip: {gap: 7, paddingVertical: 14}, levelChip: {width: 34, height: 34, borderRadius: 17, backgroundColor: '#94d6f7', alignItems: 'center', justifyContent: 'center'}, activeChip: {backgroundColor: colors.darkBlue, borderWidth: 2, borderColor: colors.white}, chipText: {color: colors.white, fontWeight: '900'},
  lockedChip: {opacity: 0.55},
  actions: {flexDirection: 'row', gap: 22, marginTop: 24}, stars: {color: colors.yellow, fontSize: 40}, complete: {fontFamily: 'Georgia', fontSize: 30, textAlign: 'center', color: colors.white, fontWeight: '900'}, reward: {fontSize: 28, color: colors.yellow, fontWeight: '900', marginVertical: 18},
  gameOver: {fontFamily: 'Georgia', color: colors.white, fontSize: 35, fontWeight: '900', marginBottom: 10}, gameOverHeart: {color: '#ff3d86', fontSize: 70, fontWeight: '900', lineHeight: 82},
  settingsCard: {width: '96%', maxWidth: 390, backgroundColor: colors.blue, borderWidth: 8, borderColor: colors.outline, borderRadius: 55, padding: 30, paddingBottom: 38}, settingsTitle: {fontFamily: 'Georgia', color: colors.white, fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 16}, settingRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 9}, settingLabel: {fontFamily: 'Georgia', color: colors.white, fontSize: 27, fontWeight: '900'}, closeButton: {position: 'absolute', bottom: -29, alignSelf: 'center', width: 62, height: 62, borderRadius: 18, borderWidth: 6, borderColor: colors.outline, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center'},
});
