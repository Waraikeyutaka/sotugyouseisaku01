import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';


import RegistrationScreen from '../screens/RegistrationScreen';
import LoginPage from '../screens/Login';
import { SplashScreen } from '../screens/SplashScreen'; 
import { SetupScreen, WeekPlanScreen, ShoppingListScreen } from '../screens/MealPlanScreens'; // 👈 ここを修正
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TAB_ICONS: Record<string, string> = {
  Shopping: '🛒',
  Setup: '⚙️',
  WeekPlan: '📅',
};


const MainTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Shopping" 
    screenOptions={({ route }) => ({
      tabBarIcon: () => <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      tabBarStyle: { borderTopColor: Colors.border, borderTopWidth: 0.5 },
      headerStyle: { backgroundColor: Colors.surface, shadowColor: 'transparent' },
      headerTitleStyle: { color: Colors.text, fontSize: 16, fontWeight: '600' },
    })}
  >
    {/*  まとめた画面をタブに配置 */}
    <Tab.Screen name="Shopping" component={ShoppingListScreen} options={{ title: '買い物リスト', tabBarLabel: '買い物' }} />
    <Tab.Screen name="Setup" component={SetupScreen} options={{ title: '設定', tabBarLabel: '設定' }} />
    <Tab.Screen name="WeekPlan" component={WeekPlanScreen} options={{ title: '週献立', tabBarLabel: '週献立' }} />
  </Tab.Navigator>
);

// アプリ全体のナビゲーター
export const AppNavigator: React.FC = () => (
  <Stack.Navigator 
    initialRouteName="Splash" // 1. 最初に画面を表示
    screenOptions={{ headerShown: false }}
  >
    {/* ① 最初に表示される画面 */}
    <Stack.Screen name="Splash" component={SplashScreen} />
    


     <Stack.Screen name="Login" component={LoginPage} />

<Stack.Screen name="SignUp" component={RegistrationScreen}/>

    {/* ② メインの画面一式（この中にタブが入っています） */}
    <Stack.Screen name="Main" component={MainTabNavigator} />
  </Stack.Navigator>
);