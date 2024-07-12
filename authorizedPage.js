function checkAuth(){
    let accessToken = sessionStorage.getItem("noobflow-access-token");

    if (accessToken === null){
        window.location.replace("https://tubeflow.webflow.io/auth/login");
        return ""
    } else {
        return accessToken;
    }
}

export default checkAuth