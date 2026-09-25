import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
 
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase";



// ==========================================
// 型定義
// ==========================================
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
 
interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
 



const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry, 
  showToggle,
  toggleVisible,
  onToggle,
  keyboardType,
  autoCapitalize,
  isFocused,
  onFocus,
  onBlur,
  hasError,
  errorText,
}: any) => {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, isFocused && styles.inputFocused, hasError && styles.inputError]}>
        <Ionicons name={iconName} size={20} color={isFocused ? '#6C63FF' : hasError ? '#FF4D4D' : '#AAAAAA'} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#CCCCCC"
          secureTextEntry={secureTextEntry && !toggleVisible}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'none'}
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
            <Ionicons name={toggleVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color="#AAAAAA" />
          </TouchableOpacity>
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};



// ==========================================
// アカウント作成画面
// ==========================================
export default function SignUpScreen() {
   const navigation = useNavigation();


  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
 
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
 
  // ==========================================
  // バリデーション
  // ==========================================
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
 
    if (!form.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }
 
    if (!form.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }
 
    if (!form.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (form.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }
 
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'パスワード（確認）を入力してください';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  // アカウント作成処理
  // アカウント作成処理
const handleSignUp = async () => {
  console.log("① ボタンが押されました");

  const ok = validate();
  console.log("② validateの結果:", ok);

  if (!ok) {
    console.log("③ バリデーションで止まりました");
    return;
  }

  setIsLoading(true);

  try {
    console.log("④ Firebaseに登録開始");

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    console.log("⑤ ユーザー作成成功");

    await sendEmailVerification(userCredential.user);

    console.log("⑥ 認証メール送信成功");

    Alert.alert("成功", "認証メールを送信しました！");
  } catch (error: any) {
    console.log("❌ エラー:", error);
    Alert.alert("エラー", error.message);
  } finally {
    setIsLoading(false);
  }
};
 
  // ==========================================
  // Google ログイン
  // ==========================================
  const handleGoogleSignUp = () => {
    // TODO: Google認証を実装する
    // 例: await Google.logInAsync(config);
    Alert.alert('Googleログイン', 'Google認証を実装してください');
  };
 
  // ==========================================
  // 入力フィールドコンポーネント
  // ==========================================


 
  // ==========================================
  // レンダリング
  // ==========================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ロゴ */}
          <View style={styles.logoWrapper}>
            <View style={styles.logoBox}>
              <Ionicons name="sparkles" size={28} color="#FFFFFF" />
            </View>
          </View>
 
          {/* タイトル */}
          <Text style={styles.title}>アカウント作成</Text>
          <Text style={styles.subtitle}>無料でアカウントを作成しましょう</Text>
 
   {/* フォーム */}

<InputField
  label="お名前"
  value={form.name}
  onChangeText={(text: string) =>
    setForm((prev) => ({ ...prev, name: text }))
  }
  placeholder="山田 太郎"
  iconName="person-outline"
  autoCapitalize="words"
  isFocused={focusedField === "name"}
  onFocus={() => setFocusedField("name")}
  onBlur={() => setFocusedField(null)}
  hasError={!!errors.name}
  errorText={errors.name}
/>


<InputField
  label="メールアドレス"
  value={form.email}
  onChangeText={(text: string) =>
    setForm((prev) => ({ ...prev, email: text }))
  }
  placeholder="example@email.com"
  iconName="mail-outline"
  keyboardType="email-address"
  isFocused={focusedField === "email"}
  onFocus={() => setFocusedField("email")}
  onBlur={() => setFocusedField(null)}
  hasError={!!errors.email}
  errorText={errors.email}
/>


<InputField
  label="パスワード"
  value={form.password}
  onChangeText={(text: string) =>
    setForm((prev) => ({ ...prev, password: text }))
  }
  placeholder="8文字以上"
  iconName="lock-closed-outline"
  secureTextEntry
  showToggle
  toggleVisible={showPassword}
  onToggle={() => setShowPassword((v) => !v)}
  isFocused={focusedField === "password"}
  onFocus={() => setFocusedField("password")}
  onBlur={() => setFocusedField(null)}
  hasError={!!errors.password}
  errorText={errors.password}
/>


<InputField
  label="パスワード（確認）"
  value={form.confirmPassword}
  onChangeText={(text: string) =>
    setForm((prev) => ({ ...prev, confirmPassword: text }))
  }
  placeholder="もう一度入力"
  iconName="lock-open-outline"
  secureTextEntry
  showToggle
  toggleVisible={showConfirmPassword}
  onToggle={() => setShowConfirmPassword((v) => !v)}
  isFocused={focusedField === "confirmPassword"}
  onFocus={() => setFocusedField("confirmPassword")}
  onBlur={() => setFocusedField(null)}
  hasError={!!errors.confirmPassword}
  errorText={errors.confirmPassword}
/>




          {/* 作成ボタン */}
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? '作成中...' : 'アカウントを作成する'}
            </Text>
            {!isLoading && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
          </TouchableOpacity>
 
          {/* 区切り線 */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>または</Text>
            <View style={styles.dividerLine} />
          </View>
 
          {/* Googleボタン */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignUp}
            activeOpacity={0.85}
          >
            {/* Google アイコン（SVG不可のためテキストで代用。実際はロゴ画像を使用） */}
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Googleで続ける</Text>
          </TouchableOpacity>
 
          {/* ログインへの導線 */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>すでにアカウントをお持ちですか？</Text>



        <TouchableOpacity
  onPress={() => navigation.navigate('Login' as never)}
>
  
              <Text style={styles.loginLink}>ログイン</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
 
// ==========================================
// スタイル
// ==========================================
const PURPLE = '#6C63FF';
 
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 48,
  },
 
  // ロゴ
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBox: {
    width: 56,
    height: 56,
    backgroundColor: PURPLE,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
 
  // タイトル
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 32,
  },
 
  // 入力フィールド
  fieldWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  inputFocused: {
    borderColor: PURPLE,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: '#FF4D4D',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
  },
  errorText: {
    fontSize: 12,
    color: '#FF4D4D',
    marginTop: 4,
    marginLeft: 4,
  },
 
  // プライマリボタン
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
 
  // 区切り線
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 12,
    color: '#AAAAAA',
  },
 
  // Googleボタン
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 28,
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },
 
  // ログインリンク
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  loginText: {
    fontSize: 13,
    color: '#888888',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },
});