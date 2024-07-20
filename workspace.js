
import checkAuth from './authorizedPage.js';
import getSites from './functions/getSites.js';
import getAccount from './functions/getAccount.js';
import getCustomerSession from './functions/getCustomerSession.js';
import formatPrice from './functions/formatPrice.js';
import {showLoadingScreen, hideLoadingScreen} from './loadFunctions/loadFunctions.js';
import "https://js.stripe.com/v3/buy-button.js";

// import getSiteAccess from './functions/getSiteAccess.js';

let accessToken = checkAuth();

function displayDate(date_UTC){
    let date = new Date(date_UTC*1000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate
}

async function loadSiteData(){
    let siteResponse;
    let accountResponse;
    let sessionResponse;
    try{
        siteResponse = await getSites(accessToken);
        accountResponse = await getAccount(accessToken)
        sessionResponse = await getCustomerSession(accessToken,accountResponse.data.customerId);

        console.log(accountResponse)
        console.log(sessionResponse)
        if(siteResponse.status == 401){
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
    return [siteResponse.data, accountResponse.data, sessionResponse.data]
}

function updateUI(){
    //Get the grid that contains all site cards
    //Get Site Card Template
    // let product_card = document.getElementById("dashboard-product-1");
    // const product_grid = product_card.parentElement

    // if(product_grid===null){
    //     console.log("No Site Grid")
    // }

    // //remove all site cards
    // while (product_grid.firstChild) {
    //     product_grid.removeChild(product_grid.firstChild);
    // }

    // let ctr = 1;
    // let product_card_instance;
    // document.getElementById("setup-button").href
    // const site_number = document.getElementById("site-number") 
    // site_number.textContent = this.site_arr.length;


    document.getElementById("dashboard-progress-fill").style.width = 100*this.site_data["currentMonthlySiteViews"]/500000 +'%'
    document.getElementById("page-views").textContent = this.site_data["currentMonthlySiteViews"]
    document.getElementById("title").textContent = this.site_data["siteName"]
    document.getElementById("plan-title").textContent = this.site_data["planLevel"]
    document.getElementById("setup-button").addEventListener('click', () => window.location = "https://tubeflow.webflow.io/app/setup?site_id="+this.site_data.site_id)
    document.getElementById("last-payment-date").textContent = this.invoice === null ? "No Payment" : displayDate(this.invoice.created);
    document.getElementById("last-payment-amount").textContent = this.invoice === null ? "No Payment" : formatPrice(this.invoice.amount_paid/100);
    document.getElementById("next-payment-date").textContent = this.invoice === null ? "No Payment" : displayDate(this.invoice.created);
    document.getElementById("next-payment-amount").textContent = this.invoice === null ? "No Payment" : formatPrice(this.invoice.amount_paid/100);
    let e = document.getElementById("upgrade-views");
    let d = document.createElement('stripe-buy-button');
    d.innerHTML = e.innerHTML;
    d.setAttribute("publishable-key","pk_test_51OigbXAbpzCsd62kqjfMA0n8eyaA7mOyJa0g2yGHe8R1ONc88eTOwCBYnBEWlrlrZ1Dn8tzL9bLOSBHDDb0iu30400CDlYA0RC")
    d.setAttribute("buy-button-id","buy_btn_1PUwwiAbpzCsd62kaXLFdiMV")
    d.setAttribute("client-reference-id",this.site_data.site_id)
    // d.setAttribute("customer-email",this.account_data.email)
    d.setAttribute("customer-session-client-secret",this.stripe_client_secret)

    e.parentNode.replaceChild(d, e);
}


const workspace_loader = {
    site_data: {},
    account_data: {},
    stripe_client_secret: '',
    active_site: 0,
    data_loading: false,
    loadingScreen: document.querySelector('#loading-wrapper'),
    content: document.querySelector('.main-wrapper'),
    loadSiteData: async function() {
        console.log("loading")
        this.showLoadingScreen()
        let site_res;
        let account_res;
        let session_res;
        [site_res, account_res,session_res] = await loadSiteData();
        this.account_data = account_res;
        this.stripe_client_secret = session_res.customerSession.client_secret;
        this.invoice = session_res.invoice;
        console.log(this.invoice)
        console.log(this.account_data)
        if(site_res.site_arr.length === 0){
            window.location.replace("https://tubeflow.webflow.io/app/dashboard")
        }

        const urlParams = new URLSearchParams(window.location.search);
        let site_id = urlParams.get('site_id')
        let site_arr;
        if(site_id){
            let filtered_arr = site_res.site_arr.filter(site => site.site_id === site_id);
            site_arr = filtered_arr.length === 0 ? site_res.site_arr : filtered_arr;
        } else{
            site_arr = site_res.site_arr;
            urlParams.append("site_id", site_arr[0].site_id);
        }
        this.site_data = site_arr[0];
        this.account_id = site_res.account_id;
        this.updateUI()
        this.hideLoadingScreen()
    },

    showLoadingScreen: showLoadingScreen,
  
      // Function to hide the loading screen
    hideLoadingScreen: hideLoadingScreen,

    updateUI: updateUI
}

workspace_loader.loadSiteData();