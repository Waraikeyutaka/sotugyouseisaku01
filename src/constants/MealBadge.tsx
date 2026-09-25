import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MealBadge as MealBadgeType } from '../types';
import { Colors } from '../constants/colors';

const BADGE_CONFIG: Record<MealBadgeType, { label: string; bg: string; text: string }> = {
  quick:     { label: '時短',       bg: Colors.quick.bg,     text: Colors.quick.text },
  leftovers: { label: '食材アレンジ', bg: Colors.leftovers.bg, text: Colors.leftovers.text },
  prep:      { label: '作り置き',    bg: Colors.prep.bg,      text: Colors.prep.text },
  full:      { label: 'しっかり',    bg: Colors.full.bg,      text: Colors.full.text },
  normal:    { label: '通常',        bg: Colors.normal.bg,    text: Colors.normal.text },
};

interface Props {
  badge: MealBadgeType;
}

export const MealBadge: React.FC<Props> = ({ badge }) => {
  const config = BADGE_CONFIG[badge];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  text: { fontSize: 11, fontWeight: '500' },
});