//=======ELEMENT=======//
const changeOverlay = document.getElementById("change-overlay");
const changePopup = document.getElementById("change-popup");
const closeChange = document.getElementById("close-change");

const changeUsernameSection = document.getElementById("change-username-section");
const changeUsernameStep1 = document.getElementById("change-username-step1");
const changeUsernamePassword = document.getElementById("change-username-password");
const changeUsernameContinue = document.getElementById("change-username-continue");
const changeUsernameStep2 = document.getElementById("change-username-step2");
const changeUsernameInput = document.getElementById("change-username-input");
const changeUsernameSave = document.getElementById("change-username-save");

const changeEmailSection = document.getElementById("change-email-section");
const changeEmailStep1 = document.getElementById("change-email-step1");
const changeEmailPassword = document.getElementById("change-email-password");
const changeEmailContinue = document.getElementById("change-email-continue");
const changeEmailStep2 =document.getElementById("change-email-step2");
const changeEmailInput = document.getElementById("change-email-input");
const changeEmailSend = document.getElementById("change-email-send");
const changeEmailStep3 = document.getElementById("change-email-step3");
const changeEmailOTP = document.getElementById("change-email-otp");
const changeEmailVerify = document.getElementById("change-email-verify");

const changePasswordSection = document.getElementById("change-password-section");
const changePasswordStep1 = document.getElementById("change-password-step1");
const changeOldPassword = document.getElementById("change-old-password");
const changePasswordContinue = document.getElementById("change-password-continue");
const changePasswordStep2 = document.getElementById("change-password-step2");
const changeNewPassword = document.getElementById("change-new-password");
const changeConfirmPassword = document.getElementById("change-confirm-password");
const changePasswordWarning = document.getElementById("change-password-warning");
const changePasswordSave = document.getElementById("change-password-save");



//=======HELPER=======//
function openChangeSection(section){
    document
        .querySelectorAll(".change-section")
        .forEach(div=>div.classList.remove("active"));

    section.classList.add("active");

    changeUsernameStep1.classList.add("active");
    changeUsernameStep2.classList.remove("active");

    changeUsernamePassword.value="";
    changeUsernameInput.value="";

    changeEmailStep1.classList.add("active");
    changeEmailStep2.classList.remove("active");
    changeEmailStep3.classList.remove("active");

    changeEmailPassword.value="";
    changeEmailInput.value="";
    changeEmailOTP.value="";

    changePasswordStep1.classList.add("active");
    changePasswordStep2.classList.remove("active");

    changeOldPassword.value="";
    changeNewPassword.value="";
    changeConfirmPassword.value="";

    changeNewPassword.style.borderColor="#bbb";
    changeConfirmPassword.style.borderColor="#bbb";

    changePasswordWarning.textContent="";
    changePasswordWarning.style.display="none";

    changeOverlay.classList.add("show");

    setTimeout(()=>{
        if(section===changeUsernameSection){
            changeUsernamePassword.focus();
        }

        else if(section===changeEmailSection){
            changeEmailPassword.focus();
        }

        else if(section===changePasswordSection){
            changeOldPassword.focus();
        }
    },120);
}

function checkChangePassword(){
    const password = changeNewPassword.value;
    const confirm = changeConfirmPassword.value;

    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if(password===""){
        changePasswordWarning.style.display="none";
        changeNewPassword.style.borderColor="#bbb";
        changeConfirmPassword.style.borderColor="#bbb";
        return;
    }

    let messages=[];

    if(!hasLength) messages.push("Minimal 8 karakter");
    if(!hasUpper) messages.push("Huruf besar");
    if(!hasLower) messages.push("Huruf kecil");
    if(!hasNumber) messages.push("Angka");

    if(messages.length){
        changePasswordWarning.style.display="block";
        changePasswordWarning.style.color="#ef4444";
        changePasswordWarning.textContent=
            "Kurang: "+messages.join(", ");

        changeNewPassword.style.borderColor="#ef4444";
    }

    else{
        changePasswordWarning.style.display="block";
        changePasswordWarning.style.color="#22c55e";
        changePasswordWarning.textContent=
            "Password memenuhi syarat.";

        changeNewPassword.style.borderColor="#22c55e";
    }

    if(confirm===""){
        changeConfirmPassword.style.borderColor="#bbb";
        return;
    }

    if(password!==confirm){
        changePasswordWarning.style.display="block";
        changePasswordWarning.style.color="#ef4444";
        changePasswordWarning.textContent=
            "Password tidak cocok.";

        changeConfirmPassword.style.borderColor="#ef4444";
    }

    else if(messages.length===0){
        changePasswordWarning.style.color="#22c55e";
        changePasswordWarning.textContent=
            "Password siap digunakan.";

        changeConfirmPassword.style.borderColor="#22c55e";
    }
}



//=======LISTENER=======//
changeOverlay.addEventListener("click",(e)=>{
    if(e.target===changeOverlay){
        changeOverlay.classList.remove("show");
    }
});

closeChange.addEventListener("click",()=>{
    changeOverlay.classList.remove("show");
});


//Change Username//
changeUsernamePassword.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        changeUsernameContinue.click();
    }
});

changeUsernameContinue.addEventListener("click", async()=>{
    const password =
        changeUsernamePassword.value.trim();

    if(password===""){
        showError("Password harus diisi.");
        return;
    }

    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    setLoading(
        changeUsernameContinue,
        "Continue"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=verifyPassword"+
            "&username="+
            encodeURIComponent(user.username)+
            "&password="+
            encodeURIComponent(password)
        );

        const result =
            await response.json();

        if(result.success){
            switchStep(
                changeUsernameStep1,
                changeUsernameStep2
            );

        }else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Server error.");
    }

    clearLoading(
        changeUsernameContinue,
        "Continue"
    );
});

changeUsernameInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        changeUsernameSave.click();
    }
});

changeUsernameSave.addEventListener("click", async()=>{
    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    const newUsername =
    changeUsernameInput.value.trim();

    if(newUsername===""){
        showError("Username tidak boleh kosong.");
        return;
    }

    setLoading(
        changeUsernameSave,
        "Saving"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=changeUsername"+
            "&username="+
            encodeURIComponent(user.username)+
            "&newUsername="+
            encodeURIComponent(newUsername)
        );

        const result =
        await response.json();

        if(result.success){
            user.username=result.username;

            localStorage.setItem(
                "synapauseUser",
                JSON.stringify(user)
            );

            updateNavbar();
            profileUsername.textContent=
            user.username;
            showSuccess(result.message);
            changeOverlay.classList.remove("show");
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Server error.");
    }

    clearLoading(
        changeUsernameSave,
        "Save Username"
    );
});


//Change Email//
changeEmailPassword.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        changeEmailContinue.click();
    }
});

changeEmailContinue.addEventListener("click", async()=>{
    const password =
        changeEmailPassword.value.trim();

    if(password===""){
        showError("Password harus diisi.");
        return;
    }

    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    setLoading(
        changeEmailContinue,
        "Continue"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=verifyPassword"+
            "&username="+
            encodeURIComponent(user.username)+
            "&password="+
            encodeURIComponent(password)
        );

        const result =
            await response.json();

        if(result.success){
            switchStep(
                changeEmailStep1,
                changeEmailStep2
            );
            showSuccess(result.message);
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Server error.");
    }

    clearLoading(
        changeEmailContinue,
        "Continue"
    );
});

changeEmailInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        changeEmailSend.click();
    }
});

changeEmailSend.addEventListener("click", async()=>{
    const email =
        changeEmailInput.value.trim();

    if(email===""){
        showError("Email harus diisi.");
        return;
    }

    setLoading(
        changeEmailSend,
        "Sending"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=sendVerificationOTP"+
            "&email="+
            encodeURIComponent(email)
        );

        const result =
            await response.json();

        if(result.success){
            switchStep(
                changeEmailStep2,
                changeEmailStep3
            );
            showSuccess(result.message);
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Server error.");
    }

    clearLoading(
        changeEmailSend,
        "Send OTP"
    );
});

changeEmailOTP.addEventListener("input",()=>{
    onlyNumber(changeEmailOTP);
});

changeEmailOTP.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        changeEmailVerify.click();
    }
});

changeEmailOTP.addEventListener("paste",()=>{
    setTimeout(()=>{
        onlyNumber(changeEmailOTP);
    });
});

changeEmailVerify.addEventListener("click", async()=>{
    const otp =
        changeEmailOTP.value.trim();

    if(otp===""){
        showError("OTP harus diisi.");
        return;
    }

    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    setLoading(
        changeEmailVerify,
        "Verifying"
    );

    try{
        const verifyResponse = await fetch(
            API_URL+
            "?action=verifyOTP"+
            "&email="+
            encodeURIComponent(
                changeEmailInput.value.trim()
            )+
            "&otp="+
            encodeURIComponent(otp)
        );

        const verifyResult =
            await verifyResponse.json();

        if(!verifyResult.success){
            showError(verifyResult.message);

            clearLoading(
                changeEmailVerify,
                "Verify OTP"
            );

            return;
        }

        const changeResponse = await fetch(
            API_URL+
            "?action=changeEmail"+
            "&username="+
            encodeURIComponent(user.username)+
            "&newEmail="+
            encodeURIComponent(
                changeEmailInput.value.trim()
            )
        );

        const changeResult =
            await changeResponse.json();

        if(changeResult.success){
            user.email =
                changeResult.email;

            localStorage.setItem(
                "synapauseUser",
                JSON.stringify(user)
            );

            profileEmail.textContent =user.email;
            updateNavbar();
            showSuccess(changeResult.message);
            changeOverlay.classList.remove("show");
        }

        else{
            showError(
                changeResult.message
            );
        }
    }

    catch(error){
        console.error(error);
        showError("Server error.");
    }

    clearLoading(
        changeEmailVerify,
        "Verify OTP"
    );
});


//Change Password//
changePasswordContinue.addEventListener("click", async()=>{
    const password =
        changeOldPassword.value.trim();

    if(password===""){
        showError("Password harus diisi.");
        return;
    }

    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    setLoading(
        changePasswordContinue,
        "Continue"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=verifyPassword"+
            "&username="+
            encodeURIComponent(user.username)+
            "&password="+
            encodeURIComponent(password)
        );

        const result =
            await response.json();

        if(result.success){
            switchStep(
                changePasswordStep1,
                changePasswordStep2
            );

            showSuccess(result.message);
        }
        
        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Server error.");
    }

    clearLoading(
        changePasswordContinue,
        "Continue"
    );
});

changeNewPassword.addEventListener("input", checkChangePassword);

changeConfirmPassword.addEventListener("input", checkChangePassword);

changeConfirmPassword.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        changePasswordSave.click();
    }
});

changePasswordSave.addEventListener("click", async()=>{
    if(
        changeNewPassword.value.trim()===""
        ||
        changeConfirmPassword.value.trim()===""
    ){
        showError("Password harus diisi.");
        return;
    }

    if(
        changeNewPassword.value
        !==
        changeConfirmPassword.value
    ){
        showError("Password tidak cocok.");
        return;
    }

    const password =
        changeNewPassword.value;

    if(
        password.length<8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
    ){
        showError("Password belum memenuhi syarat.");
        return;
    }

    const user = JSON.parse(
        localStorage.getItem("synapauseUser")
    );

    setLoading(
        changePasswordSave,
        "Saving"
    );

    try{
        const response = await fetch(
            API_URL+
            "?action=changePassword"+
            "&username="+
            encodeURIComponent(user.username)+
            "&oldPassword="+
            encodeURIComponent(
                changeOldPassword.value
            )+
            "&newPassword="+
            encodeURIComponent(
                changeNewPassword.value
            )
        );

        const result =
            await response.json();

        if(result.success){
            showSuccess(result.message);
            changeOverlay.classList.remove("show");
        }

        else{
            showError(result.message);
        }
    }

    catch(error){
        console.error(error);
        showError("Server error.");
    }

    clearLoading(
        changePasswordSave,
        "Save Password"
    );
});