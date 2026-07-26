console.log("Synapause Content Loaded");

window.addEventListener("message", (event) => {
    console.log("CONTENT RECEIVED");
    console.log(event.data);
    
    if (event.source !== window) {
        return;
    }

    if (
        event.origin !== "https://ghazy239.github.io" &&
        !event.origin.startsWith("http://127.0.0.1:") &&
        !event.origin.startsWith("http://localhost:")
    ) {
        return;
    }

    if (!event.data) {
        return;
    }

    if (event.data.source !== "synapause") {
        return;
    }

    chrome.runtime.sendMessage(event.data, (response) => {
        console.log("Background:", response);
    });
});

chrome.storage.local.get(
    "synapauseUser",
    (result)=>{
        const user =
        result.synapauseUser;

        console.log("USER OBJECT");
        console.log(user);

        if(user){
            USER_ID = user.id;
            USER_NAME = user.username;

            console.log("USERNAME =", USER_NAME);
        }

    }
);

chrome.storage.onChanged.addListener((changes, area) => {
    if(area !== "local"){
        return;
    }

    if(!changes.synapauseUser){
        return;
    }

    const user = changes.synapauseUser.newValue;

    console.log("USER UPDATED");
    console.log(user);
    USER_ID = user.id;
    USER_NAME = user.username;
});

const NEXT_QUESTION_API =
"https://script.google.com/macros/s/AKfycby68KOeiPvpNscnSwTqtZa18eLCxLOsZLCSNaYEnJa7py1g9poZrDP4IT5jGKh0_nD0/exec";

const ANALYTICS_API =
"https://script.google.com/macros/s/AKfycbzDvygssssnKnU79C_MYw9ozTz5xdvq5AE4HgmyMkwIGi9YBYRIfVsTNjyfzLYczR6y/exec";

let USER_ID = "";
let USER_NAME = "";

chrome.runtime.onMessage.addListener(
(message)=>{

    console.log("MESSAGE RECEIVED:", message);

    if(message.action==="showOverlay"){
        createOverlay();
    }

    if(message.action==="closeOverlay"){
        const overlay =
        document.getElementById(
            "synapause-overlay"
        );

        if(overlay){
            document.body.style.overflow="";
            document.documentElement.style.pointerEvents="";
            overlay.remove();
        }
    }

    if(message.action==="syncQuizState"){
        syncQuizState();
    }
});

function getQuizState(){
    return new Promise(resolve=>{
        chrome.runtime.sendMessage(
            {action:"getQuizState"},resolve
        );
    });
}

function syncQuizState(){
    getQuizState().then(state=>{
        if(!state){
            return;
        }

        questions =
        state.questions;
        currentQuestion =
        state.currentQuestion;
        SESSION_ID =
        state.SESSION_ID;
        quizSeconds =
        state.quizSeconds;
        questionStartTime =
        state.questionStartTime;
        isPaused =
        state.isPaused;

        const overlay =
        document.getElementById(
            "synapause-overlay"
        );

        if(!overlay){
            return;
        }

        loadQuestion(overlay);

        document
        .getElementById(
            "quiz-timer"
        )
        .textContent =
        "00:" +
        String(quizSeconds)
        .padStart(2,"0");
    });
}

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

    const haloBox = overlay.querySelector("#halo-box");
    const quizBox = overlay.querySelector("#quiz-box");
    const continueBtn = overlay.querySelector("#continue-btn");
    const savedState = await getQuizState();
    const greeting = GREETINGS[Math.floor(Math.random()*GREETINGS.length)];
    const lighter = LIGHTER[Math.floor(Math.random()*LIGHTER.length)];
    const persuasion = PERSUASIONS[Math.floor(Math.random()*PERSUASIONS.length)];
    const displayName = USER_NAME || "Teman";

    overlay.querySelector(
        "#halo-title"
    ).textContent =
    `${greeting}, ${displayName}!`;

    overlay.querySelector(
        "#halo-lighter"
    ).textContent = lighter;

    overlay.querySelector(
        "#halo-message"
    ).textContent = persuasion;

    console.log("Saved State:");
    console.log(savedState);

    if(savedState){
        questions =
        savedState.questions;
        currentQuestion =
        savedState.currentQuestion;
        SESSION_ID =
        savedState.SESSION_ID;
        quizSeconds =
        savedState.quizSeconds;
        questionStartTime =
        savedState.questionStartTime;
        isPaused =
        savedState.isPaused;
    }

    else{
        await startSession();
        await loadQuestions();
        currentQuestion = 0;
        quizSeconds = 30;
        questionStartTime = 0;
        isPaused = false;
        await saveQuizState();;
    }

    document.body.appendChild(overlay);

    continueBtn.addEventListener("click", () => {
        haloBox.style.display = "none";
        quizBox.style.display = "block";

        loadQuestion(overlay);
        bindAnswerButtons(overlay);
        startQuizTimer();
    });

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

const GREETINGS = [
    "HALOW",
    "HAIII",
    "HEI HEI",
    "ALOO",
    "DEY"
];

const LIGHTER = [
    "Konten di layar ini tak akan pernah habis, tapi waktumu hari ini ada batasnya. Sudah berapa jam yang terlewat tanpa kamu sadari?",
    "Kamu terlalu berharga kalau cuma jadi penonton keberhasilan orang lain setiap hari. Kapan giliran kamu yang melangkah dan mewujudkan impianmu sendiri?",
    "Rencananya cuma mau sebentar, kan? Tanpa sadar, jempolmu terus mengusap layar, sementara hal-hal penting di hidupmu sedang menunggumu...",
    "Coba tanyakan ke dirimu sendiri: apakah kamu yang sedang memegang ponsel ini, atau justru ponsel ini yang sedang mengendalikan hari-harimu? Kalau kata Einstein sih, Life is like riding a bicycle. To keep your balance, you must keep moving.",
    "Pikiranmu sedang lelah karena terlalu banyak informasi yang masuk. Matikan layarnya sejenak, biarkan otakmu bernapas dan istirahat yang sebenarnya.",
    "Kira-kira, dirimu di masa depan nanti akan berterima kasih atau malah menyesal saat mengingat apa yang kamu lakukan dengan ponselmu hari ini?",
    "Ada orang-orang nyata di sekitarmu yang rindu mengobrol dan menghabiskan waktu bersamamu secara utuh, bukan cuma ragamu yang ada di dekat mereka.",
    "Menutup aplikasi ini memang butuh niat kuat. Tapi aku percaya, kamu punya kendali penuh atas dirimu sendiri. Kata Plato, The beginning is the most important part of the work.",
    "Hal terburuk dari terlalu lama scrolling adalah menyadari bahwa hari sudah malam, sementara tak ada satu pun hal berarti yang selesai kamu kerjakan.",
    "Dunia nyata dan potensi dirimu sudah menanti di luar layar ini. Yuk, kunci ponselmu sekarang dan mulai lakukan satu hal kecil yang bermakna!",
    "Setiap kali kamu mengabaikan tujuanmu demi scrolling, ada versi dirimu di masa depan yang pelan-pelan sedang kamu kecewakan. Kamu yakin mau terus menyakiti potensinya? kalau kata Nelson Mandela, It always seems impossible until it's done.",
    "Di dekatmu, ada orang yang merindukan perhatian utuhmu. Jangan sampai suatu hari kamu sadar, kamu lebih sering menatap layar dingin ini daripada menatap mata orang-orang yang mencintaimu.",
    "Jujur, setelah berjam-jam mengusap layar, apakah hatimu merasa lebih tenang dan bahagia? Atau justru merasa makin kosong dan kesepian?",
    "Hari ini hanya terjadi satu kali dalam hidupmu. Sayang sekali kalau momen berharga ini menguap begitu saja hanya untuk menonton kehidupan orang lain. Kata guru besar Mahatma Ghandi, The future depends on what you do today.",
    "Kamu cuma doomscrolling seharian? pikirkan masa depanmu.. Kalau kata uncle Ben, With great power, comes great responsibility."
];

const PERSUASIONS = [
    "Ayo istirahat sejenak 30 detik bersama.",
    "Waktunya merenggangkan badan dan melihat sekeliling.",
    "Yuk, beralih dari sekadar menonton jadi berkarya!",
    "Siap untuk kembali mengejar tujuan nyatamu?",
    "Ayo beri mata kita kesempatan untuk bernapas sejenak.",
    "Yuk, ikuti kuis otak singkat ini sebelum lanjut lagi.",
    "Bagaimana kalau kita coba tantangan fokus singkat sekarang?",
    "Ayo taruh layarnya sebentar.",
    "Waktunya bikin hari ini bermakna. Mulai yuk?",
    "Yuk, melangkah keluar dan nikmati dunia nyata.",
    "Siap untuk menyegarkan pikiran dan mulai lagi dari awal?",
    "Ayo tarik napas dalam-dalam bersama.",
    "Waktunya menyelesaikan tugas-tugas penting itu!",
    "Yuk, isi ulang energi pikiran kita dengan jeda singkat.",
    "Siap menguji kemampuan?"    
];

let questions = [];
let SESSION_ID = "";
let questionStartTime = 0;
let currentQuestion = 0;
let quizSeconds = 30;
let quizCountdown;
let isPaused = false;

async function saveQuizState(){
    console.log("SAVE STATE");
    console.log({
        currentQuestion,
        quizSeconds,
        isPaused
    });

    chrome.runtime.sendMessage({
        action:"saveQuizState",

        state:{
            questions,
            currentQuestion,
            SESSION_ID,
            quizSeconds,
            questionStartTime,
            isPaused
        }
    });
}

function startQuizTimer(){
    const timer =
    document.getElementById(
        "quiz-timer"
    );

    if(quizSeconds<=0){
        quizSeconds = 30;
    }

    timer.textContent =
    "00:" +
    String(quizSeconds)
    .padStart(2,"0");

    clearInterval(quizCountdown);

    quizCountdown =
    setInterval(()=>{
        if(isPaused){
            return;
        }

        quizSeconds--;
        saveQuizState();

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

function loadQuestion(root){
    console.log("LOAD QUESTION USER_ID =", USER_ID);
    questionStartTime = Date.now();

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

    const stroopWord =
    root.querySelector(
        "#stroop-word"
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

    const isStroop =
    q.category==="Stroop";

    if(isStroop){
        stroopWord.textContent =
        q.targetWord;

        const colorMap = {
            "Merah":"red",
            "Hijau":"green",
            "Biru":"blue",
            "Kuning":"gold",
            "Hitam":"black",
            "Putih":"white",
            "Ungu":"purple",
            "Jingga":"orange"
        };

        stroopWord.style.color =
        colorMap[q.inkColor] || "white";

        stroopWord.style.display =
        "block";
    }

    else{
        stroopWord.style.display =
        "none";
    }

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

async function loadReplacementQuestion(){
    const q =
    questions[currentQuestion];

    const url =
    NEXT_QUESTION_API +
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

async function startSession(){
    console.log("START SESSION USER_ID =", USER_ID);
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

    isPaused = true;
    saveQuizState();

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

    setTimeout(async()=>{
        feedbackBox.style.display=
        "none";

        await nextQuestion(root, isCorrect);
    },1800);
}

async function nextQuestion(
    root,
    isCorrect
){
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
        saveQuizState();
        loadQuestion(root);
        await saveQuizState();

        const buttons =
        root.querySelectorAll(
            ".answer-btn"
        );

        buttons.forEach(btn=>{
            btn.disabled = false;

            btn.classList.remove(
                "correct",
                "wrong"
            );
        });
    }

    else{
        finishQuiz(root);
    }
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
    clearInterval(quizCountdown);

    await finishSession();

    document.body.style.overflow = "";

    document.documentElement.style.pointerEvents = "";

    root.remove();

    chrome.runtime.sendMessage({
        action:"clearQuizState"
    });

    chrome.runtime.sendMessage({
        action:"restartTimer"
    });

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