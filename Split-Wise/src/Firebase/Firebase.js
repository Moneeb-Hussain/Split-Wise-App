import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB9lbhUCSpicUS_vPkxEDjdT_Ok6KrBca0",
  authDomain: "split-wise-project.firebaseapp.com",
  projectId: "split-wise-project",
  storageBucket: "split-wise-project.appspot.com",
  messagingSenderId: "377073654521",
  appId: "1:377073654521:web:efa9dd99d73729c9ae6028",
  measurementId: "G-5FKJY4W6JJ",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export { app, auth };
