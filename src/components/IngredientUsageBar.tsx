import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  label: string;
  rate: number; // 0〜100
}

export const IngredientUsageBar: React.FC<Props> = ({ label, rate }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${rate}%` }]} />
    </View>
    <Text style={styles.rate}>{rate}%</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { marginTop: 6 },
  label: { fontSize: 11, color: Colors.textSecondary, marginBottom: 3 },
  track: {
    height: 4,
    backgroundColor: '#E0E0D8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  rate: { fontSize: 10, color: Colors.primary, marginTop: 2, textAlign: 'right' },
});