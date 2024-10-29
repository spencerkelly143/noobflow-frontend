import { getAuth, onAuthStateChanged  } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import app from './firebaseApp.js'
let auth = getAuth(app)

onAuthStateChanged(auth, (user) => {
    console.log("Auth State Changed")
    if (user) {
        if(user.accessToken){
            console.log("access token updated")
            sessionStorage.setItem("noobflow-access-token",user.accessToken)
        }
        const uid = user.uid;
        const name = user.displayName;
    } else {
        console.log("nope")
    }
});

function checkAuth(){

    let accessToken = sessionStorage.getItem("noobflow-access-token");
    console.log(accessToken)
    if (accessToken === null){
        window.location.replace("https://tubeflow.webflow.io/auth/login");
        return ""
    } else {
        return accessToken;
    }
}

export default checkAuth