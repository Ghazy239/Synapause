chrome.runtime.onInstalled.addListener(() => {
    console.log("Synapause Installed");
});

const monitoredSites = [
    "instagram.com",
    "tiktok.com",
    "youtube.com",
    "facebook.com",
    "x.com",
    "threads.net"
];

let session = {
    active: false,
    tabId: null,
    url: null
};

let timer = {
    seconds:0,
    running:false,
    interval:null
};

let quizRequired = false;
let quizState = null;

function hasActiveQuiz(){
    return quizState!==null;
}

function startTimer(){
    if(quizRequired){
        console.log("Waiting Quiz...");
        return;
    }

    if(timer.running){
        return;
    }

    timer.running=true;
    timer.interval=setInterval(()=>{
        timer.seconds++;

        console.log(
            "Timer :",
            timer.seconds
        );

        if(timer.seconds>=900){
            clearInterval(timer.interval);
            timer.running=false;
            quizRequired=true;
            
            if(session.tabId){
                chrome.tabs.sendMessage(
                    session.tabId,
                    {
                        action:"showOverlay"
                    }
                );
            }

            console.log("==========");
            console.log("TIMER FINISHED");
            console.log(
                "Quiz Required:",
                quizRequired
            );
            console.log("==========");
        }
    },1000);
}

function pauseTimer(){
    if(!timer.running){return;}
    clearInterval(timer.interval);
    timer.running=false;
    console.log("Timer Paused");
}

function resetTimer(){
    clearInterval(timer.interval);
    timer.running=false;
    timer.seconds=0;
    quizRequired=false;
    console.log("Timer Reset");
}

async function hasMonitoredTab(){
    const tabs = await chrome.tabs.query({});

    return tabs.some(tab=>{
        if(!tab.url){
            return false;
        }

        return monitoredSites.some(site=>
            tab.url.includes(site)
        );
    });
}

async function findMonitoredTab(){
    const tabs =
    await chrome.tabs.query({});

    return tabs.find(tab=>{
        if(!tab.url){
            return false;
        }

        return monitoredSites.some(site=>
            tab.url.includes(site)
        );
    });
}

async function getMonitoredTabs(){
    const tabs =
    await chrome.tabs.query({});

    return tabs.filter(tab=>{
        if(!tab.url){
            return false;
        }

        return monitoredSites.some(site=>
            tab.url.includes(site)
        );
    });
}

async function updateSession(tab){
    if(!tab.url){return;}

    const monitored =
    monitoredSites.some(site=>tab.url.includes(site));

    if(monitored){
        session.active = true;

    if(!hasActiveQuiz()){
        startTimer();
    }

        session.tabId = tab.id;
        session.url = tab.url;

        if(quizState){
            timer.running = false;
            clearInterval(timer.interval);
            const tabs =
            await getMonitoredTabs();

            for(const t of tabs){
                chrome.tabs.sendMessage(
                    t.id,
                    {
                        action:"closeOverlay"
                    }
                );
            }

            chrome.tabs.sendMessage(
                tab.id,
                {
                    action:"showOverlay"
                }
            );
        }

        console.log("SESSION START");
        console.log(session);
    }

    else{
        pauseTimer();
        session.active = false;
        session.tabId = null;
        session.url = null;
        console.log("SESSION STOP");
    }
}

chrome.tabs.onActivated.addListener(
    async(activeInfo)=>{
        const tab =
        await chrome.tabs.get(activeInfo.tabId);
        updateSession(tab);
    }
);

chrome.tabs.onUpdated.addListener(
async(tabId, changeInfo, tab)=>{
    if(changeInfo.status!=="complete"){
        return;
    }

    const activeTabs =
    await chrome.tabs.query({
        active:true,
        currentWindow:true
    });

    if(activeTabs.length===0){return;}
    if(activeTabs[0].id!==tab.id){return;}

    updateSession(tab);
});

chrome.tabs.onRemoved.addListener(async(tabId) => {
    if(session.tabId!==tabId){return;}
    const stillExists =
    await hasMonitoredTab();

    if(stillExists){
        const nextTab =
        await findMonitoredTab();
        session.active=true;
        session.tabId=
        nextTab.id;
        session.url=
        nextTab.url;

        console.log("SESSION MOVED");
        console.log(session);
    }

    else{
        clearInterval(timer.interval);
        timer.running = false;

        if(!hasActiveQuiz()){
            timer.seconds = 0;
            quizRequired = false;
        }

        session.active=false;
        session.tabId=null;
        session.url=null;
        console.log("SESSION ENDED");
    }
});

chrome.runtime.onMessage.addListener(
(message, sender, sendResponse)=>{
    if(message.action==="saveQuizState"){
        quizState = {
            ...message.state,
            tabId: sender.tab.id
        };
        getMonitoredTabs().then(tabs=>{
            tabs.forEach(tab=>{
                chrome.tabs.sendMessage(
                    tab.id,
                    {
                        action:"syncQuizState"
                    }
                );
            });
        });
        return;
    }

    if(message.action==="getQuizState"){
        sendResponse(quizState);
        return true;
    }

    if(message.action==="clearQuizState"){
        quizState = null;
        return;
    }

    if(message.action==="restartTimer"){
        resetTimer();
        startTimer();
        console.log("Timer Restarted");
    }
});