import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

let firebaseConfig = {
  apiKey: "AIzaSyDMZx7QIpGF6uPAp2wKf7w2nODeUWbhgqQ",
  authDomain: "mobile-rita.firebaseapp.com",
  databaseURL: "https://mobile-rita-default-rtdb.firebaseio.com",
  projectId: "mobile-rita",
  storageBucket: "mobile-rita.appspot.com",
  messagingSenderId: "702652911362",
  appId: "1:702652911362:web:4cf86327911ab8ddd4bc1b",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
