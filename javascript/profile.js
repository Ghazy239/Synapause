//=======ELEMENT=======//
const profilePanel = document.getElementById("profile-panel");
const closeProfile = document.getElementById("close-profile");
const profileUsername = document.getElementById("profile-username");
const profileEmail = document.getElementById("profile-email");
const dashboardBtn = document.getElementById("dashboard-btn");
const homeBtn = document.getElementById("home-btn");
const settingsBtn = document.getElementById("settings-btn");
const changeUsernameBtn = document.getElementById("change-username-btn");
const changeEmailBtn = document.getElementById("change-email-btn");
const changePasswordBtn = document.getElementById("change-password-btn");
const logoutBtn = document.getElementById("logout-btn");
const logoutBtnDashboard = document.getElementById("logout-dashboard-btn");



//=======LISTENER=======//
closeProfile.addEventListener("click",()=>{
    profilePanel.classList.remove("show");
});

dashboardBtn?.addEventListener("click",()=>{
    location.href="dashboard.html";
});

homeBtn?.addEventListener("click",()=>{
    location.href="home.html";
});

settingsBtn.addEventListener("click",()=>{
    profilePanel.classList.remove("show");
    settingsOverlay.classList.add("show");
});

changeUsernameBtn.addEventListener("click",()=>{
    profilePanel.classList.remove("show");

    openChangeSection(
        changeUsernameSection
    );
});

changeEmailBtn.addEventListener("click",()=>{
    profilePanel.classList.remove("show");

    openChangeSection(
        changeEmailSection
    );
});

changePasswordBtn.addEventListener("click",()=>{
    profilePanel.classList.remove("show");

    openChangeSection(
        changePasswordSection
    );
});

logoutBtn?.addEventListener("click",()=>{
    localStorage.removeItem("synapauseUser");
    profilePanel.classList.remove("show");
    updateNavbar();
});

logoutBtnDashboard?.addEventListener("click",()=>{
    localStorage.removeItem("synapauseUser");
    profilePanel.classList.remove("show");
    location.href="home.html";
});