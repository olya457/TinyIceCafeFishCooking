import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../theme/colors';

type Props = {title: string; onPress: () => void; disabled?: boolean};

export function GameButton({title, onPress, disabled = false}: Props) {
  return <Pressable disabled={disabled} onPress={onPress} style={({pressed}) => [styles.button, disabled && styles.disabled, pressed && !disabled && styles.pressed]}>
    <Text style={styles.text}>{title}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  button: {minWidth: 210, backgroundColor: colors.blue, paddingHorizontal: 30, paddingVertical: 13, borderRadius: 22, borderWidth: 5, borderColor: colors.outline, alignItems: 'center', shadowColor: '#173554', shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.28, shadowRadius: 0, elevation: 6},
  text: {color: colors.white, fontFamily: 'Georgia', fontWeight: '900', fontSize: 24},
  pressed: {transform: [{scale: 0.97}]},
  disabled: {opacity: 0.55},
});
