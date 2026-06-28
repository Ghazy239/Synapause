const QUESTION_API =
"https://script.google.com/macros/s/AKfycby68KOeiPvpNscnSwTqtZa18eLCxLOsZLCSNaYEnJa7py1g9poZrDP4IT5jGKh0_nD0/exec?action=getQuestions";

const timerElement =
document.getElementById("timer");

let quizSeconds = 30;

let quizCountdown;

let seconds = 15;

const countdown = setInterval(()=>{

    seconds--;

    timerElement.textContent =
    "00:" +
    String(seconds).padStart(2,"0");

    if(seconds<=0){

        clearInterval(countdown);

        document
        .getElementById("quiz-overlay")
        .classList.add("show");

        loadQuestion();

        startQuizTimer();

    }

},1000);

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

function loadQuestion(){

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

    const q =
    questions[currentQuestion];

    buttons[0].textContent =
    q.optionA;

    buttons[1].textContent =
    q.optionB;

    buttons[2].textContent =
    q.optionC;

    buttons[3].textContent =
    q.optionD;

}

const answerButtons =
document.querySelectorAll(
    ".answer-btn"
);

answerButtons.forEach(
(button,index)=>{

    button.addEventListener(
    "click",()=>{

        const correct =
        questions[currentQuestion]
        .answer;

        const selected =
        ["A","B","C","D"][index];

        if(selected===correct){

            currentQuestion++;

            if(
                currentQuestion <
                questions.length
            ){

                loadQuestion();

            }

            else{

                clearInterval(
                    quizCountdown
                );

                document
                .getElementById("quiz-overlay")
                .classList.remove("show");

                document
                .getElementById("motivation-overlay")
                .classList.add("show");

                setTimeout(()=>{

                    document
                    .getElementById("motivation-overlay")
                    .classList.remove("show");

                },3000);

            }

        }

        else{

            alert(
                "Wrong Answer"
            );

        }

    });

});

function startQuizTimer(){

    const timer =
    document.getElementById(
        "quiz-timer"
    );

    quizSeconds = 30;

    timer.textContent =
    "00:30";

    quizCountdown =
    setInterval(()=>{

        quizSeconds--;

        timer.textContent =
        "00:" +
        String(quizSeconds)
        .padStart(2,"0");

        if(quizSeconds<=0){

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
            "Question Loaded:",
            questions.length
        );

    }

    catch(error){

        console.error(
            error
        );

    }

}

loadQuestions();