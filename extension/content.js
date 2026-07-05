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
        const user =
        result.synapauseUser;

        console.log(
            "Current Extension User:"
        );

        console.log(user);

        if(user){
            USER_ID = user.id;
        }
    }
);

const NEXT_QUESTION_API =
"https://script.google.com/macros/s/AKfycby68KOeiPvpNscnSwTqtZa18eLCxLOsZLCSNaYEnJa7py1g9poZrDP4IT5jGKh0_nD0/exec";

const ANALYTICS_API =
"https://script.google.com/macros/s/AKfycbzDvygssssnKnU79C_MYw9ozTz5xdvq5AE4HgmyMkwIGi9YBYRIfVsTNjyfzLYczR6y/exec";

let USER_ID = "";

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

questionStartTime = Date.now();

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

    const answerTexts =
    root.querySelectorAll(
        ".answer-text"
    );

    const answerImages =
    root.querySelectorAll(
        ".answer-image"
    );

    const answers =
    root.querySelector(
        "#answers"
    );

    const questionImage =
    root.querySelector(
        "#question-image"
    );

    if(q.questionImage){
        questionImage.src =
        q.questionImage;

        questionImage.style.display =
        "block";
    }

    else{
        questionImage.style.display =
        "none";
    }

    const options=[
        {
            text:q.optionA,
            image:q.imageA
        },
        {
            text:q.optionB,
            image:q.imageB
        },
        {
            text:q.optionC,
            image:q.imageC
        },
        {
            text:q.optionD,
            image:q.imageD
        }
    ];

    const isVisual =
    q.category==="Visual";

    if(isVisual){
        answers.classList.add(
            "grid"
        );
    }

    else{
        answers.classList.remove(
            "grid"
        );
    }

    options.forEach(
    (option,index)=>{
        if(isVisual){
            answerTexts[index]
            .style.display="none";

            answerImages[index]
            .src=option.image;

            answerImages[index]
            .style.display="block";
        }

        else{
            answerImages[index]
            .style.display="none";

            answerTexts[index]
            .style.display="block";

            answerTexts[index]
            .textContent=
            option.text;
        }
    });
}

async function loadQuestions(){
    try{
        const response =
        await fetch(
            `https://script.google.com/macros/s/AKfycby68KOeiPvpNscnSwTqtZa18eLCxLOsZLCSNaYEnJa7py1g9poZrDP4IT5jGKh0_nD0/exec?action=getQuiz&userId=${USER_ID}`
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

async function finishSession(){
    if(!SESSION_ID){
        return;
    }

    const response =
    await fetch(
        ANALYTICS_API,{
            method:"POST",

            body:new URLSearchParams({
                action:"finishSession",

                sessionId:
                SESSION_ID
            })
        }
    );

    const result =
    await response.json();

    console.log(
        "========== FINISH =========="
    );

    console.log(result);
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

    const selectedAnswer =
    ["A","B","C","D"][selected];

    const isCorrect =
    selectedAnswer===correct;

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

    saveAnswer(
        questions[currentQuestion],
        selectedAnswer,
        isCorrect
    ).catch(console.error);

    setTimeout(()=>{
        feedbackBox.style.display=
        "none";

        nextQuestion(root);
    },1800);
}

function nextQuestion(root){
    currentQuestion++;

    if(currentQuestion>=questions.length){
        finishQuiz(root);
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

async function saveAnswer(
    question,
    selected,
    isCorrect
){
    const responseTime =
    Date.now() -
    questionStartTime;

    const response =
    await fetch(
        ANALYTICS_API,{
            method:"POST",

            body:new URLSearchParams({

                action:"saveAnswer",

                sessionId:
                SESSION_ID,

                userId:
                USER_ID,

                questionId:
                question.id,

                category:
                question.category,

                selectedAnswer:
                selected,

                correctAnswer:
                question.answer,

                isCorrect:
                isCorrect,

                responseTimeMS:
                responseTime,

                isReplacement:
                !isCorrect
            })
        }
    );

    const result =
    await response.json();

    console.log(
        "========== SAVE ANSWER =========="
    );

    console.log(result);
}

async function finishQuiz(root){
    await finishSession();

    document.body.style.overflow = "";

    document.documentElement.style.pointerEvents = "";

    root.remove();

    console.log(
        "Quiz Finished"
    );
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