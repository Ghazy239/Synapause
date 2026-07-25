//=======ELEMENT=======//
const signUp = document.getElementById("sign-up");
const mobileSignUp = document.getElementById("mobile-signup");
const menuIcon = document.getElementById("menu-icon");
const dropdown = document.getElementById("dropdown");



//=======HELPER=======//
function updateNavbar(){
    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    if(user){
        signUp.textContent = user.username;
        mobileSignUp.textContent = user.username;
    }

    else{
        signUp.textContent = "Sign Up";
        mobileSignUp.textContent = "Sign Up";
    }
}

updateNavbar();



//=======LISTENER=======//
menuIcon.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

window.addEventListener("click", (e) => {
  if (!menuIcon.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

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

mobileSignUp.addEventListener("click",(e)=>{
    e.preventDefault();
    signUp.click();
});

window.addEventListener("click",(e)=>{
    if(
        profilePanel.classList.contains("show")
        &&
        !profilePanel.contains(e.target)
        &&
        e.target!==signUp
        &&
        e.target!==mobileSignUp
    ){
        profilePanel.classList.remove("show");
    }
});