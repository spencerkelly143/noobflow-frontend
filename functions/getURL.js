import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import URI from "./uri.js";
// const URI="https://1b1f-2607-9880-1928-2c-00-d7da.ngrok-free.app";

async function getURL(){

    let config = {headers: {}};
    config.headers['Access-Control-Allow-Origin'] = '*'
    // config.headers['authorization'] = "Bearer " + accessToken;

    let res = await axios.get(URI + "/user/getWebflowCode",config)
    console.log(res.data)

    return res.data.url
}

export default getURL