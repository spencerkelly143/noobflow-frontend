import { getAuth, signOut } from "firebase/auth";


function addLogout(){
    const auth = getAuth();


    const collection = document.getElementsByClassName("menu_link is-delete w-inline-block");
    collection[0].addEventListener('click', () => {


        signOut(auth).then(() => {
            console.log("Signed Out")
          }).catch((error) => {
            console.log("Sign out error")
            console.log(error)
          });
        sessionStorage.removeItem("noobflow-access-token");
        window.location.replace("https://tubeflow.webflow.io/auth/login");
    })
}

export default addLogout;