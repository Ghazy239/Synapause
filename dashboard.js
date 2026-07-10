const USER = JSON.parse(
localStorage.getItem("synapauseUser")
);

const API_URL ="https://script.google.com/macros/s/AKfycbzDvygssssnKnU79C_MYw9ozTz5xdvq5AE4HgmyMkwIGi9YBYRIfVsTNjyfzLYczR6y/exec";

if(!USER){
alert("Silakan login.");
location.href="home.html";
throw new Error("Not Logged In");
}

const profileBtn =
document.getElementById("profile-btn");

const profilePanel =
document.getElementById("profile-panel");

const closeProfile =
document.getElementById("close-profile");

const profileUsername =
document.getElementById("profile-username");

const profileEmail =
document.getElementById("profile-email");

const settingsBtn =
document.getElementById("settings-btn");

const settingsOverlay =
document.getElementById("settings-overlay");

const closeSettings =
document.getElementById("close-settings");

const dashboardBtn =
document.getElementById("dashboard-btn");

const logoutBtn =
document.getElementById("logout-btn");

const themeSystem =
document.getElementById("theme-system");

const themeLight =
document.getElementById("theme-light");

const themeDark =
document.getElementById("theme-dark");

const changeUsernameBtn =
document.getElementById("change-username-btn");

const changeEmailBtn =
document.getElementById("change-email-btn");

const changePasswordBtn =
document.getElementById("change-password-btn");

themeSystem.addEventListener("click",()=>{
    saveTheme("system");
});

themeLight.addEventListener("click",()=>{
    saveTheme("light");
});

themeDark.addEventListener("click",()=>{
    saveTheme("dark");
});

profileBtn.addEventListener("click",()=>{
    profileUsername.textContent=
    USER.username;

    profileEmail.textContent=
    USER.email;

    profilePanel.classList.add("show");
});

closeProfile.addEventListener("click",()=>{
    profilePanel.classList.remove("show");
});

settingsBtn.addEventListener("click",()=>{
    profilePanel.classList.remove("show");
    settingsOverlay.classList.add("show");
});

closeSettings.addEventListener("click",()=>{
    settingsOverlay.classList.remove("show");
});

logoutBtn.addEventListener("click",()=>{
    localStorage.removeItem(
        "synapauseUser"
    );

    location.href="home.html";
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

dashboardBtn.disabled = true;
dashboardBtn.style.opacity = ".5";
dashboardBtn.style.cursor = "default";

window.addEventListener("click",(e)=>{
    if(
        profilePanel.classList.contains("show")
        &&
        !profilePanel.contains(e.target)
        &&
        e.target!==profileBtn
    ){
        profilePanel.classList.remove("show");
    }
});

settingsOverlay.addEventListener("click",e=>{
    if(e.target===settingsOverlay){
        settingsOverlay.classList.remove("show");
    }
});

document
.getElementById("welcome")
.textContent ="Welcome back, "+USER.username;

function animateValue(id, endValue, suffix = ""){
    const element =
    document.getElementById(id);

    if(!element) return;

    const duration = 900;
    const start = 0;
    const startTime =
    performance.now();

    function update(now){

        const progress =
        Math.min(
            (now-startTime)/duration,
            1
        );

        const value =
        start +
        (endValue-start)*
        progress;

        if(
            suffix=="%"
        ){
            element.textContent =
            value.toFixed(1)+"%";
        }

        else if(
            suffix==" ms"
        ){
            element.textContent =
            Math.round(value)+" ms";
        }

        else{
            element.textContent =
            Math.round(value);
        }

        if(progress<1){
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

function animateCircle(
id,
textId,
percent
){
    const circle =
    document.getElementById(id);
    const text =
    document.getElementById(textId);

    if(!circle || !text){return;}


    let current = 0;

    const duration = 900;
    const start =
    performance.now();

    function frame(now){
        const progress =
        Math.min(
        (now-start)/duration,
        1
        );

        const eased =
        1 -
        Math.pow(
        1-progress,
        3);

        current =
        percent*
        progress;

        circle.style.background=

        `conic-gradient(
        currentColor
        ${current*3.6}deg,
        rgba(255,255,255,.08)
        0deg)`;

        text.textContent=
        current.toFixed(0)+"%";

        if(progress<1){
            requestAnimationFrame(frame);
        }
    }

    requestAnimationFrame(frame);
}

async function loadAnalytics(){
    try{
        const response = await fetch(
            API_URL +
            "?action=getAnalytics" +
            "&userId=" +
            USER.id
        );

        const result = await response.json();
        const a = result.analytics;
        console.log(a);

        animateValue(
        "overall-accuracy",
        a.overallAccuracy,
        "%");

        animateValue(
        "average-response",
        a.averageResponse,
        " ms");

        animateValue(
        "current-streak",
        a.currentStreak);

        animateValue(
        "best-streak",
        a.bestStreak);

        animateValue(
        "total-quiz",
        a.totalQuiz);

        animateValue(
        "total-question",
        a.totalQuestion);

        animateValue(
        "total-solved",
        a.solved);

        animateValue(
        "replacement-count",
        a.replacement);

        animateValue(
        "numeric-response",
        a.category.Numeric.averageResponse,
        " ms");

        animateValue(
        "visual-response",
        a.category.Visual.averageResponse,
        " ms");

        animateValue(
        "stroop-response",
        a.category.Stroop.averageResponse,
        " ms");

        document.getElementById(
        "accuracy-bar"
        ).style.width =
        a.overallAccuracy + "%";

        animateCircle(
        "numeric-circle",
        "numeric-circle-text",
        a.category.Numeric.accuracy
        );

        animateCircle(
        "visual-circle",
        "visual-circle-text",
        a.category.Visual.accuracy
        );

        animateCircle(
        "stroop-circle",
        "stroop-circle-text",
        a.category.Stroop.accuracy
        );

        console.log(result);
    }

    catch(error){
        console.error(error);
    }
}

loadAnalytics();
lucide.createIcons();