// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0iKjyJ1KlKBeZMbgngXViqS0A2Qgi1wI",
  authDomain: "table-demmo.firebaseapp.com",
  databaseURL: "https://table-demmo-default-rtdb.firebaseio.com",
  projectId: "table-demmo",
  storageBucket: "table-demmo.appspot.com",
  messagingSenderId: "53554219454",
  appId: "1:53554219454:web:a867faf5d07a2e8cf0d1ef",
  measurementId: "G-3P84HXXNP8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;