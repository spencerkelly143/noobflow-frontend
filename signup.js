import { getAuth, createUserWithEmailAndPassword,GoogleAuthProvider,signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import uri from './functions/uri.js';
import app from './firebaseApp.js'

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()


const createAccountBtn = document.getElementById("submitSignUp");
const googleSignInBtn= document.getElementById("google-sign-in")
const facebookSignInBtn = document.getElementById("facebook-sign-in");

if (createAccountBtn === null) {
    console.log("No Create Account button found");
} else {

    let accessToken = sessionStorage.getItem("noobflow-access-token");

    if (accessToken !== null) {
        window.location.replace("https://tubeflow.webflow.io/app/dashboard");
    }

    createAccountBtn.addEventListener("click", () => {
        const email = document.getElementById("signUpEmail").value;
        const password = document.getElementById("password").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        console.log("Adding the following: ")
        console.log(email)
        console.log(firstName)
        console.log(lastName)
        if (!email || !password || !firstName || !lastName) {
            console.log("A field was missing")
        return;
        }
    
        if (email==="" || !password==="" || !firstName==="" || !lastName==="") {
            console.log("ENTER VALID VALUES")
        return;
        }

        createUserWithEmailAndPassword(
        auth,
        email,
        password
        )
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;

            sessionStorage.setItem("noobflow-access-token", user.accessToken);
            let config = {headers: {}};
            config.headers['Access-Control-Allow-Origin'] = '*'
            config.headers['authorization'] = "Bearer " + user.accessToken;

            sessionStorage.setItem("noobflow-access-token", user.accessToken)
            axios
            .post(URI + "/user/addAccount", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }, config)
            .then((response) => {
                console.log("Success");
                console.log(response.data);
                window.location.replace("https://tubeflow.webflow.io/app/dashboard");
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    });
}

googleSignInBtn.addEventListener("click",() => {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            console.log(result)
            const user = result.user;

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
        })
})