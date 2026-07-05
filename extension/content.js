console.log("Synapause Content Loaded");

window.addEventListener(
    "message",
    (event)=>{
        if(
            event.source!==window
        ){
            return;
        }

        if(
            event.data.type!==
            "SYNAPAUSE_LOGIN"
        ){
            return;
        }

        chrome.storage.local.set({
            synapauseUser:
            event.data.user
        },()=>{
            console.log(
                "Extension Storage Updated"
            );

            console.log(
                event.data.user
            );
        });
    }
);

chrome.storage.local.get(
    "synapauseUser",
    (result)=>{
        console.log(
            "Current Extension User:"
        );

        console.log(
            result.synapauseUser
        );
    }
);

console.log(user);

const USER_ID =
user.id;

const QUESTION_API =
`https://script.google.com/macros/s/AKfycby68KOeiPvpNscnSwTqtZa18eLCxLOsZLCSNaYEnJa7py1g9poZrDP4IT5jGKh0_nD0/exec?action=getQuiz&userId=${USER_ID}`;

const NEXT_QUESTION_API =
"https://script.google.com/macros/s/AKfycby68KOeiPvpNscnSwTqtZa18eLCxLOsZLCSNaYEnJa7py1g9poZrDP4IT5jGKh0_nD0/exec";

const ANALYTICS_API =
"https://script.google.com/macros/s/AKfycbzDvygssssnKnU79C_MYw9ozTz5xdvq5AE4HgmyMkwIGi9YBYRIfVsTNjyfzLYczR6y/exec";

chrome.runtime.onMessage.addListener(
(message)=>{
    if(
        message.action===
        "showOverlay"
    ){
        createOverlay();
    }
});

async function createOverlay(){
    if(
        document.getElementById(
            "synapause-overlay"
        )
    ){
        return;
    }

    const overlay =
    document.createElement(
        "div"
    );

    overlay.id=
    "synapause-overlay";

    const html =
    await fetch(
        chrome.runtime.getURL(
            "overlay/overlay.html"
        )
    ).then(r=>r.text());

    overlay.innerHTML = html;

    document.body.appendChild(overlay);

    await startSession();

    await loadQuestions();

    currentQuestion = 0;

    loadQuestion(overlay);

    bindAnswerButtons(overlay);

    document.body.style.overflow ="hidden";
    document.documentElement.style.pointerEvents ="none";
    overlay.style.pointerEvents ="auto";
}

const backupquestions=[
    {
        question:"2, 4, 8, 16, ...",
        answers:[
            "18",
            "24",
            "32",
            "64"
        ],
        correct:2
    },
    {
        question:"2, 4, 8, 16, ...",
        answers:[
            "18",
            "24",
            "32",
            "69"
        ],
        correct:3
    },
    {
        question:"2, 4, 8, 16, ...",
        answers:[
            "18",
            "67",
            "32",
            "64"
        ],
        correct:1
    }
];

let questions = [];

let SESSION_ID = "";

let questionStartTime = 0;

let currentQuestion = 0;

function loadQuestion(root){
    const feedbackBox=
    root.querySelector(
        "#feedback-box"
    );

    feedbackBox.style.display=
    "none";

    const q=
    questions[currentQuestion];
    
    root.querySelector(
        "#question-count"
    ).textContent=
    `Question ${currentQuestion + 1} / ${questions.length}`;

    root.querySelector(
        "#question-text"
    ).textContent=
    q.question;

    const texts=
    root.querySelectorAll(
        ".answer-text"
    );

    texts.forEach(
        (text,index)=>{
            text.textContent=
            q.answers[index];
        }
    );
}

async function loadQuestions(){
    try{
        const response =
        await fetch(
            QUESTION_API
        );

        const result =
        await response.json();

        console.log("========== RESULT ==========");
        console.log(result);

        console.log("========== QUESTIONS ==========");
        console.log(result.questions);

        console.log("========== FIRST QUESTION ==========");
        console.log(result.questions[0]);

        questions =
        result.questions;

        console.log(
            "Quiz Questions:",
            questions
        );
    }

    catch(error){
        console.error(
            error
        );
    }
}

async function startSession(){
    const response = await fetch(
        ANALYTICS_API,{
            method:"POST",

            body:new URLSearchParams({
                action:"startSession",
                userId:USER_ID
            })
        }
    );

    const result =
    await response.json();

    console.log("========== SESSION ==========");
    console.log(result);

    SESSION_ID =
    result.sessionId;

    console.log(
        "Session:",
        SESSION_ID
    );
}

function bindAnswerButtons(root){
    const buttons =
    root.querySelectorAll(
        ".answer-btn"
    );

    buttons.forEach(
        (button,index)=>{
            button.addEventListener("click",
                ()=>{
                    checkAnswer(
                        root,
                        index
                    );
                }
            );
        }
    );
}

function checkAnswer(root,selected){
    const buttons=
    root.querySelectorAll(
        ".answer-btn"
    );

    const correct=
    questions[currentQuestion].answer;

    const correctIndex =
    ["A","B","C","D"]
    .indexOf(correct);

    const feedbackBox =
    root.querySelector(
        "#feedback-box"
    );

    const feedbackTitle =
    root.querySelector(
        "#feedback-title"
    );

    buttons.forEach(btn=>{
        btn.disabled=true;
    });

    if(selected===correctIndex){
        buttons[selected]
        .classList.add("correct");

        console.log("Correct");

        feedbackTitle.textContent ="Correct!";

        feedbackBox.style.display="block";
    }

    else{
        buttons[selected]
        .classList.add("wrong");

        buttons[correctIndex]
        .classList.add("correct");

        console.log("Wrong");

        feedbackTitle.textContent ="Incorrect!";

        feedbackBox.style.display="block";
    }

    setTimeout(()=>{
        feedbackBox.style.display=
        "none";

        nextQuestion(root);
    },1800);
}

function nextQuestion(root){
    currentQuestion++;

    if(currentQuestion>=backupquestions.length){
        console.log("Quiz Finished");
        return;
    }

    loadQuestion(root);

    const buttons=
    root.querySelectorAll(".answer-btn");

    buttons.forEach(btn=>{
        btn.disabled=false;

        btn.classList.remove(
            "correct",
            "wrong"
        );
    });
}

fetch(
    chrome.runtime.getURL(
        "overlay/overlay.css"
    )
)
.then(r=>r.text())
.then(css=>{

    const style =
    document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
});

document.addEventListener("keydown",e=>{
        if(!document.getElementById(
            "synapause-overlay"
            )
        ){return;}
        e.stopPropagation();
    },true
);

document.addEventListener("wheel",e=>{
        if(document.getElementById(
            "synapause-overlay"
            )
        ){e.preventDefault();}
    },{passive:false}
);

document.addEventListener("touchmove",e=>{
        if(document.getElementById(
            "synapause-overlay"
            )
        ){e.preventDefault();}
    },{passive:false}
);