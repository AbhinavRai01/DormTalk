// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-d_3Xev-80EbWGdf62IDaE9bld25d-xU",
  authDomain: "forumapp-fead5.firebaseapp.com",
  projectId: "forumapp-fead5",
  storageBucket: "forumapp-fead5.firebasestorage.app",
  messagingSenderId: "280638649513",
  appId: "1:280638649513:web:e493842145b96ef8e265b8",
  measurementId: "G-GQM0HCLJ5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);