import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

console.log('Gemini API Key:', apiKey ? '取得成功' : '取得失敗');

if (!apiKey) {
  throw new Error(
    'EXPO_PUBLIC_GEMINI_API_KEY が読み込めていません。.env を確認してください。'
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});

export const generateMealPlanFromAI = async (settings: any) => {
  const prompt = `
あなたは家庭向け献立AIです。

以下の条件から1週間の献立を作成してください。

条件:
- 予算: ${settings.budget}円
- 目標カロリー: ${settings.targetCalories || '指定なし'}
- アレルギー: ${settings.allergies?.join(', ') || 'なし'}
- 帰宅条件: ${settings.returnTimeText || 'なし'}
- 希望: ${settings.customPreferenceText || 'なし'}

出力は純粋なJSONのみとしてください。
`;

  try {
    console.log('Geminiへリクエスト送信');

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log('Gemini応答:', text);

    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);

  } catch (error: any) {

    console.error('Gemini Error:', error);

    if (error?.message) {
      console.error('Message:', error.message);
    }

    if (error?.stack) {
      console.error('Stack:', error.stack);
    }

    throw new Error(
      `献立生成に失敗しました: ${error?.message ?? '不明なエラー'}`
    );
  }
};