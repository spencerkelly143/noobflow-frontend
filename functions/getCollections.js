import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import URI from "./uri.js";
// const URI="https://1b1f-2607-9880-1928-2c-00-d7da.ngrok-free.app";

async function getCollections(accessToken,site_id,webflow_access){
    let config = {headers: {}};
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['authorization'] = "Bearer " + accessToken;

    let res = await axios.post(URI + "/getCollections",{site_id: site_id, token: webflow_access},config)
    console.log(res)

    return res
}

export default getCollections;