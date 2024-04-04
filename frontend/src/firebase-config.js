import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlmEfa6g_InzR4sKdEpwfGkAvUwiNECAk",
  authDomain: "cps630-project-854e4.firebaseapp.com",
  projectId: "cps630-project-854e4",
  storageBucket: "cps630-project-854e4.appspot.com",
  messagingSenderId: "834028188376",
  appId: "1:834028188376:web:0b06b3106f9ac85daf9dad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app);
export const auth = getAuth(app);