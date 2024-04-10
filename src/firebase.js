import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBDog8wk328bWEvnn6STiW8p0q4xBVjZPw",
  authDomain: "crud-img-2ccb2.firebaseapp.com",
  projectId: "crud-img-2ccb2",
  storageBucket: "crud-img-2ccb2.appspot.com",
  messagingSenderId: "670048464305",
  appId: "1:670048464305:web:f5348c8a3d68a54512a190"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);

export const storage = getStorage(app);