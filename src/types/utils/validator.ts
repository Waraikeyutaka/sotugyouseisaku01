
import { UserSettings } from '../../types/index';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUserSettings(settings: any): ValidationResult {
  if (!settings) return { valid: false, error: 'リクエストボディが空です' };

  if (typeof settings.budget !== 'number' || settings.budget < 1000 || settings.budget > 50000) {
    return { valid: false, error: '予算は1,000〜50,000円の範囲で指定してください' };
  }

  if (
    typeof settings.targetCalories !== 'number' ||
    settings.targetCalories < 1200 ||
    settings.targetCalories > 3500
  ) {
    return { valid: false, error: 'カロリーは1,200〜3,500の範囲で指定してください' };
  }

  if (!['early', 'normal', 'late'].includes(settings.returnTime)) {
    return { valid: false, error: 'returnTime が不正な値です' };
  }

  if (!Array.isArray(settings.allergies)) {
    return { valid: false, error: 'allergies は配列で指定してください' };
  }

  return { valid: true };
}