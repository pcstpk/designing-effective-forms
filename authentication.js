// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration




// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const userSignIn = async () => {
    signInWithPopup(auth,
        provider).then((result) => {
            const user = result.user;

            const displayName = user.displayName || "";
            const email = user.email || "";

            const [firstName, ...lastNameParts] = displayName.split(" ");
            const lastName = lastNameParts.join(" ");

            document.getElementById("firstName").value = firstName || "";
            document.getElementById("lastName").value = lastName || "";
            document.getElementById("exampleInputEmail1").value = email || "";
            console.log(user);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
}

const userSignOut = async () => {
    signOut(auth).then(() => {
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("exampleInputEmail1").value = "";
        alert("You have been signed out!")
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        alert("You are authenticated with Google");
        console.log(user);
    }
})

signInButton.addEventListener("click",
    userSignIn);
signOutButton.addEventListener("click",
    userSignOut); 
