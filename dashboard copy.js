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

        document.getElementById(
        "numeric-accuracy"
        ).textContent =
        a.category.Numeric.total
        ?
        (
        a.category.Numeric.correct /
        a.category.Numeric.total *
        100
        ).toFixed(1) + "%":"-";

        document.getElementById(
        "visual-accuracy"
        ).textContent =
        a.category.Visual.total
        ?
        (
        a.category.Visual.correct /
        a.category.Visual.total *
        100
        ).toFixed(1) + "%":"-";

        document.getElementById(
        "stroop-accuracy"
        ).textContent =
        a.category.Stroop.total
        ?
        (
        a.category.Stroop.correct /
        a.category.Stroop.total *
        100
        ).toFixed(1) + "%":"-";

        document.getElementById(
        "numeric-response"
        ).textContent =
        Math.round(
        a.category.Numeric.averageResponse
        ) + " ms";

        document.getElementById(
        "visual-response"
        ).textContent =
        Math.round(
        a.category.Visual.averageResponse
        ) + " ms";

        document.getElementById(
        "stroop-response"
        ).textContent =
        Math.round(
        a.category.Stroop.averageResponse
        ) + " ms";

        document.getElementById(
        "accuracy-bar"
        ).style.width =
        a.overallAccuracy + "%";

        document.getElementById(
        "numeric-bar"
        ).style.width =
        a.category.Numeric.accuracy + "%";

        document.getElementById(
        "visual-bar"
        ).style.width =
        a.category.Visual.accuracy + "%";

        document.getElementById(
        "stroop-bar"
        ).style.width =
        a.category.Stroop.accuracy + "%";

        console.log(result);
    }

    catch(error){
        console.error(error);
    }
}

loadAnalytics();
lucide.createIcons();