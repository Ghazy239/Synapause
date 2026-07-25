//=======ELEMENT=======//
const settingsOverlay = document.getElementById("settings-overlay");
const closeSettings = document.getElementById("close-settings");
const themeSystem = document.getElementById("theme-system");
const themeLight = document.getElementById("theme-light");
const themeDark = document.getElementById("theme-dark");



//=======LISTENER=======//
settingsOverlay.addEventListener("click",e=>{
    if(e.target===settingsOverlay){
        settingsOverlay.classList.remove("show");
    }
});

closeSettings.addEventListener("click",()=>{
    settingsOverlay.classList.remove("show");
});

themeSystem.addEventListener("click",()=>{
    saveTheme("system");
});

themeLight.addEventListener("click",()=>{
    saveTheme("light");
});

themeDark.addEventListener("click",()=>{
    saveTheme("dark");
});