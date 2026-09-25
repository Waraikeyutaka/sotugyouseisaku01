import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DayPlan } from '../types'; 
import { MealBadge } from './MealBadge';
import { Colors } from '../constants/colors';

const DOW_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

interface Props {
  day: DayPlan;
  onPress?: () => void;
}

export const DayCard: React.FC<Props> = ({ day, onPress }) => (
  <TouchableOpacity
    style={[styles.card, day.isWeekend && styles.cardWeekend]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.header}>
      <Text style={styles.dayLabel}>{DOW_LABELS[day.dayOfWeek]}</Text>
      <MealBadge badge={day.badge} />
     
     {typeof day.dinner.cookingTime === 'number' && day.dinner.cookingTime > 0 && (
  <Text style={styles.cookingTime}>{day.dinner.cookingTime}分</Text>
)}
      <Text style={styles.cost}>¥{day.totalCost}</Text>
    </View>
    <Text style={styles.mealName}>{day.dinner.name}</Text>
   {typeof day.dinner.subTitle === 'string' && day.dinner.subTitle.length > 0 && (
  <Text style={styles.mealSub}>{day.dinner.subTitle}</Text>
)}

    {typeof day.dinner.isBentoReusable === 'boolean' && day.dinner.isBentoReusable === true && (
      <View style={styles.bentoBadge}>
        <Text style={styles.bentoBadgeText}>翌日弁当に転用可</Text>
      </View>
    )}
    <Text style={styles.calories}>{day.totalCalories}kcal</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  cardWeekend: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    width: 20,
  },
  cookingTime: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  cost: {
    marginLeft: 'auto',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  mealSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bentoBadge: {
    marginTop: 6,
    backgroundColor: '#E6F1FB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bentoBadgeText: {
    fontSize: 11,
    color: '#185FA5',
  },
  calories: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'right',
  },
});









