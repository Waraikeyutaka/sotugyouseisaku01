export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:7071';

export const API_ENDPOINTS = {
  generateMealPlan: '/api/generate-meal-plan',
  weekPlans: (userId: string) => `/api/week-plans/${userId}`,
  shoppingList: (weekPlanId: string) => `/api/shopping-list/${weekPlanId}`,
  updateShoppingItem: (weekPlanId: string, itemId: string) =>
    `/api/shopping-list/${weekPlanId}/items/${itemId}`,
  userSettings: (userId: string) => `/api/users/${userId}/settings`,
};