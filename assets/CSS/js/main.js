// main.js - script umum
document.addEventListener('DOMContentLoaded', () => {
    console.log("Netshosting loaded");

    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user) {
        document.getElementById('user-display')?.innerText = user.username;
    }
});
