import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import checkAuth from './authorizedPage.js';
import uri from "./functions/uri.js";
// const URI="https://1b1f-2607-9880-1928-2c-00-d7da.ngrok-free.app";


async function getURL(){

    let config = {headers: {}};
    config.headers['Access-Control-Allow-Origin'] = '*'
    // config.headers['authorization'] = "Bearer " + accessToken;
    config.headers['ngrok-skip-browser-warning'] = "69420"

    let res = await axios.get(uri + "/user/getWebflowURL",config)
    console.log(res.data)

    return res.data.url
}

async function installAccessCode(accessToken,code){
    let config = {headers: {}};
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['authorization'] = "Bearer " + accessToken;
    config.headers['ngrok-skip-browser-warning'] = "69420"

    let res = await axios.post(uri + "/user/installAccessCode",{code: code},config)
    console.log("success")
    console.log(res.data)

    return res.data
}

async function getSiteAccess(){
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log("Entering Get Site Access")

    if (code) {
        console.log("Code Found")
        try{
            let accessToken = checkAuth();
            const result_json = await installAccessCode(accessToken,code)
            console.log(result_json)
            window.location.replace("https://tubeflow.webflow.io/app/dashboard")
        } catch(e){
            console.log(e)
            window.location.replace("https://tubeflow.webflow.io/app/failed")
        }
    } else {
        console.log("No Code")
        const installUrl = await getURL();
        console.log("Install URL")
        console.log(installUrl)
        window.location.replace(installUrl)
    }
}

getSiteAccess();

// export default getSiteAccess;