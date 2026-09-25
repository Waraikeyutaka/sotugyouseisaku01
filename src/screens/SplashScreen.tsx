import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';

import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";

import { auth } from "../../firebase";


import { useNavigation } from '@react-navigation/native';
export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F6E56" />
      <View style={styles.main}>
        <View style={styles.logoMark}>
          <View style={styles.logoInner}>
            <View style={styles.fork} />
          </View>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.appName}>自動献立</Text>
          <Text style={styles.appSub}>
            一人暮らしの食生活を、{'\n'}週1回の買い物で解決する
          </Text>
        </View>
        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featRow}>
              <View style={styles.featIcon}>
                <View style={styles.featDot} />
              </View>
              <View style={styles.featTextBlock}>
                {/* 💡 Webでの誤翻訳を防ぐため translate="no" を追加 */}
                <Text 
                  style={styles.featTitle} 
                  {...({ translate: 'no' } as any)}
                >
                  {f.title}
                </Text>
                <Text style={styles.featDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.btnMain}
          onPress={() => navigation.navigate('Main', { screen: 'Onboarding' })} 
          activeOpacity={0.85}
        >
          <Text style={styles.btnMainText}>はじめる</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSub}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.btnSubText}>アカウントをお持ちではない方</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const FEATURES = [
  { title: 'ぱぱっと終わる',     desc: '献立から買い物リストを自動生成' },
  { title: '食材を使い切る設計', desc: '食材ロス率を99%以上削減' },
  { title: '弁当アレンジ対応',   desc: '夜の料理を翌日のお弁当に転用' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F6E56',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoMark: {
    width: 72,
    height: 72,
    backgroundColor: '#1D9E75',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoInner: {
    width: 44,
    height: 44,
    backgroundColor: '#E1F5EE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fork: {
    width: 6,
    height: 26,
    backgroundColor: '#0F6E56',
    borderRadius: 3,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: '500',
    color: '#E1F5EE',
    letterSpacing: 1,
    marginBottom: 8,
  },
  appSub: {
    fontSize: 14,
    color: '#5DCAA5',
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    width: '100%',
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(29,158,117,0.25)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  featIcon: {
    width: 34,
    height: 34,
    backgroundColor: '#1D9E75',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: 12,
  },
  featDot: {
    width: 10,
    height: 10,
    backgroundColor: '#E1F5EE',
    borderRadius: 5,
  },
  featTextBlock: {
    flex: 1,
  },
  featTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E1F5EE',
    marginBottom: 2,
  },
  featDesc: {
    fontSize: 12,
    color: '#9FE1CB',
  },
  bottom: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: '#085041',
  },
  btnMain: {
    backgroundColor: '#1D9E75',
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnMainText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E1F5EE',
  },
  btnSub: {
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#1D9E75',
    padding: 13,
    alignItems: 'center',
  },
  btnSubText: {
    fontSize: 14,
    color: '#5DCAA5',
  },
});