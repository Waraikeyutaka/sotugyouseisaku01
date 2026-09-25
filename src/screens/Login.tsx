import React, { useState } from 'react';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';


import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,

  
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoginPage() {
  const navigation = useNavigation();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
  setError('');
  setSuccess(false);

  if (!email || !password) {
    setError('メールアドレスとパスワードを入力してください');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // メール認証状態を最新化
    await user.reload();

    if (!user.emailVerified) {
      setError(
        'メール認証が完了していません。認証メールを確認してください。'
      );
      return;
    }

    setSuccess(true);

    console.log("ログイン成功:", user.email);

// メイン画面へ移動
navigation.navigate('Main' as never);

  } catch (error: any) {

    console.log(error);

    if (error.code === "auth/invalid-credential") {
      setError(
        'メールアドレスまたはパスワードが間違っています'
      );
    } else {
      setError(error.message);
    }
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* ロゴ部分 */}
        <View style={styles.logoContainer}>
          <View style={styles.iconBox}>
            <Text style={{ fontSize: 32 }}>🍱</Text>
          </View>
          <Text style={styles.title}>めし</Text>
          <Text style={styles.subtitle}>一人暮らしの献立をかんたんに</Text>
        </View>

        {/* フォーム */}
        <View style={styles.form}>
          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>パスワード</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>パスワードをお忘れですか？</Text>
          </TouchableOpacity>

          {/* メッセージ */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>ログインしました！</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>ログイン</Text>
          </TouchableOpacity>
        </View>
        

        {/* 新規登録 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>アカウントをお持ちでない方は </Text>



      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp' as never)}
      >
        <Text style={styles.linkText}>新規登録</Text>
      </TouchableOpacity>
                
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  iconBox: { width: 56, height: 56, backgroundColor: '#DCFCE7', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '500', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  form: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  label: { fontSize: 14, fontWeight: '500', color: '#4B5563', marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, marginBottom: 16, fontSize: 14 },
  forgotPassword: { alignItems: 'flex-end', marginBottom: 16 },
  forgotPasswordText: { fontSize: 12, color: '#15803D' },
  loginButton: { height: 44, backgroundColor: '#15803D', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  loginButtonText: { color: '#F0FDF4', fontSize: 14, fontWeight: '500' },
  errorText: { color: '#DC2626', fontSize: 12, marginBottom: 10, backgroundColor: '#FEF2F2', padding: 8, borderRadius: 8 },
  successText: { color: '#15803D', fontSize: 12, marginBottom: 10, backgroundColor: '#F0FDF4', padding: 8, borderRadius: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: '#6B7280' },
  linkText: { fontSize: 14, color: '#15803D', fontWeight: '600' },
});