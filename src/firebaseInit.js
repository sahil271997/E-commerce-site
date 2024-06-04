// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBeNWO5y022Ah1LuhTwkzRyw0RfZAmFao",
    authDomain: "buy-busy-8830d.firebaseapp.com",
    projectId: "buy-busy-8830d",
    storageBucket: "buy-busy-8830d.appspot.com",
    messagingSenderId: "187419166069",
    appId: "1:187419166069:web:86830df056a21b822bbf3c"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export default db;
export { app, auth };