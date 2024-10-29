function showToast(errorMessage) {
    // Create the toast container if it doesn't already exist
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.style.position = "fixed";
        toastContainer.style.bottom = "20px";
        toastContainer.style.left = "50%";
        toastContainer.style.transform = "translateX(-50%)";
        toastContainer.style.zIndex = "1000";
        document.body.appendChild(toastContainer);
    }

    // Create the toast element
    const toast = document.createElement("div");
    toast.innerText = errorMessage;
    toast.style.backgroundColor = "rgba(220, 53, 69, 0.9)";  // Red color for error
    toast.style.color = "white";
    toast.style.padding = "10px 20px";
    toast.style.marginTop = "10px";
    toast.style.borderRadius = "5px";
    toast.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.3)";
    toast.style.opacity = "1";
    toast.style.transition = "opacity 0.5s ease";

    // Add the toast to the container
    toastContainer.appendChild(toast);

    // Remove the toast after a few seconds
    setTimeout(() => {
        toast.style.opacity = "0";  // Fade out
        setTimeout(() => {
            toastContainer.removeChild(toast);  // Remove from DOM
            if (toastContainer.childElementCount === 0) {
                document.body.removeChild(toastContainer); // Remove container if empty
            }
        }, 500); // Match the fade-out duration
    }, 3000);  // Display duration
}

export default showToast;