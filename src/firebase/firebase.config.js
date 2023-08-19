
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket ,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    
    // apiKey: "AIzaSyAuT-XitIOAHsJgSB5pV3gXhIJ9iBgbNOI",
    // authDomain: "job-box-redux-all.firebaseapp.com",
    // projectId: "job-box-redux-all",
    // storageBucket: "job-box-redux-all.appspot.com",
    // messagingSenderId: "17160205648",
    // appId: "1:17160205648:web:3737493e2dcd0371456855"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export default auth;