// Import the functions you need from the SDKs you need:
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlmEfa6g_InzR4sKdEpwfGkAvUwiNECAk",
  authDomain: "cps630-project-854e4.firebaseapp.com",
  projectId: "cps630-project-854e4",
  storageBucket: "cps630-project-854e4.appspot.com",
  messagingSenderId: "834028188376",
  appId: "1:834028188376:web:0b06b3106f9ac85daf9dad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app);