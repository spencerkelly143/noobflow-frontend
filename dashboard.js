// import 'axios'
import checkAuth from './authorizedPage.js';
import getSites from './functions/getSites.js';
import getAccount from './functions/getAccount.js'
import addLogout from "./functions/addLogout.js"
import {showLoadingScreen, hideLoadingScreen} from './loadFunctions/loadFunctions.js';

// import getSiteAccess from './functions/getSiteAccess.js';

let accessToken = checkAuth();

async function loadSiteData(){
    let siteResponse;
    let accountResponse
    try{
        siteResponse = await getSites(accessToken);
        accountResponse = await getAccount(accessToken);

        if(siteResponse.status == 401 && accountResponse.status == 401){
            sessionStorage.removeItem("noobflow-access-token")
            window.location.replace("https://tubeflow.webflow.io/auth/login?err="+siteResponse.data.msg)
        }
    } catch(e){
        console.log("Catch")
        console.log(e)
        sessionStorage.removeItem("noobflow-access-token")
        window.location.replace("https://tubeflow.webflow.io/auth/login?err="+e)
    }
    console.log(siteResponse.data)
    return [siteResponse.data, accountResponse]
}


function updateUI(){
    //Get the grid that contains all site cards

    const noSitesBanner = document.getElementById('noSitesConnected');
    if (this.site_arr.length >0){
        noSitesBanner.style.display = 'none';
    }
    const header = document.getElementById('header');
    header.textContent = "Welcome " + this.account_data.firstName + "✌️";
    const site_grid = document.getElementById("site-grid");

    //Get Site Card Template
    let site_card = document.getElementById("site-card-1");

    if(site_grid===null){
        console.log("No Site Grid")
    }

    //remove all site cards
    while (site_grid.firstChild) {
        site_grid.removeChild(site_grid.firstChild);
    }

    let ctr = 1;
    let site_card_instance;

    const site_number = document.getElementById("site-number") 
    site_number.textContent = this.site_arr.length;

    this.site_arr.forEach(site_data => {
        //copy the card template into a temporary variable
        site_card_instance = site_card.cloneNode(true);

        site_card_instance.querySelector('[fs-cmsfilter-field="title"]').textContent = site_data.siteName;
        console.log(site_data)
        site_card_instance.querySelector("#dashboard-progress-fill").style.width = 100*site_data["currentMonthlySiteViews"]/500000 +'%';

        if (site_data.planLevel !== "Free"){
            let elem = site_card_instance.getElementsByClassName('site_plan')
            if(elem!==undefined && elem?.length > 0){
                elem[0]?.classList.add('is_paid');
            }
        }
        site_card_instance.querySelector("a").href = "https://tubeflow.webflow.io/app/workspace?site_id=" + site_data.site_id;
        // site_block_instance.textContent = site_data.siteName; // Set the text content of the <a> element to the string
        site_card_instance.id = "site-card-"+ctr;

        site_grid.appendChild(site_card_instance); 
        ctr = ctr+1;

        console.log(site_grid)
    });


    // const product_block = document.getElementById("dashboard-product-1")
    // const product_list = document.getElementById("product-list")
    // const domain_list = product_block.querySelector("#domain-list")
    // const domain_block =  product_block.querySelector("#domain-1")

    // while (product_list.firstChild) {
    //     product_list.removeChild(product_list.firstChild);
    // }

    // domain_list.removeChild(domain_block)

    // let product_block_instance;
    // let domain_block_instance;

    // let product_ctr = 1;
    // let domain_str = 1;

    // this.site_arr[this.active_site]["productList"].forEach(product => {
    //     product_block_instance = product_block.cloneNode(true);

    //     let title = product_block_instance.querySelector('#product-title');
    //     let domain_list_instance =  product_block_instance.querySelector('#domain-list');

    //     title.textContent = product.product;
    //     product_block_instance.id = 'dashboard-product-'+product_ctr;
    //     domain_list_instance.id = 'domain-list-'+product_ctr;

    //     product.urlList.forEach(url =>{
    //         domain_block_instance = domain_block.cloneNode(true);
    //         domain_block_instance.querySelectorAll("div")[1].textContent = url;
    //         domain_block_instance.querySelector("a").href = 'https://' + url;

    //         domain_block_instance.id = 'domain-'+product_ctr+'-'+domain_str;
    //         domain_list_instance.appendChild(domain_block_instance)
    //     })
        
    //     product_list.appendChild(product_block_instance)
    // })
}

const site_loader = {
    site_arr: [],
    account_data: {},
    active_site: 0,
    data_loading: false,
    loadSiteData: async function() {
        console.log("loading")
        let site_res;
        let account_res;
        [site_res,account_res] = await loadSiteData();
        this.site_arr = site_res.site_arr;
        this.account_id = site_res.account_id;
        this.account_data = account_res.data;
        console.log(this.account_data)
        this.updateUI()
    },
    connectSite: async function(){
        window.location.replace("https://tubeflow.webflow.io/app/getsiteaccess")
        // console.log("yessis")
        // await getSiteAccess(accessToken, site_loader.account_id);
        // console.log("zoinkees")
        // site_loader.loadSiteData();
    },
    updateUI: updateUI
}

document.addEventListener("DOMContentLoaded", function() {
    addLogout();

    document.getElementById("connect-site-0").addEventListener('click', site_loader.connectSite)
    document.getElementById("connect-site-1").addEventListener('click', site_loader.connectSite)
    site_loader.loadSiteData();
})