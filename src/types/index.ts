export type MealBadge = 'quick' | 'leftovers' | 'prep' | 'full' | 'normal';

// dinner オブジェクトの型定義
export interface Meal {
  name: string;
  subTitle?: string;
  cookingTime?: number;
  isBentoReusable: boolean;
}

// DayPlan を export する
export interface DayPlan {
  dayOfWeek: number; // 0-6
  isWeekend: boolean;
  badge: MealBadge;
  dinner: Meal;
  totalCost: number;
  totalCalories: number;
}

// カテゴリの型定義
export type FoodCategory = 'meat' | 'fish' | 'vegetable' | 'egg_tofu' | 'seasoning' | 'other';

// 買い物リストの個別アイテムの型定義
export interface ShoppingItem {
  id: string;
  name: string;
  category: FoodCategory;
  amount: string;     // 例: "200g", "1パック"
  price: number;      // 例: 350
  isChecked: boolean;
}

// 買い物リスト全体の型定義
export interface ShoppingList {
  weekPlanId: string;
  items: ShoppingItem[];
  totalCost: number;
  ingredientUsageRate: number; 
}


// ====== 以下がエラーを解消するために修正・追加した部分です ======

// 1. SetupScreen で使われている Preference 型を追加
export type Preference = 'quick' | 'cheap' | 'nutrition' | 'bento' | 'prep';

// 💡 【ここを追加・変更しました！】
// オンボーディング画面でインポートできるように、単体で型を定義して公開します
export type ReturnTime = 'early' | 'normal' | 'late';

export interface UserSettings {
  budget: number;
  targetCalories: number;
  returnTime: ReturnTime;
  allergies: string[];
  preferences: Preference[];

  // SetupScreen自由入力
  returnTimeText?: string;
  customPreferenceText?: string;
  refrigeratorItems?: string;
}


// 1週間分の献立をまとめる型定義
export interface WeekPlan {
  weekStartDate: string; // これを追加
  totalCost: number;     // これを追
  
  id: string;             // 過去の献立一覧（getWeekPlans）や買い物リスト取得で識別するために必要
  userId: string;         // ユーザーID
  createdAt: string;      // 生成日時（2026-05-22T10:00:00Z など一覧表示のソート等に便利）
  days: DayPlan[];        // 1日ごとの献立（DayPlan）の配列（通常は7日分）
}