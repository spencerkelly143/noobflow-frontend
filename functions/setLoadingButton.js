function setLoadingButton(buttonId,set_loading){
    const button = document.getElementById(buttonId)

    if(set_loading){
        if (!button) {
            console.error(`Button with ID '${buttonId}' not found.`);
            return;
        }
    
        // Save the original text and styles in data attributes
        button.dataset.originalText = button.innerText;
        button.dataset.originalBackgroundColor = button.style.backgroundColor;
        button.dataset.originalColor = button.style.color;
        button.dataset.originalCursor = button.style.cursor;

        // Style the button to show loading
        button.innerText = "Loading...";
        button.style.backgroundColor = "gray";  // Set loading background color
        button.style.color = "white";           // Set loading text color
        button.style.cursor = "not-allowed";    // Change cursor to indicate it's disabled
        button.disabled = true;                 // Disable the button
    } else {
        if(button.dataset.originalText){
            button.innerText = button.dataset.originalText || "Submit";
            button.style.backgroundColor = button.dataset.originalBackgroundColor || "";
            button.style.color = button.dataset.originalColor || "";
            button.style.cursor = button.dataset.originalCursor || "pointer";
            button.disabled = false;
        }
    }

}

export default setLoadingButton