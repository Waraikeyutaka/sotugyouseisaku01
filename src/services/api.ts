import { UserSettings, WeekPlan, ShoppingList } from '../types';
import { v4 as uuidv4 } from 'uuid';

/*  const GEMINI_API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ---------------------------
// Prompt
// ---------------------------

// 14行目から以下のように書き換えてください
function buildPrompt(settings: UserSettings): string {
  return `
あなたは献立作成AIです。JSON形式のみを出力してください。
余計な解説や思考プロセスは一切不要です。

【制約事項】
- JSONが途切れないよう、各メニューは簡潔に記載すること。
- 出力は必ず { から } までを完結させること。

予算: ${settings.budget}円
目標カロリー: ${settings.targetCalories ?? '指定なし'}
アレルギー: ${settings.allergies?.join(', ') || 'なし'}

形式:
{
  "days": [
    {
      "day": "月曜日",
      "dinner": "メニュー名",
      "totalCost": 500,
      "totalCalories": 700
    }
  ],
  "shoppingItems": [
    {
      "name": "食材名",
      "category": "野菜",
      "amount": "1個",
      "price": 100,
      "usageRate": 100
    }
  ]
}
`;
}


async function callGemini(prompt: string): Promise<string> {
  console.log('Gemini送信開始');

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 30000,
      },
    }),
  });

  const data = await response.json();

  console.log(
  'Gemini Response:',
  JSON.stringify(data, null, 2)
);


console.log('Status:', response.status);
console.log('StatusText:', response.statusText);



  if (!response.ok) {
    throw new Error(
      data?.error?.message ??
      `Gemini API Error ${response.status}`
    );
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  console.log('Gemini Text:', text);

  return text;
}

// ---------------------------
// JSON抽出
// ---------------------------

function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {}

  const jsonBlock = text.match(
    /```(?:json)?\s*([\s\S]*?)\s*```/
  );

  if (jsonBlock?.[1]) {
    return JSON.parse(jsonBlock[1]);
  }

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return JSON.parse(
      text.substring(firstBrace, lastBrace + 1)
    );
  }

  throw new Error(
    'Geminiの応答からJSONを抽出できませんでした'
  );
}

// ---------------------------
// API
// ---------------------------

export const mealPlanApi = {
  generateMealPlan: async (
    settings: UserSettings
  ): Promise<{
    weekPlan: WeekPlan;
    shoppingList: ShoppingList;
  }> => {
    console.log('献立生成開始');

    // ★重要: ここで aiData を宣言しておくことで、ループの外側でも使えるようになります
    let aiData: any = null; 
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      const prompt = buildPrompt(settings);
      const text = await callGemini(prompt);
      aiData = extractJSON(text); // ここで代入

      if (!Array.isArray(aiData?.days)) {
        continue;
      }

      const totalCost = aiData.days.reduce(
        (sum: number, day: any) => sum + (day.totalCost ?? 500),
        0
      );

      if (totalCost <= settings.budget) {
        break; // 予算内ならループを抜ける
      }
    }

    // ★もし aiData が空のままループを抜けてしまった場合の安全策
    if (!aiData || !Array.isArray(aiData.days)) {
      throw new Error('献立の生成に失敗しました。');
    }

    // ここでやっと normalizedDays を宣言する（再宣言エラーは起きません）
    const normalizedDays = aiData.days.map((day: any, index: number) => ({
      dayOfWeek: index + 1,
      isWeekend: index >= 5,
      badge: 'normal' as const,
      dinner: {
        name: day.dinner ?? '献立未設定',
        subTitle: '',
        cookingTime: 15,
        isBentoReusable: false,
      },
      totalCost: day.totalCost ?? 500,
      totalCalories: day.totalCalories ?? 0,
    }));

    const shoppingItems = Array.isArray(aiData.shoppingItems) ? aiData.shoppingItems : [];
    const weekPlanId = uuidv4();
    const finalTotalCost = normalizedDays.reduce((sum: number, day: any) => sum + (day.totalCost ?? 0), 0);

    const avgUsage = shoppingItems.length > 0
      ? Math.round(shoppingItems.reduce((sum: number, item: any) => sum + (item.usageRate ?? 100), 0) / shoppingItems.length)
      : 100;

    const weekPlan: WeekPlan = {
      id: weekPlanId,
      userId: 'local',
      weekStartDate: getNextMonday(),
      days: normalizedDays,
      totalCost: finalTotalCost,
      createdAt: new Date().toISOString(),
    };

    const shoppingList: ShoppingList = {
      weekPlanId,
      items: shoppingItems.map((item: any) => ({
        id: uuidv4(),
        name: item.name ?? '',
        category: item.category ?? 'other',
        amount: item.amount ?? '',
        price: item.price ?? 0,
        isChecked: false,
      })),
      totalCost: shoppingItems.reduce((sum: number, item: any) => sum + (item.price ?? 0), 0),
      ingredientUsageRate: avgUsage,
    };

    return { weekPlan, shoppingList };
  },
};
// ---------------------------
// Utility
// ---------------------------

function getNextMonday(): string {
  const today = new Date();
  const day = today.getDay();

  const diff =
    day === 1 ? 7 : (8 - day) % 7 || 7;

  const monday = new Date(today);

  monday.setDate(today.getDate() + diff);

  return monday.toISOString().split('T')[0];
}
 */





//ここから新規
// ============================================================
// Firebase Functions経由の献立生成
// ============================================================

const API_URL =
  'http://127.0.0.1:5001/demo-no-project/us-central1';

export const mealPlanApi = {
  generateMealPlan: async (
    settings: UserSettings
  ): Promise<{
    weekPlan: WeekPlan;
    shoppingList: ShoppingList;
  }> => {
    console.log(
      'Firebase Functionsへ献立生成リクエスト'
    );

    const response = await fetch(
      `${API_URL}/generateMealPlanFunction`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          // 現在は仮のユーザーID
          'x-user-id': 'local',
        },

        body: JSON.stringify(settings),
      }
    );

    const data = await response.json();

    console.log(
      'Firebase Functions Response:',
      data
    );

    if (!response.ok) {
      throw new Error(
        data?.error ??
          '献立の生成に失敗しました'
      );
    }

    return {
      weekPlan: data.weekPlan,
      shoppingList: data.shoppingList,
    };
  },
};


