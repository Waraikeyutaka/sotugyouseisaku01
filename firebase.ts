import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Firebase Consoleから取得した設定を入れる
const firebaseConfig = {
  apiKey: "AIzaSyD1iL2xKhT8cSd-dC2yosnzGuknBCjWJkw",
  authDomain: "graduation-work-72ab3.firebaseapp.com",
  projectId: "graduation-work-72ab3",
  appId: "1:551983013091:web:f4e5f233814de2089939d6",
};

const app = initializeApp(firebaseConfig);

// 認証機能
export const auth = getAuth(app);