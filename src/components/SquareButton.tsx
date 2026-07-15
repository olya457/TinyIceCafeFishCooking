import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../theme/colors';

export function SquareButton({icon, onPress}: {icon: string; onPress: () => void}) {
  return <Pressable onPress={onPress} style={styles.button}><Text style={styles.icon}>{icon}</Text></Pressable>;
}

const styles = StyleSheet.create({
  button: {width: 50, height: 50, borderRadius: 14, borderWidth: 4, borderColor: colors.outline, backgroundColor: colors.blue, justifyContent: 'center', alignItems: 'center'},
  icon: {color: colors.white, fontSize: 26, fontWeight: '900'},
});
