import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import URI from "./uri.js";
// const URI="https://1b1f-2607-9880-1928-2c-00-d7da.ngrok-free.app";

async function getAccount(accessToken){
    let config = {headers: {}};
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['authorization'] = "Bearer " + accessToken;
    config.headers['ngrok-skip-browser-warning'] = "69420"

    let res = await axios.post(URI + "/user/getAccount",{},config)
    console.log(res)

    return res
}

export default getAccount