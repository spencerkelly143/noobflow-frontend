function showLoadingScreen(loadingScreen, content) {
    this.loadingScreen.style.display = 'block';
    this.content.style.display = 'none';
}


  // Function to hide the loading screen
function hideLoadingScreen(loadingScreen, content) {
    this.loadingScreen.style.display = 'none';
    this.content.style.display = 'block';
}

export {showLoadingScreen, hideLoadingScreen}