
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMealPlanStore } from '../store/mealPlanSlice';
import { Colors } from '../constants/colors';
import { DayCard } from '../components/DayCard';
import { BudgetSummary } from '../components/BudgetSummary';
import { IngredientUsageBar } from '../components/IngredientUsageBar';
 

export type FoodCategory = 'meat' | 'fish' | 'vegetable' | 'egg_tofu' | 'seasoning' | 'other';
 
export interface ShoppingItem {
  id: string;
  name: string;
  category: FoodCategory;
  amount: string;
  price: number;
  isChecked: boolean;
}
 
type BaseWeekPlan = NonNullable<ReturnType<typeof useMealPlanStore.getState>['currentWeekPlan']>;
export type ExtendedWeekPlan = BaseWeekPlan & {
  weekStartDate: string;
  totalCost: number;
};
 

type BaseUserSettings = ReturnType<typeof useMealPlanStore.getState>['settings'];
export type ExtendedUserSettings = BaseUserSettings & {
  returnTimeText?: string;
  customPreferenceText?: string;
};
 
const CATEGORY_LABELS: Record<FoodCategory, string> = {
  meat: '肉類',
  fish: '魚介類',
  vegetable: '野菜類',
  egg_tofu: '卵・豆腐',
  seasoning: '調味料',
  other: 'その他',
};
const CATEGORY_ORDER: FoodCategory[] = ['meat', 'fish', 'vegetable', 'egg_tofu', 'seasoning', 'other'];
 

export const SetupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
 
  const settings = useMealPlanStore((state) => state.settings) as ExtendedUserSettings;
  const { updateSettings, generatePlan, isGenerating, error, clearError } = useMealPlanStore();
 
  const [budgetText, setBudgetText] = useState(settings.budget.toString());
  const [calorieText, setCalorieText] = useState(settings.targetCalories?.toString() || '');
 
  const handleGenerate = async () => {
    const budgetNum = parseInt(budgetText.replace(/[^0-9]/g, ''), 10) || 0;
    const calorieNum = parseInt(calorieText.replace(/[^0-9]/g, ''), 10) || 0;
 
    if (budgetNum <= 0) {
      Alert.alert('入力エラー', '正しい予算を入力してください。');
      return;
    }
 
   
    updateSettings({
      budget: budgetNum,
      targetCalories: calorieNum > 0 ? calorieNum : undefined,
    });
 
    await generatePlan();
    if (!useMealPlanStore.getState().error) {
      navigation.navigate('WeekPlan');
    }
  };
 
  if (error) {
    Alert.alert('エラー', error, [{ text: 'OK', onPress: clearError }]);
  }
 
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* 自由入力：予算 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>予算（円）</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="number-pad"
          placeholder="例: 1000"
          value={budgetText}
          onChangeText={setBudgetText}
        />
      </View>
 
      {/* 自由入力：帰宅時間・状況 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>帰宅時間や体調、どんな風に調理</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          multiline
          numberOfLines={2}
          placeholder="例: 20時頃帰宅、 しんどい 簡単に済ませたい など"
          value={settings.returnTimeText || ''}
          onChangeText={(text) => updateSettings({ ['returnTimeText' as any]: text })}
        />
      </View>
 
      {/* 自由入力：除外・アレルギー食材 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>除外したい食材・アレルギー（カンマ区切り）</Text>
        <TextInput
          style={styles.textInput}
          placeholder="例: えび, かに, アボカド"
          value={Array.isArray(settings.allergies) ? settings.allergies.join(', ') : ''}
          onChangeText={(text) => {
            const list = text.split(',').map(s => s.trim()).filter(Boolean);
            updateSettings({ allergies: list });
          }}
        />
      </View>
 
      {/* 自由入力：優先スタイル・こだわり条件 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>こだわり・最優先したいスタイル</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          multiline
          numberOfLines={3}
          placeholder="例: 栄養たっぷり、子供が喜ぶメニュー、残り物で済ませたい"
          value={settings.customPreferenceText || ''}
          onChangeText={(text) => updateSettings({ ['customPreferenceText' as any]: text })}
        />
      </View>
 

{/* 自由入力：冷蔵庫の残り物 */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>
    冷蔵庫の残り物・使いたい食材
  </Text>

  <TextInput
    style={[styles.textInput, styles.textArea]}
    multiline
    numberOfLines={3}
    placeholder="例: 玉ねぎ2個、卵6個、豚こま300g、豆腐1丁"
    value={settings.refrigeratorItems || ''}
    onChangeText={(text) =>
      updateSettings({
        refrigeratorItems: text,
      } as any)
    }
  />
</View>

      {/* 自由入力：目標カロリー */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>1日の目標カロリー（kcal）</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="number-pad"
          placeholder="例:2000"
          value={calorieText}
          onChangeText={setCalorieText}
        />
      </View>
 
      {/* 生成ボタン */}
      <TouchableOpacity
        style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
        onPress={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.generateBtnText}>AIが献立を考えています...</Text>
          </>
        ) : (
          <Text style={styles.generateBtnText}>この条件で献立を自動生成 →</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};
 

export const WeekPlanScreen: React.FC = () => {
  const currentWeekPlan = useMealPlanStore((state) => state.currentWeekPlan) as ExtendedWeekPlan | null;
  const shoppingList = useMealPlanStore((state) => state.shoppingList);
  const budget = useMealPlanStore((state) => state.settings.budget);
 
  // 1. nullチェック（ガード句）で早期リターン
  if (!currentWeekPlan) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyText}>設定タブで条件を入力して献立を生成してください</Text>
      </View>
    );
  }
 
  // 2. ここまで到達した時点で currentWeekPlan は null ではないと確定するため
  // 安全に利用できます
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.weekLabel}>{currentWeekPlan.weekStartDate} 〜 の1週間</Text>
 
      {/* 3. map 関数で一意の key を指定 */}
      {currentWeekPlan.days.map((day: any, index: number) => (
        <DayCard key={`day-${index}`} day={day} />
      ))}
 
      <BudgetSummary
        spent={currentWeekPlan.totalCost}
        budget={budget}
        usageRate={shoppingList?.ingredientUsageRate ?? 0}
      />
    </ScrollView>
  );
};


export const ShoppingListScreen: React.FC = () => {
  const { shoppingList, toggleShoppingItem } = useMealPlanStore();
 
  if (!shoppingList) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>設定タブで献立を生成してください</Text>
      </View>
    );
  }
 
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = shoppingList.items.filter((i) => i.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<FoodCategory, ShoppingItem[]>);
 
  const checkedCount = shoppingList.items.filter((i) => i.isChecked).length;
  const totalCount = shoppingList.items.length;
 
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.summaryRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>合計金額</Text>
          <Text style={[styles.statValue, { color: Colors.primary }]}>¥{shoppingList.totalCost.toLocaleString()}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>品数</Text>
          <Text style={styles.statValue}>{totalCount}点</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>チェック</Text>
          <Text style={[styles.statValue, { color: Colors.primary }]}>{checkedCount}/{totalCount}</Text>
        </View>
      </View>
 
      <IngredientUsageBar label="食材使い切り率" rate={shoppingList.ingredientUsageRate} />
 
      {(Object.entries(grouped) as [FoodCategory, ShoppingItem[]][]).map(([cat, items]) => (
        <View key={cat} style={styles.section}>
          <Text style={styles.sectionTitle}>{CATEGORY_LABELS[cat]}</Text>
          {items.map((item) => (
            <TouchableOpacity key={item.id} style={styles.itemRow} onPress={() => toggleShoppingItem(item.id)} activeOpacity={0.6}>
              <View style={[styles.checkbox, item.isChecked && styles.checkboxChecked]}>
                {item.isChecked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>{item.name}</Text>
              <Text style={styles.itemAmount}>{item.amount}</Text>
              <Text style={styles.itemPrice}>¥{item.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background || '#F8F8F5', padding: 16 },
  card: {
    backgroundColor: Colors.surface || '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border || '#E0E0D8',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary || '#888780',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#F8F8F5',
    borderWidth: 0.5,
    borderColor: Colors.border || '#E0E0D8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  generateBtn: {
    backgroundColor: Colors.primary || '#1D9E75',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  generateBtnDisabled: { backgroundColor: '#9FE1CB' },
  generateBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  weekLabel: { fontSize: 13, color: Colors.textSecondary || '#888780', marginBottom: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 100 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 14, color: Colors.textSecondary || '#888780', textAlign: 'center' },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#F1EFE8', borderRadius: 8, padding: 10 },
  statLabel: { fontSize: 11, color: Colors.textSecondary || '#888780', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '500', color: '#333' },
  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary || '#888780',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border || '#E0E0D8',
    paddingBottom: 6,
    marginBottom: 4,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: Colors.border || '#E0E0D8', gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 0.5, borderColor: Colors.border || '#E0E0D8', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Colors.primary || '#1D9E75', borderColor: Colors.primary || '#1D9E75' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '600' },
  itemName: { flex: 1, fontSize: 14, color: '#333' },
  itemNameChecked: { color: Colors.textSecondary || '#888780', textDecorationLine: 'line-through' },
  itemAmount: { fontSize: 13, color: Colors.textSecondary || '#888780' },
  itemPrice: { fontSize: 13, color: Colors.textSecondary || '#888780', minWidth: 45, textAlign: 'right' },
});
 