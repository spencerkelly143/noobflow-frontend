import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import URI from "./functions/uri.js";
// const URI="https://f2f0-2607-9880-1928-2c-00-4624.ngrok-free.app";

async function view(){
    let config = {headers: {}};
    config.headers['Access-Control-Allow-Origin'] = '*'

    let res = await axios.post(URI + "/CMSPageView",{
        site_id: "63e2d4fb5b7e5c4157cbf245",
        collection: "655be6c28e19ef097f602a87",
        field: "655be6ddfecccb46b462c9d7",
    }, config)
    
    console.log(res)

    return res
}

export default view