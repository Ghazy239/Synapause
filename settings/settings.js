const THEME_KEY = "synapauseTheme";
const WEBSITE_KEY = "synapauseSites";
const DEFAULT_SITES = {
    youtube:true,
    instagram:true,
    tiktok:true,
    facebook:true,
    x:true,
    threads:true
};

function getStorage(){
    if(
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
    ){
        return chrome.storage.local;
    }

    return {
        get(key, callback){
            const value =
            localStorage.getItem(key);

            callback({
                [key]:
                value
                ? JSON.parse(value)
                : null
            });
        },

        set(data, callback){
            Object.entries(data)
            .forEach(([key,value])=>{
                localStorage.setItem(
                    key,
                    JSON.stringify(value)
                );
            });

            if(callback){
                callback();
            }
        }
    };
}

const storage = getStorage();

function getSystemTheme(){
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function applyTheme(theme){
    let activeTheme = theme;

    if(theme==="system"){
        activeTheme = getSystemTheme();
    }

    document.documentElement.setAttribute(
        "data-theme",
        activeTheme
    );
}

function loadTheme(){
    storage.get(
        THEME_KEY,
        result=>{
            applyTheme(
                result[THEME_KEY] || "system"
            );
        }
    );
}

function saveTheme(theme){
    storage.set({
        [THEME_KEY]:theme
    });

    applyTheme(theme);
}

window.matchMedia("(prefers-color-scheme: dark)")
.addEventListener(
    "change",
    ()=>{
        loadTheme();
    }
);

loadTheme();

console.log("LOAD SITES");

function loadSites(){
    storage.get(
        WEBSITE_KEY,

        result=>{
            const sites = {
                ...DEFAULT_SITES,
                ...(result[WEBSITE_KEY] || {})
            };

            Object.keys(DEFAULT_SITES)

            .forEach(site=>{
                document.getElementById(
                    "site-"+site
                ).checked=
                !!sites[site];
            });
        }
    );
}

function saveSites(){
    const sites={};

    Object.keys(DEFAULT_SITES)

    .forEach(site=>{
        sites[site]=
        document.getElementById(
            "site-"+site
        ).checked;
    });

    if(
        Object.values(sites)
        .every(v=>!v)
    ){
        alert(
            "Minimal satu website harus aktif."
        );

        loadSites();
        return;
    }

    console.log(sites);

    storage.set({
        [WEBSITE_KEY]:sites
    });

    chrome.runtime.sendMessage(
        "lhmdogbhjmekciofjgeemncldobfegbp",
        {
            action:"updateMonitoredSites",
            sites:Object.keys(sites)
                .filter(site=>sites[site])
                .map(site=>({
                    youtube:"youtube.com",
                    instagram:"instagram.com",
                    tiktok:"tiktok.com",
                    facebook:"facebook.com",
                    x:"x.com",
                    threads:"threads.net"
                })[site])
        },
        response=>{
            console.log(
                "Extension Response:",
                response
            );
        }
    );

    storage.get(null, result=>{
        console.log("FULL STORAGE");
        console.log(result);
    });
}

Object.keys(DEFAULT_SITES)
.forEach(site=>{
    document

    .getElementById(
        "site-"+site
    )

    .addEventListener(
        "change",
        saveSites
    );
});

loadSites();