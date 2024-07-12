function getStripeLink(product, site_id){
    const link_map = {"CMS Clicks": "https://buy.stripe.com/test_9AQ3dV6CRc44eSk3cc"}

    let link = link_map[product];
    if (account_info.id !== ""){
        link = link + "?client_reference_id=" + account_info.account_id + "&prefilled_email=" + account_info.email
    }

    return link
}