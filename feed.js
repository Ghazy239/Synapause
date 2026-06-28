const USER = JSON.parse(
    localStorage.getItem("synapauseUser")
);

if(!USER){
    alert("Silakan login.");
    location.href="../index.html";
    throw new Error("Not logged in");
}

const USER_ID = USER.id;

const QUESTION_API =
`https://script.google.com/macros/s/AKfycby68KOeiPvpNscnSwTqtZa18eLCxLOsZLCSNaYEnJa7py1g9poZrDP4IT5jGKh0_nD0/exec?action=getQuiz&userId=${USER_ID}`;

const NEXT_QUESTION_API =
"https://script.google.com/macros/s/AKfycby68KOeiPvpNscnSwTqtZa18eLCxLOsZLCSNaYEnJa7py1g9poZrDP4IT5jGKh0_nD0/exec";

const ANALYTICS_API =
"https://script.google.com/macros/s/AKfycbzDvygssssnKnU79C_MYw9ozTz5xdvq5AE4HgmyMkwIGi9YBYRIfVsTNjyfzLYczR6y/exec";

const timerElement =
document.getElementById("timer");

let quizSeconds = 30;
let quizCountdown;
let isPaused = false;

const FEED_TIME = 15;
let seconds = FEED_TIME;

let countdown;

async function startFeedTimer(){
    seconds = FEED_TIME;

    timerElement.textContent =
    "00:" +
    String(seconds).padStart(2,"0");

    clearInterval(countdown);

    countdown =
    setInterval(async ()=>{
        seconds--;
        timerElement.textContent =
        "00:" + String(seconds).padStart(2,"0");

        if(seconds<=0){
            clearInterval(
                countdown
            );

            await startSession();
            await loadQuestions();
            currentQuestion = 0;

            loadQuestion();

            document
            .getElementById("quiz-overlay")
            .classList.add("show");

            startQuizTimer();
        }
    },1000);
}

const backupquestions = [
    {
        question:
        "2, 4, 8, 16, ...",
        answers:
        ["18","24","32","64"],
        correct:2
    },

    {
        question:
        "Merah, Biru, Merah, Biru, ...",
        answers:
        ["Merah","Hijau","Kuning","Putih"],
        correct:0
    },

    {
        question:
        "5 + 7 × 2 = ?",
        answers:
        ["24","19","17","14"],
        correct:1
    }

];

let questions = [];
let currentQuestion = 0;
let SESSION_ID = "";
let questionStartTime = 0;

function loadQuestion(){
    questionStartTime = Date.now();

    document
    .getElementById("question-count")
    .textContent =
    "Question " +
    (currentQuestion+1)
    + " / " +
    questions.length;

    document
    .getElementById("question-text")
    .textContent =
    questions[currentQuestion]
    .question;

    const buttons =
    document.querySelectorAll(
        ".answer-btn"
    );

    const feedbackBox =
    document.getElementById(
    "feedback-box"
    );

    const feedbackTitle =
    document.getElementById(
    "feedback-title"
    );

    const feedbackText =
    document.getElementById(
    "feedback-text"
    );

    const answerTexts =
    document.querySelectorAll(".answer-text");

    const answerImages =
    document.querySelectorAll(".answer-image");

    const answers =
    document.getElementById("answers");

    const q =
    questions[currentQuestion];

    console.log(q);

    feedbackBox.style.display =
    "none";

    answerButtons.forEach(btn=>{
        btn.disabled = false;
        btn.classList.remove(
            "correct",
            "wrong"
        );
    });

    const questionImage =
    document.getElementById(
        "question-image"
    );

    if(q.questionImage){

        questionImage.src =
        q.questionImage;

        questionImage.onload = () => {
            console.log("IMAGE LOADED");
        };

        questionImage.onerror = (e) => {
            console.log("IMAGE FAILED");
            console.log(e);
        };

        console.log(
            q.questionImage
        );

        console.log(
            questionImage.src
        );

        console.log(
            questionImage.complete
        );

        questionImage.style.display =
        "block";
    }

    else{
        questionImage.style.display =
        "none";
    }

    const options = [
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
    q.category === "Visual";

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

    options.forEach((option,index)=>{
        if(isVisual){
            answerTexts[index]
            .style.display =
            "none";

            answerImages[index]
            .src =
            option.image;

            answerImages[index]
            .style.display =
            "block";
        }

        else{
            answerImages[index]
            .style.display =
            "none";

            answerTexts[index]
            .style.display =
            "block";

            answerTexts[index]
            .textContent =
            option.text;
        }
    });
}

async function loadReplacementQuestion(){
    const q =
    questions[currentQuestion];

    const url = NEXT_QUESTION_API +
    "?action=getNextQuestion" +
    "&userId=" + USER_ID +
    "&category=" + q.category +
    "&currentQuestionId=" + q.id;

    const response =
    await fetch(url);

    const result =
    await response.json();

    questions[currentQuestion] =
    result.question;

    console.log(
    "Replacement Question",
    result.question
    );
}

async function finishQuiz(){
    clearInterval(
        quizCountdown
    );

    await finishSession();

    document
    .getElementById(
        "quiz-overlay"
    )
    .classList.remove(
        "show"
    );

    document
    .getElementById(
        "motivation-overlay"
    )
    .classList.add(
        "show"
    );

    setTimeout(()=>{
        document
        .getElementById(
            "motivation-overlay"
        )
        .classList.remove(
            "show"
        );

        startFeedTimer();
    },3000);
}

async function nextQuestion(isCorrect){
    if(isCorrect){
        currentQuestion++;
    }

    else{
        await loadReplacementQuestion();
    }

    if(
        currentQuestion<
        questions.length
    ){
        isPaused = false;
        loadQuestion();
    }

    else{
        finishQuiz();
    }
}

function showFeedback(
    isCorrect,
    selectedIndex,
    correctIndex
){
    isPaused = true;

    const feedbackBox =
    document.getElementById(
        "feedback-box"
    );

    const feedbackTitle =
    document.getElementById(
        "feedback-title"
    );

    const feedbackText =
    document.getElementById(
        "feedback-text"
    );

    answerButtons.forEach(btn=>{
        btn.disabled = true;
    });

    if(isCorrect){
        answerButtons[selectedIndex]
        .classList.add(
            "correct"
        );

        feedbackTitle.textContent =
        "Correct!";
    }

    else{
        answerButtons[selectedIndex]
        .classList.add(
            "wrong"
        );

        answerButtons[correctIndex]
        .classList.add(
            "correct"
        );

        feedbackTitle.textContent =
        "Incorrect";

        feedbackTitle.textContent +=
        " - Loading new question...";
    }

    feedbackText.textContent =
    questions[currentQuestion]
    .explanation;

    feedbackBox.style.display =
    "block";
}

const answerButtons =
document.querySelectorAll(
    ".answer-btn"
);

answerButtons.forEach(
(button,index)=>{
    button.addEventListener(
        "click",
        ()=>{
            const correct =
            questions[currentQuestion]
            .answer;

            const selected =
            ["A","B","C","D"][index];

            const correctIndex =
            ["A","B","C","D"]
            .indexOf(correct);

            const isCorrect =
            selected===correct;

            showFeedback(
                isCorrect,
                index,
                correctIndex
            );

            saveAnswer(
                questions[currentQuestion],
                selected,
                isCorrect
            ).catch(console.error);

            setTimeout(async()=>{
                await nextQuestion(
                    isCorrect
                );
            },1800);
        }
    );
});

function startQuizTimer(){

    const timer =
    document.getElementById(
        "quiz-timer"
    );

    quizSeconds = 30;

    timer.textContent =
    "00:30";

    clearInterval(quizCountdown);

    quizCountdown =
    setInterval(()=>{
        if(isPaused){
            return;
        }

        quizSeconds--;
        timer.textContent =
        "00:" +
        String(quizSeconds)
        .padStart(2,"0");

        if(
            quizSeconds<=0
        ){

            clearInterval(
                quizCountdown
            );

            alert(
                "Time's Up!"
            );
        }
    },1000);
}

async function loadQuestions(){
    try{
        const response =
        await fetch(
            QUESTION_API
        );

        const result =
        await response.json();

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

    SESSION_ID =
    result.sessionId;

    console.log(
        "Session:",
        SESSION_ID
    );
}

async function finishSession(){
    if(!SESSION_ID) return;

    await fetch(
        ANALYTICS_API,{
            method:"POST",

            body:new URLSearchParams({
                action:"finishSession",
                sessionId:SESSION_ID
            })
        }
    );
}

async function saveAnswer(question, selected, isCorrect){
    const responseTime =
    Date.now() -
    questionStartTime;

    await fetch(
        ANALYTICS_API,{
            method:"POST",

            body:new URLSearchParams({
                action:"saveAnswer",
                sessionId:SESSION_ID,
                userId:USER_ID,
                questionId:question.id,
                category:question.category,
                selectedAnswer:selected,
                correctAnswer:question.answer,
                isCorrect:isCorrect,
                responseTimeMS:responseTime,
                isReplacement:!isCorrect
            })
        }
    );
}

startFeedTimer();