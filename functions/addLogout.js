function addLogout(){

    const collection = document.getElementsByClassName("menu_link is-delete w-inline-block");
    collection[0].addEventListener('click', () => {
        sessionStorage.removeItem("noobflow-access-token");
        window.location.replace("https://tubeflow.webflow.io/auth/login");
    })
}

export default addLogout;