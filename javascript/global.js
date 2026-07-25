//=======ELEMENT=======//
const API_URL = "https://script.google.com/macros/s/AKfycbzE3DuUQM-m9Bi5Uggo0x0prOGeUuB04U4kUvTfI_RW_ESdOVQ6Ul0zkrzNXpOlhf4/exec";
const toggleButtons = document.querySelectorAll(".toggle-password");
const toast = document.getElementById("toast");



//=======STATE=======//
let toastTimer;



//=======HELPER=======//
function switchStep(current,next){
    current.classList.remove("active");
    setTimeout(()=>{
        next.classList.add("active");

        const input=
        next.querySelector("input");

        if(input){
            input.focus();
        }
    },120);
}

function setLoading(button,text){
    button.disabled=true;
    button.classList.add("loading");
    button.textContent=text;
}

function clearLoading(button,text){
    button.disabled=false;
    button.classList.remove("loading");
    button.textContent=text;
}

function showSuccess(message){
    clearTimeout(toastTimer);

    toast.textContent=message;
    toast.style.background="#22c55e";
    toast.classList.add("show");

    toastTimer=setTimeout(()=>{
        toast.classList.remove("show");
    },2500);
}

function showError(message){
    clearTimeout(toastTimer);

    toast.textContent=message;
    toast.style.background="#ef4444";
    toast.classList.add("show");

    toastTimer=setTimeout(()=>{
        toast.classList.remove("show");
    },3000);
}

function onlyNumber(input){
    input.value=input.value.replace(/\D/g,"");
}



//=======LISTENER=======//
toggleButtons?.forEach(button => {
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