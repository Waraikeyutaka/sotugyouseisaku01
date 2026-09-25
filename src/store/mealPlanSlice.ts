import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings, WeekPlan, ShoppingList } from '../types';
import { mealPlanApi } from '../services/api';

interface MealPlanState {
  settings: UserSettings;
  currentWeekPlan: WeekPlan | null;
  shoppingList: ShoppingList | null;
  isGenerating: boolean;
  error: string | null;

  updateSettings: (partial: Partial<UserSettings>) => void;
  generatePlan: () => Promise<void>;
  toggleShoppingItem: (itemId: string) => void;
  clearError: () => void;
  reset: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  budget: 5000,
  targetCalories: 2000,
  returnTime: 'normal',
  allergies: [],
  preferences: ['quick', 'cheap'],
};

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      currentWeekPlan: null,
      shoppingList: null,
      isGenerating: false,
      error: null,

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      generatePlan: async () => {
        set({ isGenerating: true, error: null });
        try {
          // Gemini API を直接呼び出す
          const result = await mealPlanApi.generateMealPlan(get().settings);
          set({
            currentWeekPlan: result.weekPlan,
            shoppingList: result.shoppingList,
          });
        } catch (e: any) {
          // エラーメッセージをわかりやすく整形
          let msg = e?.message ?? '献立の生成に失敗しました';
          if (msg.includes('API_KEY_INVALID')) {
            msg = 'APIキーが無効です。.envファイルを確認してください。';
          } else if (msg.includes('QUOTA_EXCEEDED')) {
            msg = 'APIの利用上限に達しました。しばらく待ってから試してください。';
          }
          set({ error: msg });
        } finally {
          set({ isGenerating: false });
        }
      },

      toggleShoppingItem: (itemId) =>
        set((state) => {
          if (!state.shoppingList) return state;
          return {
            shoppingList: {
              ...state.shoppingList,
              items: state.shoppingList.items.map((item) =>
                item.id === itemId
                  ? { ...item, isChecked: !item.isChecked }
                  : item
              ),
            },
          };
        }),

      clearError: () => set({ error: null }),

      reset: () =>
        set({ currentWeekPlan: null, shoppingList: null, error: null }),
    }),
    {
      name: 'meal-plan-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // 設定だけ永続化
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);