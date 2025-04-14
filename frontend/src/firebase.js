import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBillH69MnFOHHYypc94dgUAkxieeggvbM",
  authDomain: "number-ninja-game.firebaseapp.com",
  projectId: "number-ninja-game",
  storageBucket: "number-ninja-game.firebasestorage.app",
  messagingSenderId: "865633869119",
  appId: "1:865633869119:web:05a78b2779948fb7f0078a",
  measurementId: "G-6KXVXBHEGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;
