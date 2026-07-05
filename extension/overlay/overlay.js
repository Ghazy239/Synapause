// Reserved for future modularization.

console.log("Overlay JS Loaded");

const backupquestions=[
    {
        question:"2, 4, 8, 16, ...",
        answers:[
            "18",
            "24",
            "32",
            "64"
        ]
    }
];

function initOverlay(root){
    const questionCount=
    root.querySelector("#question-count");

    const questionText=
    root.querySelector("#question-text");

    const answerTexts=
    root.querySelectorAll(".answer-text");

    questionCount.textContent=
    "Question 1 / 1";

    questionText.textContent=
    backupquestions[0].question;

    answerTexts.forEach((text,index)=>{
        text.textContent=
        backupquestions[0]
        .answers[index];
    });
}