const API_URL = "https://script.google.com/macros/s/AKfycbxVzXrrnASz6WHYif5oF4oLnXywIbARBt6_u8nyB7qJ_vogWETC4kmwkBolLg1wzNKE/exec";

let text = document.getElementById('text');
let treeLeft = document.getElementById('tree-left');
let treeRight = document.getElementById('tree-right');
let gateLeft = document.getElementById('gate-right');
let gateRight = document.getElementById('gate-left');

window.addEventListener('scroll', () => {
  let value = window.scrollY;
  text.style.marginTop = value * 2.5 + 'px';
  treeLeft.style.left = value * -1.5 + 'px';
  treeRight.style.left = value * 1.5 + 'px';
  gateLeft.style.left = value * 0.5 + 'px';
  gateRight.style.left = value * -0.5 + 'px';
  });
  
const menuIcon = document.getElementById("menu-icon");
const dropdown = document.getElementById("dropdown");

menuIcon.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

window.addEventListener("click", (e) => {
  if (!menuIcon.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

const signUp = document.getElementById("sign-up");
const loginOverlay = document.getElementById("login-overlay");
const closeLogin = document.getElementById("close-login");

signUp.addEventListener("click",()=>{

    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    if(user){
        profileUsername.textContent=user.username;
        profileEmail.textContent=user.email;
        profilePanel.classList.add("show");
    }

    else{
        loginOverlay.classList.add("show");
    }
});

closeLogin.addEventListener("click", () => {
    loginOverlay.classList.remove("show");
});

loginOverlay.addEventListener("click",(e)=>{
    if(e.target===loginOverlay){
        loginOverlay.classList.remove("show");
        registerPopup.classList.remove("show");
        loginPopup.classList.remove("hide");
    }
});

const loginPopup = document.getElementById("login-popup");
const registerPopup = document.getElementById("register-popup");

const openRegister = document.getElementById("open-register");
const backLogin = document.getElementById("back-login");

const closeRegister = document.getElementById("close-register");

const regUsername = document.getElementById("reg-username");
const regEmail = document.getElementById("reg-email");
const regPassword = document.getElementById("reg-password");
const regConfirm = document.getElementById("reg-confirm");

const registerBtn = document.getElementById("register-btn");

const warning = document.getElementById("password-warning");

const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const loginBtn = document.getElementById("login-btn");

const profilePanel = document.getElementById("profile-panel");
const closeProfile = document.getElementById("close-profile");

const changeUsernameBtn =
document.getElementById("change-username-btn");

const changeEmailBtn =
document.getElementById("change-email-btn");

const changePasswordBtn =
document.getElementById("change-password-btn");

const logoutBtn = document.getElementById("logout-btn");

const profileUsername =
document.getElementById("profile-username");

const profileEmail =
document.getElementById("profile-email");

closeProfile.addEventListener("click",()=>{
    profilePanel.classList.remove("show");
});

logoutBtn.addEventListener("click",()=>{
    localStorage.removeItem("synapauseUser");
    profilePanel.classList.remove("show");
    updateNavbar();
});

changeUsernameBtn.addEventListener("click", async()=>{
    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    const password = prompt(
        "Masukkan password Anda:"
    );

    if(password==null) return;

    if(password.trim()===""){
        alert("Password tidak boleh kosong.");
        return;
    }

    const newUsername = prompt(
        "Masukkan username baru:"
    );

    if(newUsername==null) return;

    if(newUsername.trim()===""){
        alert("Username tidak boleh kosong.");
        return;
    }

    if(newUsername==null) return;
    if(newUsername.trim()===""){
        alert("Username tidak boleh kosong.");
        return;
    }

    try{

        const response = await fetch(
            API_URL+
            "?action=changeUsername"+
            "&username="+encodeURIComponent(user.username)+
            "&password="+encodeURIComponent(password)+
            "&newUsername="+encodeURIComponent(newUsername)
        );

        const result = await response.json();

        if(result.success){

            user.username = result.username;

            localStorage.setItem(
                "synapauseUser",
                JSON.stringify(user)
            );

            updateNavbar();
            profileUsername.textContent=user.username;
            alert(result.message);
        }

        else{
            alert(result.message);
        }
    }

    catch(error){
        console.error(error);
        alert("Server error.");
    }
});

changeEmailBtn.addEventListener("click", async()=>{
    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    const password = prompt(
        "Masukkan password Anda:"
    );

    if(password==null) return;

    if(password.trim()===""){
        alert("Password tidak boleh kosong.");
        return;
    }

    const newEmail = prompt(
        "Masukkan email baru:"
    );

    if(newEmail==null) return;

    if(newEmail.trim()===""){
        alert("Email tidak boleh kosong.");
        return;
    }

    try{

        const response = await fetch(
            API_URL+
            "?action=changeEmail"+
            "&username="+encodeURIComponent(user.username)+
            "&password="+encodeURIComponent(password)+
            "&newEmail="+encodeURIComponent(newEmail)
        );

        const result = await response.json();

        if(result.success){

            user.email = result.email;

            localStorage.setItem(
                "synapauseUser",
                JSON.stringify(user)
            );

            updateNavbar();
            profileEmail.textContent=user.email;
            alert(result.message);
        }

        else{
            alert(result.message);
        }
    }

    catch(error){
        console.error(error);
        alert("Server error.");
    }
});

changePasswordBtn.addEventListener("click", async()=>{

    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    const oldPassword = prompt(
        "Masukkan password lama:"
    );

    if(oldPassword==null) return;

    const newPassword = prompt(
        "Masukkan password baru:"
    );

    if(newPassword==null) return;

    const confirmPassword = prompt(
        "Konfirmasi password baru:"
    );

    if(confirmPassword==null) return;

    if(newPassword!==confirmPassword){
        alert("Password baru tidak cocok.");
        return;
    }

    try{

        const response = await fetch(
            API_URL+
            "?action=changePassword"+
            "&username="+encodeURIComponent(user.username)+
            "&oldPassword="+encodeURIComponent(oldPassword)+
            "&newPassword="+encodeURIComponent(newPassword)
        );

        const result = await response.json();

        if(result.success){
            alert(result.message);
        }

        else{
            alert(result.message);
        }
    }

    catch(error){
        console.error(error);
        alert("Server error.");
    }
});

openRegister.addEventListener("click",(e)=>{
    e.preventDefault();
    loginPopup.classList.add("hide");
    registerPopup.classList.add("show");
});

backLogin.addEventListener("click",(e)=>{
    e.preventDefault();
    registerPopup.classList.remove("show");
    loginPopup.classList.remove("hide");
});

closeRegister.addEventListener("click",()=>{
    registerPopup.classList.remove("show");
    loginPopup.classList.remove("hide");
    loginOverlay.classList.remove("show");
});

function checkPassword(){
    if(regConfirm.value===""){
        warning.style.display="none";
        regConfirm.style.borderColor="#bbb";
        return;
    }
    if(regPassword.value!==regConfirm.value){
        warning.style.display="block";
        warning.textContent="Password tidak cocok.";
        regConfirm.style.borderColor="red";
    }
    else{
        warning.style.display="block";
        warning.style.color="green";
        warning.textContent="Password cocok.";
        regConfirm.style.borderColor="green";
    }
}

regPassword.addEventListener("input",checkPassword);
regConfirm.addEventListener("input",checkPassword);

const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(
            button.dataset.target
        );

        if(input.type==="password"){
            input.type="text";
            button.textContent="🙈";
        }

        else{
            input.type="password";
            button.textContent="👁";
        }
    });
});

async function registerUser(){

    if(regUsername.value.trim()===""
    || regEmail.value.trim()===""
    || regPassword.value.trim()===""
    || regConfirm.value.trim()===""){

        alert("Lengkapi semua data.");

        return;
    }

    if(regPassword.value!==regConfirm.value){

        alert("Password tidak cocok.");

        return;
    }

    registerBtn.disabled=true;
    registerBtn.textContent="Registering...";

    try{

        const response = await fetch(

        API_URL +
        "?action=register" +
        "&username=" + encodeURIComponent(regUsername.value.trim()) +
        "&email=" + encodeURIComponent(regEmail.value.trim()) +
        "&password=" + encodeURIComponent(regPassword.value)

        );

        const result=await response.json();

        if(result.success){

            alert("Register berhasil. Silakan login.");

            regUsername.value="";
            regEmail.value="";
            regPassword.value="";
            regConfirm.value="";

            registerPopup.classList.remove("show");
            loginPopup.classList.remove("hide");

        }

        else{

            alert(result.message);
        }

    }

    catch(error){

        console.error(error);

        alert("Tidak dapat terhubung ke server.");

    }

    registerBtn.disabled=false;
    registerBtn.textContent="Register";
}

registerBtn.addEventListener("click",registerUser);

async function loginUser(){

    if(loginUsername.value.trim()===""
    || loginPassword.value.trim()===""){

        alert("Lengkapi username dan password.");

        return;

    }

    loginBtn.disabled=true;
    loginBtn.textContent="Logging in...";

    try{

        const response=await fetch(

            API_URL+
            "?action=login"+
            "&username="+encodeURIComponent(loginUsername.value.trim())+
            "&password="+encodeURIComponent(loginPassword.value)

        );

        const result=await response.json();

        if(result.success){

          localStorage.setItem("synapauseUser",JSON.stringify({

            username:result.username,
            email:result.email,
            id:result.id

        }));

        updateNavbar();

          alert("Login berhasil.");

          loginOverlay.classList.remove("show");

        }

        else{

            alert(result.message);

        }

    }

    catch(error){

        console.error(error);

        alert("Tidak dapat terhubung ke server.");

    }

    loginBtn.disabled=false;

    loginBtn.textContent="Login";

}

loginBtn.addEventListener("click",loginUser);

function updateNavbar(){

    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    if(user){
        signUp.textContent = user.username;
    }

    else{
        signUp.textContent = "Sign Up";
    }
}

updateNavbar();

window.addEventListener("click",(e)=>{

    if(

        profilePanel.classList.contains("show")

        &&

        !profilePanel.contains(e.target)

        &&

        e.target!==signUp

    ){

        profilePanel.classList.remove("show");

    }

});