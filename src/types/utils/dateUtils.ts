// 次の月曜日の日付を YYYY-MM-DD で返す
export function getNextMonday(): string {
  const today = new Date();
  const day = today.getDay(); // 0=日, 1=月...
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7 || 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() + daysUntilMonday);
  return monday.toISOString().split('T')[0];
}

// 月曜日から7日分の日付配列を生成
export function generateWeekDates(mondayStr: string): string[] {
  const monday = new Date(mondayStr);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

// 食材使い切り率の平均を計算
export function calcAverageUsageRate(items: { usageRate: number }[]): number {
  if (items.length === 0) return 0;
  const avg = items.reduce((sum, i) => sum + i.usageRate, 0) / items.length;
  return Math.round(avg);
}