// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDLfDSpwfoZ8kBg_7PP_I75wf7URAKqQog",
  authDomain: "social-4eab3.firebaseapp.com",
  projectId: "social-4eab3",
  storageBucket: "social-4eab3.appspot.com",
  messagingSenderId: "527431262759",
  appId: "1:527431262759:web:7aa764007459ad13372402"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


