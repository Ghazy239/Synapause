const USER = JSON.parse(
localStorage.getItem("synapauseUser")
);

const API_URL ="https://script.google.com/macros/s/AKfycbzDvygssssnKnU79C_MYw9ozTz5xdvq5AE4HgmyMkwIGi9YBYRIfVsTNjyfzLYczR6y/exec";

if(!USER){
alert("Silakan login.");
location.href="home.html";
throw new Error("Not Logged In");
}

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