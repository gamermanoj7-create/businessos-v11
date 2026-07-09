// =====================================
// BUSINESSOS V11
// Firebase Configuration
// =====================================

const firebaseConfig = {
  apiKey: "AIzaSyBRvGZwJP_34mOt-BbALCo75TTmWMGaygM",
  authDomain: "businessos-v11.firebaseapp.com",
  projectId: "businessos-v11",
  storageBucket: "businessos-v11.firebasestorage.app",
  messagingSenderId: "872639206320",
  appId: "1:872639206320:web:7a1e95953adb6bd3adbc75",
  measurementId: "G-EEVHRT642F"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();

let storage = null;

// Initialize Storage (if loaded)
if (firebase.storage) {
    storage = firebase.storage();
}

console.log("✅ BusinessOS V11 Firebase Connected");