import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCyIIKbjpp4HtXd5RP0K5TJVynGPIOcmAw",
  authDomain: "real-estate-51974.firebaseapp.com",
  projectId: "real-estate-51974",
  storageBucket: "real-estate-51974.appspot.com",
  messagingSenderId: "906106972163",
  appId: "1:906106972163:web:10c069c45f688498ca8636",
  measurementId: "G-CGYTYQKBNH"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);