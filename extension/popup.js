const status =
document.getElementById("status");

chrome.storage.local.get(
    "synapauseUser",
    (result)=>{
        const user =
        result.synapauseUser;

        if(user){
            status.textContent =
            "Hello, " +
            user.username;
        }

        else{
            status.textContent =
            "Not Logged In";
        }
    }
);

document
.getElementById("dashboard")
.addEventListener("click",()=>{
    window.open(
        "https://ghazy239.github.io/Synapause/home.html",
        "_blank"
    );
});