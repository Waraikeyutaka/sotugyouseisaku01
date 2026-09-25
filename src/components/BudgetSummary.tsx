import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  spent: number;
  budget: number;
  usageRate: number;
}

export const BudgetSummary: React.FC<Props> = ({ spent, budget, usageRate }) => {
  const remaining = budget - spent;
  const overBudget = remaining < 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>今週の合計</Text>
        <Text style={[styles.value, overBudget && styles.over]}>
          ¥{spent.toLocaleString()} / ¥{budget.toLocaleString()}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>食材使い切り率</Text>
        <Text style={styles.valueGreen}>{usageRate}%</Text>
      </View>
      {!overBudget && (
        <Text style={styles.saving}>節約額: ¥{remaining.toLocaleString()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1EFE8',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    gap: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 13, color: Colors.textSecondary },
  value: { fontSize: 14, fontWeight: '500', color: Colors.text },
  valueGreen: { fontSize: 14, fontWeight: '500', color: Colors.primary },
  over: { color: Colors.error },
  saving: { fontSize: 12, color: Colors.primary, marginTop: 4 },
});