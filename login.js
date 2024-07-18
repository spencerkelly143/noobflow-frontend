import { getAuth, signInWithEmailAndPassword, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import app from './firebaseApp.js'
import uri from './functions/uri.js';

const auth = getAuth(app);

const signInBtn = document.getElementById("submitLogin");

const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider()
const modal = document.getElementById('sign-in-modal');
const modalCopy = modal.cloneNode(true);
const modalParent = modal.parentNode;
modal.parentNode.removeChild(modal);

if (signInBtn === null) {
  console.log("No Sign in Button");
} else {
  let accessToken = sessionStorage.getItem("noobflow-access-token");

  if (accessToken !== null) {
    window.location.replace("https://tubeflow.webflow.io/app/dashboard");
  }
  
  if(auth.currentUser !== null){
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
      displayError(modalParent,modalCopy,"Do not leave fields blank")
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
        console.log(error.code)
        console.log(error.message)
        decodeFirebaseError(modalParent,modalCopy,error.code)
        console.log(errorCode, errorMessage);
      });
  });
}

const facebookSignInbtn = document.getElementById('facebook-sign-in')
const googleSignInbtn = document.getElementById('google-sign-in')

facebookSignInbtn.addEventListener('click', () =>{
  signInWithPopup(auth, facebookProvider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    sessionStorage.setItem("noobflow-access-token", accessToken);

    window.location.replace("https://tubeflow.webflow.io/app/dashboard");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error.code)
    console.log(error.message)
    decodeFirebaseError(modalParent,modalCopy,error.code)
    console.log(errorCode, errorMessage);
  });
})

googleSignInbtn.addEventListener('click', () =>{
  signInWithPopup(auth, googleProvider)
  .then((result) => {
    console.log(result)
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    let config = {headers: {}};
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['authorization'] = "Bearer " + user.accessToken;

    const firstSpaceIndex = result.user.displayName.indexOf(' ');

    axios.post(uri + "/user/addAccount", {
      firstName: result.user.displayName.substring(0,firstSpaceIndex),
      lastName: result.user.displayName.substring(firstSpaceIndex+1),
      email: result.user.email
    }, config)
    .then((response) => {
          console.log(response)
          if (response.status === 200) {
          console.log("Success");
          console.log(response.data);
          sessionStorage.setItem("noobflow-access-token", user.accessToken);
          window.location.replace("https://tubeflow.webflow.io/app/dashboard");
          } else {
          console.log("Error");
          console.log(response.data);
          }
          console.log(response);
      })

    // sessionStorage.setItem("noobflow-access-token", accessToken);

    // window.location.replace("https://tubeflow.webflow.io/app/dashboard");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error.code)
    console.log(error.message)
    decodeFirebaseError(modalParent,modalCopy,error.code)
    console.log(errorCode, errorMessage);
  });
})


function decodeFirebaseError(modalParent,modalCopy,error){
  if(error === 'auth/invalid-email'){
    displayError(modalParent,modalCopy,"Please enter a Valid Email")
  } else if(error === 'auth/invalid-credential'){
    displayError(modalParent,modalCopy,"The Email or Password are incorrect")
  }
  return
}

function displayError(modalParent,modalCopy,error){
  let modalElem = document.getElementById("sign-in-modal")
  if(modalElem){
    modalElem.textContent = error
  } else {
    modalCopy.textContent = error;
    modalParent.appendChild(modalCopy);
  }
  return;
}