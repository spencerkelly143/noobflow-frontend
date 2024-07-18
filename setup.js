import checkAuth from './authorizedPage.js';
import getSites from './functions/getSites.js';
import getCollections from './functions/getCollections.js';
import getFields from './functions/getFields.js';
import saveAccount from './functions/saveAccount.js';
import addView from './functions/addView.js';
import { Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'
import view from './view.js'

let accessToken = checkAuth();


function displayDate(expiry){
    if (expiry === undefined){
        return 'Continuous'
    } else {
        console.log(expiry)
        let d = new Timestamp(expiry.seconds,expiry.nanoseconds)
        console.log(d)
        let date = d.toDate();
        console.log(date)
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        console.log(date)
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedDate
    }
}

async function loadCollectionData(site_json){
    let collectionResponse;
    try{
        collectionResponse = await getCollections(accessToken, site_json.site_id, site_json.access_token);
        if(collectionResponse.status == 401){
            console.log("401 ERROR")
            console.log(collectionResponse)
        }
    } catch (e){
        console.log("ERROR")
        console.log(e)
    }
    return collectionResponse.data.collections
}

async function loadFieldData(site_json, collection_id){
    let fieldResponse;
    try{
        fieldResponse = await getFields(accessToken, collection_id, site_json.access_token);
        if(fieldResponse.status == 401){
            console.log("401 ERROR")
            console.log(fieldResponse)
        }
    } catch (e){
        console.log("ERROR")
        console.log(e)
    }
    console.log(fieldResponse)
    return fieldResponse.data.items
}


async function loadSiteData(){    
    let siteResponse;
    try{
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let backendResponse;

        console.log(backendResponse)
        backendResponse = await getSites(accessToken);
        if(backendResponse.status == 401){
            console.log(backendResponse)
            sessionStorage.removeItem("noobflow-access-token")
            window.location.replace("https://tubeflow.webflow.io/auth/login?err="+backendResponse.data.msg)
        }
        let res;
        console.log(urlParams.get("siteId"))
        if (urlParams.get("siteId")){
            console.log(res)
            res = backendResponse.data.site_arr.filter(site => site.site_id === urlParams.get("siteId"))
            console.log(res)
        } else {
            console.log(res)
            res = backendResponse.data.site_arr;
            console.log(res)
        }
        if (res.length < 1){
            console.log(res)
            // window.location.replace("https://noobflow.webflow.io/app/dashboard")
        }

        siteResponse = res[0];
        console.log(siteResponse)
    } catch(e){
        console.log("Catch")
        console.log(e)
        sessionStorage.removeItem("noobflow-access-token")
        window.location.replace("https://noobflow.webflow.io/auth/login?err="+e)
    }
    console.log(siteResponse)
    return siteResponse
}

function updateUI(){
    const popup = document.getElementById('popup');
    const openPopupButton = document.getElementById('openPopupButton');
    const closeButton = document.querySelector('.close');
    const copyButton = document.getElementById('copyButton');
    const scriptCode = document.getElementById('scriptCode');

    closeButton.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    copyButton.addEventListener('click', function() {
        scriptCode.select();
        scriptCode.setSelectionRange(0, 99999); // For mobile devices

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.error('Oops, unable to copy', err);
        }
    });

    const tableBody = document.querySelector("tbody");
    const row = tableBody.querySelector("tr");

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    let ctr = 0;
    console.log(row)
    if(this.site_json.views){
        this.site_json.views.forEach(viewTrackers => {
            let rowInstance = row.cloneNode(true);
            console.log(rowInstance)
            console.log(rowInstance.querySelector("#row-collection-0"))
            rowInstance.querySelector("#row-collection-0").textContent = viewTrackers.collection.name;
            rowInstance.querySelector("#row-collection-0").id = "row-collection-" + ctr;
            rowInstance.querySelector("#row-field-0").textContent = viewTrackers.field.name;
            rowInstance.querySelector("#row-field-0").id = "row-field-" + ctr;
            rowInstance.querySelector("#row-expiry-0").textContent = displayDate(viewTrackers.expiry);
            rowInstance.querySelector("#row-expiry-0").id = "row-expiry-" + ctr;
            rowInstance.querySelector("#row-publish-0").textContent = viewTrackers.frequency;
            rowInstance.querySelector("#row-publish-0").id = "row-publish-"+ctr;
            rowInstance.querySelector("#get-script-0").addEventListener('click', (e) => setup_loader.getScript(e,popup));
            rowInstance.querySelector("#get-script-0").id = "get-script-"+ctr;
            rowInstance.querySelector("#delete-0").addEventListener('click', setup_loader.deleteView);
            rowInstance.querySelector("#delete-0").id = "delete-" + ctr;

            tableBody.appendChild(rowInstance);
            ctr = ctr + 1;
        })
    } else {
        let rowInstance = row.cloneNode(true);
        console.log(rowInstance)
        console.log(rowInstance.querySelector("#row-collection-0"))
        rowInstance.querySelector("#row-collection-0").textContent = "";
        rowInstance.querySelector("#row-collection-0").id = "row-collection-" + ctr;
        rowInstance.querySelector("#row-field-0").textContent = "";
        rowInstance.querySelector("#row-field-0").id = "row-field-" + ctr;
        rowInstance.querySelector("#row-expiry-0").textContent = "";
        rowInstance.querySelector("#row-expiry-0").id = "row-expiry-" + ctr;
        rowInstance.querySelector("#row-publish-0").textContent = "";
        rowInstance.querySelector("#row-publish-0").id = "row-publish-"+ctr;
        rowInstance.querySelector("#get-script-0").id = "get-script-"+ctr;
        rowInstance.querySelector("#delete-0").id = "delete-" + ctr;
        tableBody.appendChild(rowInstance);
    }
    const dropdown = document.getElementById("collection-dropdown");
    console.log(dropdown)
    const option = dropdown.querySelector("option");

    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }
    
    let optionInstance = option.cloneNode(true);
    optionInstance.textContent = "Select Collection"
    dropdown.append(optionInstance)

    this.collection_array.forEach(collection =>{
        let optionInstance = option.cloneNode(true);
        optionInstance.textContent = collection.displayName
        optionInstance.value = collection.id
        dropdown.append(optionInstance)
    })

    return;
}

function populateFieldDropdown(){
    let fieldCard = document.getElementById("field-card");
    const dropdown = fieldCard.querySelector("select");

    const option = dropdown.querySelector("option");

    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }
    
    let optionInstance = option.cloneNode(true);
    optionInstance.textContent = "Select Field"
    dropdown.append(optionInstance)

    setup_loader.field_array.forEach(field =>{
        let optionInstance = option.cloneNode(true);
        optionInstance.textContent = field.fieldData.name
        optionInstance.value = field.id
        dropdown.append(optionInstance)
    })

    return;
}

function populateDurationDropdown(){
    let durationCard = document.getElementById("duration-card");
    const dropdown = durationCard.querySelector("select");

    const option = dropdown.querySelector("option");

    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }
    
    let optionInstance = option.cloneNode(true);
    optionInstance.textContent = "Select Field"
    dropdown.append(optionInstance)

    let duration = ["Daily", "Weekly", "Monthly", "Yearly", "Continuous"];
     
    duration.forEach(val => {
        let optionInstance = option.cloneNode(true);
        optionInstance.textContent = val
        optionInstance.value = val
        dropdown.append(optionInstance)
    })

    return;
}

const setup_loader = {
    account_data: {},
    previous_data: {},
    collection: {},
    field: {},
    duraton: null,
    data_loading: false,
    loadData: async function() {
        this.data_loading = true
        this.site_json = await loadSiteData();
        console.log(this.site_json)
        this.collection_array = await loadCollectionData(this.site_json);
        this.data_loading = false
        this.updateUI()
    },
    cancelEdit: function(value){
        this.account_data = this.previous_data;
        account_loader.updateUI();
    },
    updateUI: updateUI,
    logOut: function(){
        sessionStorage.removeItem("noobflow-access-token")
        window.location.replace("https://noobflow.webflow.io/")
    },
    handleCollectionChange: function(event){
        setup_loader.field = {id: null, name: null};
        setup_loader.duration = null;

        const selectedText = event.target.options[event.target.selectedIndex].text;

        setup_loader.collection.id = event.target.options[event.target.selectedIndex].value;
        setup_loader.collection.name = selectedText;

        setup_loader.enableFieldSelector()
        document.getElementById("collection-card").classList.remove("is-active");
        setup_loader.setSaveButton()
    },
    handleFieldChange: function(event){
        setup_loader.duration = null;

        const selectedText = event.target.options[event.target.selectedIndex].text;
        setup_loader.field.id = event.target.options[event.target.selectedIndex].value;
        setup_loader.field.name = selectedText;

        setup_loader.enableDurationSelector()
        document.getElementById("field-card").classList.remove("is-active");
        setup_loader.setSaveButton()
    },
    handleDurationChange: function(event){
        const selectedText = event.target.options[event.target.selectedIndex].text;
        setup_loader.duration = selectedText;

        setup_loader.setSaveButton()
    },
    enableFieldSelector: async function(){
        this.field = {};
        let fieldCard = document.getElementById("field-card")
        
        if(fieldCard.classList.contains('is-disabled')){
            fieldCard.classList.remove('is-disabled')
            fieldCard.classList.add('is-active')
        }
        this.field_array = await loadFieldData(this.site_json, this.collection.id)
        populateFieldDropdown()
    },
    enableDurationSelector: async function(){
        this.duration = {};
        let durationCard = document.getElementById("duration-card");

        if(durationCard.classList.contains('is-disabled')){
            durationCard.classList.remove('is-disabled')
            durationCard.classList.add('is-active')
        }
        populateDurationDropdown()
    },
    setSaveButton: async function(){
        if(setup_loader.collection.id && 
            setup_loader.field.id &&
            setup_loader.duration){
                console.log('here')
                document.getElementById("save-button").disabled = false;
        } else {
            document.getElementById("save-button").disabled = true;
        }
    },
    addView: async function(){
        let res = await addView(accessToken, setup_loader.site_json.site_id, setup_loader.collection,
                                    setup_loader.field, setup_loader.duration);
        console.log(res)
        await setup_loader.loadData()
    },
    deleteView: function(ctr){
        console.log(ctr)
    },
    getScript: function(e, popup){
        let splitIdArray = e.target.parentNode.id.split('-');
        let idNum = splitIdArray[splitIdArray.length-1];
        let view_json = setup_loader.site_json.views[idNum]
        document.getElementById('scriptCode').textContent = "<script src='fjdsflks/fdsaf?site_id=" + this.site_json.site_id+ "&field_id=" + view_json.field.id + "&collection_id=" +view_json.collection.id +"' ></script>";
        popup.style.display = 'flex';
    }
}

// document.querySelectorAll("[noob-disable-trigger]").forEach(function(element) {
//     element.addEventListener('click', account_loader.cancelEdit)
// })

document.getElementById("collection-dropdown").addEventListener('change', setup_loader.handleCollectionChange)
document.getElementById("field-dropdown").addEventListener('change', setup_loader.handleFieldChange)
document.getElementById("duration-dropdown").addEventListener('change', setup_loader.handleDurationChange)

document.getElementById("save-button").addEventListener('click', setup_loader.addView)
window.addEventListener('click', function(event) {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

setup_loader.loadData();