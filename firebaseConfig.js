// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB9jhsKbeulwaOi5hgF14MM71qHcinmsxc",
  authDomain: "tonavez-ccf1f.firebaseapp.com",
  projectId: "tonavez-ccf1f",
  storageBucket: "tonavez-ccf1f.firebasestorage.app",
  messagingSenderId: "80735813290",
  appId: "1:80735813290:web:776aa6af7c68375e4e5ad3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
