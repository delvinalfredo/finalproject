import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_mVQ_vIrUG0G1mxeKSvKv7EjOVi-FmQY",
  authDomain: "final-project-1fd5c.firebaseapp.com",
  projectId: "final-project-1fd5c",
  storageBucket: "final-project-1fd5c.appspot.com",
  messagingSenderId: "628875538695",
  appId: "1:628875538695:web:1308307ec95659cc0515a2"
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
export { db };
