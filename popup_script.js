// document.addEventListener('DOMContentLoaded', function() {
//     const popup = document.getElementById('popup');
//     const openPopupButton = document.getElementById('openPopupButton');
//     const closeButton = document.querySelector('.close');
//     const copyButton = document.getElementById('copyButton');
//     const scriptCode = document.getElementById('scriptCode');

//     // Function to open the popup
//     openPopupButton.addEventListener('click', function() {
//         console.log("fas")
//         popup.style.display = 'flex';
//     });

//     // Function to close the popup
//     closeButton.addEventListener('click', function() {
//         popup.style.display = 'none';
//     });

//     // Function to copy the script to clipboard
//     copyButton.addEventListener('click', function() {
//         scriptCode.select();
//         scriptCode.setSelectionRange(0, 99999); // For mobile devices

//         try {
//             const successful = document.execCommand('copy');
//             const msg = successful ? 'successful' : 'unsuccessful';
//             console.log('Copying text command was ' + msg);
//         } catch (err) {
//             console.error('Oops, unable to copy', err);
//         }
//     });

//     // Close the popup if the user clicks outside of it
//     window.addEventListener('click', function(event) {
//         if (event.target === popup) {
//             popup.style.display = 'none';
//         }
//     });
// });