//=======ELEMENT=======//
const loginOverlay = document.getElementById("login-overlay");

const loginPopup = document.getElementById("login-popup");
const closeLogin = document.getElementById("close-login");
const loginIdentifier = document.getElementById("login-identifier");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const forgotLink = document.getElementById("forgot-password-link");
const openRegister = document.getElementById("open-register");

const registerPopup = document.getElementById("register-popup");
const closeRegister = document.getElementById("close-register");
const registerStep1 = document.getElementById("register-step1");
const regEmail = document.getElementById("reg-email");
const continueEmailBtn = document.getElementById("continue-email-btn");
const registerStep2 = document.getElementById("register-step2");
const regOTP = document.getElementById("reg-otp");
const verifyOtpBtn = document.getElementById("verify-otp-btn");
const registerStep3 = document.getElementById("register-step3");
const regUsername = document.getElementById("reg-username");
const continueUsernameBtn = document.getElementById("continue-username-btn");
const registerStep4 = document.getElementById("register-step4");
const regPassword = document.getElementById("reg-password");
const regConfirm = document.getElementById("reg-confirm");
const passwordWarning = document.getElementById("password-warning");
const registerBtn = document.getElementById("register-btn");

const forgotPopup = document.getElementById("forgot-popup");
const closeForgot = document.getElementById("close-forgot");
const forgotStep1 = document.getElementById("forgot-step1");
const forgotEmail = document.getElementById("forgot-email");
const forgotContinueBtn = document.getElementById("forgot-continue-btn");
const backToLogin = document.getElementById("back-to-login");
const forgotStep2 = document.getElementById("forgot-step2");
const forgotOTP = document.getElementById("forgot-otp");
const verifyResetOtpBtn = document.getElementById("verify-reset-otp-btn");
const forgotStep3 = document.getElementById("forgot-step3");
const forgotNewPassword = document.getElementById("forgot-new-password");
const forgotConfirmPassword = document.getElementById("forgot-confirm-password");
const resetPasswordBtn = document.getElementById("reset-password-btn");



//=======HELPER=======//
function checkPassword(){
    const password=regPassword.value;
    const confirm=regConfirm.value;

    const hasLength=password.length>=8;
    const hasUpper=/[A-Z]/.test(password);
    const hasLower=/[a-z]/.test(password);
    const hasNumber=/[0-9]/.test(password);

    if(password===""){
        passwordWarning.style.display="none";
        regPassword.style.borderColor="#bbb";
        regConfirm.style.borderColor="#bbb";
        return;
    }

    let messages=[];

    if(!hasLength) messages.push("Minimal 8 karakter");
    if(!hasUpper) messages.push("Huruf besar");
    if(!hasLower) messages.push("Huruf kecil");
    if(!hasNumber) messages.push("Angka");

    if(messages.length){
        passwordWarning.style.display="block";
        passwordWarning.style.color="#ef4444";
        passwordWarning.textContent=
        "Kurang: "+messages.join(", ");
        regPassword.style.borderColor="#ef4444";
    }

    else{
        passwordWarning.style.display="block";
        passwordWarning.style.color="#22c55e";
        passwordWarning.textContent=
        "Password memenuhi syarat.";
        regPassword.style.borderColor="#22c55e";
    }

    if(confirm===""){
        regConfirm.style.borderColor="#bbb";
        return;
    }

    if(password!==confirm){
        passwordWarning.style.display="block";
        passwordWarning.style.color="#ef4444";
        passwordWarning.textContent=
        "Password tidak cocok.";
        regConfirm.style.borderColor="#ef4444";
    }

    else if(messages.length===0){
        passwordWarning.style.color="#22c55e";
        passwordWarning.textContent=
        "Password siap digunakan.";
        regConfirm.style.borderColor="#22c55e";
    }
}

async function loginUser(){
    if(loginIdentifier.value.trim()===""
    || loginPassword.value.trim()===""){
        showError("Lengkapi Username atau Email dan password.");
        return;
    }

    setLoading(
        loginBtn,
        "Logging in"
    );

    try{
        const response=await fetch(
            API_URL+
            "?action=login"+
            "&identifier="+encodeURIComponent(loginIdentifier.value.trim())+
            "&password="+encodeURIComponent(loginPassword.value)
        );

        const result=await response.json();

        if(result.success){
            console.log("LOGIN RESULT");
            console.log(result);

            window.postMessage({
                source: "synapause",
                action: "login",
                user: {
                    username: result.username,
                    email: result.email,
                    id: result.id
                }
            }, "*");

            console.log("POST MESSAGE SENT");


            localStorage.setItem("synapauseUser",JSON.stringify({
            username:result.username,
            email:result.email,
            id:result.id
        }));

        updateNavbar();
          showSuccess("Login berhasil.");
          loginOverlay.classList.remove("show");
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Tidak dapat terhubung ke server.");
    }

    clearLoading(
        loginBtn,
        "Login"
    );
}



//=======LISTENER=======//
loginOverlay.addEventListener("click",(e)=>{
    if(e.target===loginOverlay){
        loginOverlay.classList.remove("show");
        registerPopup.classList.remove("show");
        loginPopup.classList.remove("hide");
    }
});


//Login//
closeLogin.addEventListener("click", () => {
    loginOverlay.classList.remove("show");
});

loginBtn.addEventListener("click",loginUser);

forgotLink.addEventListener("click",(e)=>{
    e.preventDefault();
    loginPopup.style.opacity="0";
    loginPopup.style.transform="translate(-50%,-50%) scale(.94)";

    setTimeout(()=>{
        loginPopup.classList.add("hide");
        forgotPopup.classList.add("show");
    },180);
});

openRegister.addEventListener("click",(e)=>{
    e.preventDefault();
    loginPopup.style.opacity="0";
    loginPopup.style.transform="translate(-50%,-50%) scale(.94)";

    setTimeout(()=>{
        loginPopup.classList.add("hide");
        registerPopup.classList.add("show");
    },180);
});


//Register//
closeRegister.addEventListener("click",()=>{
    registerPopup.classList.remove("show");
    loginPopup.classList.remove("hide");
    loginPopup.style.opacity="1";
    loginPopup.style.transform="translate(-50%,-50%) scale(1)";
    loginOverlay.classList.remove("show");
});

continueEmailBtn.addEventListener("click", async()=>{
    const email = regEmail.value.trim();

    if(email===""){
        showError("Email harus diisi.");
        return;
    }

    setLoading(
        continueEmailBtn,
        "Sending"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=sendVerificationOTP"+
            "&email="+encodeURIComponent(email)
        );

        const result = await response.json();

        if(result.success){
            switchStep(
                registerStep1,
                registerStep2
            );
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Tidak dapat terhubung ke server.");
    }

    clearLoading(
        continueEmailBtn,
        "Continue"
    );
});

regOTP.addEventListener("input",()=>{
    onlyNumber(regOTP);
});

regOTP.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        verifyOtpBtn.click();
    }
});

regOTP.addEventListener("paste",()=>{
    setTimeout(()=>{
        onlyNumber(regOTP);
    });
});

verifyOtpBtn.addEventListener("click", async()=>{
    const email = regEmail.value.trim();
    const otp = regOTP.value.trim();

    if(otp===""){
        showError("OTP harus diisi.");
        return;
    }

    setLoading(
        verifyOtpBtn,
        "Verifying"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=verifyOTP"+
            "&email="+encodeURIComponent(email)+
            "&otp="+encodeURIComponent(otp)
        );

        const result = await response.json();

        if(result.success){
            switchStep(
                registerStep2,
                registerStep3
            );
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Tidak dapat terhubung ke server.");
    }

    clearLoading(
        verifyOtpBtn,
        "Verify OTP"
    );
});

continueUsernameBtn.addEventListener("click",()=>{
    if(regUsername.value.trim()===""){
        showError("Username harus diisi.");
        return;
    }

    switchStep(
        registerStep3,
        registerStep4
    );
});

regPassword.addEventListener("input", checkPassword);

regConfirm.addEventListener("input", checkPassword);

registerBtn.addEventListener("click", async()=>{
    if(regPassword.value.trim()===""
    || regConfirm.value.trim()===""){
        showError("Password harus diisi.");
        return;
    }

    if(regPassword.value!==regConfirm.value){
        showError("Password tidak cocok.");
        return;
    }

    const password=regPassword.value;

    if(
        password.length<8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
    ){
        showError("Password belum memenuhi syarat.");
        return;
    }

    setLoading(
        registerBtn,
        "Registering"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=register"+
            "&username="+encodeURIComponent(regUsername.value.trim())+
            "&email="+encodeURIComponent(regEmail.value.trim())+
            "&password="+encodeURIComponent(regPassword.value)
        );

        const result = await response.json();

        if(result.success){
            localStorage.setItem(
                "synapauseUser",
                JSON.stringify({
                    username:result.username,
                    email:result.email,
                    id:result.id
                })
            );

            window.postMessage({
                source: "synapause",
                action: "login",
                user: {
                    username: result.username,
                    email: result.email,
                    id: result.id
                }
            }, "*");

            updateNavbar();

            registerStep4.style.display="none";
            registerStep3.style.display="none";
            registerStep2.style.display="none";
            registerStep1.style.display="block";

            regEmail.value="";
            regOTP.value="";
            regUsername.value="";
            regPassword.value="";
            regConfirm.value="";
            
            passwordWarning.style.display="none";
            
            loginPopup.classList.remove("hide");
            registerPopup.classList.remove("show");
            loginOverlay.classList.remove("show");
            
            showSuccess("Register berhasil.");
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Tidak dapat terhubung ke server.");
    }

    clearLoading(
        registerBtn,
        "Register"
    );
});


//Forgot//
closeForgot.addEventListener("click",()=>{
    forgotPopup.classList.remove("show");
    loginPopup.classList.remove("hide");
    loginPopup.style.opacity="1";
    loginPopup.style.transform="translate(-50%,-50%) scale(1)";
});

forgotContinueBtn.addEventListener("click", async()=>{
    const email = forgotEmail.value.trim();

    if(email===""){
        showError("Email harus diisi.");
        return;
    }

    setLoading(
        forgotContinueBtn,
        "Sending"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=sendResetOTP"+
            "&email="+encodeURIComponent(email)
        );

        const result = await response.json();

        if(result.success){
            switchStep(
                forgotStep1,
                forgotStep2
            );
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Tidak dapat terhubung ke server.");
    }

    clearLoading(
        forgotContinueBtn,
        "Continue"
    );
});

backToLogin.addEventListener("click",(e)=>{
    e.preventDefault();
    forgotPopup.classList.remove("show");
    loginPopup.classList.remove("hide");
    loginPopup.style.opacity="1";
    loginPopup.style.transform="translate(-50%,-50%) scale(1)";
});

forgotOTP.addEventListener("input",()=>{
    onlyNumber(forgotOTP);
});

forgotOTP.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        verifyResetOtpBtn.click();
    }
});

forgotOTP.addEventListener("paste",()=>{
    setTimeout(()=>{
        onlyNumber(forgotOTP);
    });
});

verifyResetOtpBtn.addEventListener("click", async()=>{
    const otp = forgotOTP.value.trim();

    if(otp===""){
        showError("OTP harus diisi.");
        return;
    }

    setLoading(
        verifyResetOtpBtn,
        "Verifying"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=verifyResetOTP"+
            "&email="+encodeURIComponent(
                forgotEmail.value.trim()
            )+
            "&otp="+encodeURIComponent(otp)
        );

        const result = await response.json();

        if(result.success){
            switchStep(
                forgotStep2,
                forgotStep3
            );
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Tidak dapat terhubung ke server.");
    }

    clearLoading(
        verifyResetOtpBtn,
        "Verify OTP"
    );
});

resetPasswordBtn.addEventListener("click", async()=>{
    if(forgotNewPassword.value.trim()===""
    || forgotConfirmPassword.value.trim()===""){
        showError("Password harus diisi.");
        return;
    }

    if(forgotNewPassword.value!==forgotConfirmPassword.value){
        showError("Password tidak cocok.");
        return;
    }

    setLoading(
        resetPasswordBtn,
        "Resetting"
    );

    try{
        const response = await fetch(
            API_URL+

            "?action=resetPassword"+

            "&email="+encodeURIComponent(
                forgotEmail.value.trim()
            )+

            "&newPassword="+encodeURIComponent(
                forgotNewPassword.value
            )
        );

        const result = await response.json();

        if(result.success){
            showSuccess(result.message);

            forgotStep3.style.display="none";
            forgotStep2.style.display="none";
            forgotStep1.style.display="block";

            forgotEmail.value="";
            forgotOTP.value="";
            forgotNewPassword.value="";
            forgotConfirmPassword.value="";
            loginIdentifier.value="";
            loginPassword.value="";

            forgotPopup.classList.remove("show");
            loginPopup.classList.remove("hide");
            loginOverlay.classList.add("show");
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Tidak dapat terhubung ke server.");
    }

    clearLoading(
        resetPasswordBtn,
        "Reset Password"
    );
});