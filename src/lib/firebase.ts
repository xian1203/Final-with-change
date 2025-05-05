import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set, remove, update } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCtiW5S4Xryu7_4YZzS18Wwc1Se8gyoskE",
  authDomain: "shoping-website-f1cda.firebaseapp.com",
  databaseURL: "https://shoping-website-f1cda-default-rtdb.firebaseio.com",
  projectId: "shoping-website-f1cda",
  storageBucket: "shoping-website-f1cda.firebasestorage.app",
  messagingSenderId: "114910210422",
  appId: "1:114910210422:web:cee229eff437efc6833257",
  measurementId: "G-EYXDNZS8BK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const analytics = getAnalytics(app);

// Initialize admin accounts
const initializeAdminAccounts = async () => {
  const adminAccounts = [
    { email: 'roger@gmail.com', password: 'roger123' },
    { email: 'sival@gmail.com', password: 'val123' }
  ];

  for (const admin of adminAccounts) {
    try {
      // Try to create the account first
      console.log(`Attempting to create admin account for ${admin.email}...`);
      await createUserWithEmailAndPassword(auth, admin.email, admin.password);
      console.log(`Admin account created successfully for ${admin.email}`);
    } catch (createError: any) {
      if (createError.code === 'auth/email-already-in-use') {
        console.log(`Admin account already exists for ${admin.email}`);
      } else {
        console.error(`Error creating admin account for ${admin.email}:`, createError);
      }
    }
  }
};

// Initialize Firebase and admin accounts with a delay
console.log('Firebase initialized with real-time database');
setTimeout(() => {
  initializeAdminAccounts().catch(error => {
    console.error('Final error in admin accounts setup:', error);
  });
}, 3000);

// Product management functions
export const addProduct = async (product: any) => {
  const productRef = ref(rtdb, `products/${product.id}`);
  await set(productRef, product);
};

export const deleteProduct = async (productId: number) => {
  const productRef = ref(rtdb, `products/${productId}`);
  await remove(productRef);
};

export const updateProduct = async (productId: number, updates: any) => {
  const productRef = ref(rtdb, `products/${productId}`);
  await update(productRef, updates);
};

export const isAdmin = async (uid: string) => {
  try {
    const response = await fetch(`/api/check-admin?uid=${uid}`);
    const data = await response.json();
    return data.isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};