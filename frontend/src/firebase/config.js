// Firebase Client Configuration for React Frontend
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADeDAm8Q_UL3to35itJX3_t3pmTwYEa6A",
  authDomain: "ai-mock-interview-prep-44855.firebaseapp.com",
  projectId: "ai-mock-interview-prep-44855",
  storageBucket: "ai-mock-interview-prep-44855.firebasestorage.app",
  messagingSenderId: "897185277650",
  appId: "1:897185277650:web:c7255c36237a5993beaf0b",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export default app;
