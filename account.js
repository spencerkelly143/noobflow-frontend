import checkAuth from './authorizedPage.js';
import getAccount from './functions/getAccount.js';
import saveAccount from './functions/saveAccount.js';
import addLogout from './functions/addLogout.js'

let accessToken = checkAuth();

async function loadAccountData(){
    let accountResponse;
    try{
        accountResponse = await getAccount(accessToken);
        if(accountResponse.status == 401){
            sessionStorage.removeItem("noobflow-access-token")
            window.location.replace("https://tubeflow.webflow.io/auth/login?err="+accountResponse.data.msg)
        }
    } catch(e){
        console.log("Catch")
        sessionStorage.removeItem("noobflow-access-token")
        window.location.replace("https://tubeflow.webflow.io/auth/login?err="+e)
    }
    console.log(accountResponse.data)
    return accountResponse.data
}

async function saveAccountData(field){
    let accountResponse;
    try{
        if(field==="personal"){
            account_loader.account_data.firstName =  document.getElementById("firstName").value;
            account_loader.account_data.lastName =  document.getElementById("lastName").value;
            account_loader.account_data.email =  document.getElementById("email").value;
        }
        accountResponse = await saveAccount(accessToken,account_loader.account_data);
    }catch(e){
        account_loader.account_data = account_loader.previous_data;
        console.log("Error")
        console.log(e)
    }
}

function updateUI(){
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");

    firstName.value = this.account_data.firstName;
    lastName.value = this.account_data.lastName;
    email.value = this.account_data.email;

    return;
}

const account_loader = {
    account_data: {},
    previous_data: {},
    data_loading: false,
    loadData: async function() {
        console.log("loading")
        this.data_loading = true
        this.account_data = await loadAccountData();
        this.data_loading = false
        this.updateUI()
    },
    cancelEdit: function(value){
        this.account_data = this.previous_data;
        console.log(this)
        account_loader.updateUI();
    },
    updateUI: updateUI,
    logOut: function(){
        sessionStorage.removeItem("noobflow-access-token")
        window.location.replace("https://tubeflow.webflow.io/")
    },
    saveChange: async function(){
        console.log(this)
        await saveAccountData(this.getAttribute("noob-change-submit"));
    }
}



document.addEventListener("DOMContentLoaded", function() {
    addLogout();

    document.querySelectorAll("[noob-disable-trigger]").forEach(function(element) {
        element.addEventListener('click', account_loader.cancelEdit)
    })
    
    document.querySelectorAll("[noob-change-submit]").forEach(function(element) {
        element.addEventListener('click', account_loader.saveChange)
    })

    account_loader.loadData();
})