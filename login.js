import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

import app from './firebaseApp.js'

const auth = getAuth(app);

const signInBtn = document.getElementById("submitLogin");

if (signInBtn === null) {
  console.log("No Sign in Button");
} else {
  let accessToken = sessionStorage.getItem("noobflow-access-token");

  if (accessToken !== null) {
    window.location.replace("https://tubeflow.webflow.io/app/dashboard");
  }

  console.log("Sign in Button Found");
  signInBtn.addEventListener("click", () => {
    const email = document.getElementById("inputEmail");
    console.log(email)
    const password = document.getElementById("inputPassword");
    if (!email || !password) {
      console.log("Can't find email and password fields")
      return;
    }
    const loginEmail = email.value;
    const loginpassword = password.value;
    if (loginEmail === "" || loginpassword === "") {
      console.log("Do not leave fields blank")
      return;
    }
    console.log(loginEmail)
    console.log(loginpassword)
    signInWithEmailAndPassword(auth, loginEmail, loginpassword)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const accessToken = user.accessToken;
        console.log(user);
        sessionStorage.setItem("noobflow-access-token", accessToken);

        window.location.replace("https://tubeflow.webflow.io/app/dashboard");

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  });
}