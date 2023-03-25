import { callFields, pageConsoleLog, getEmails } from "/background.js"

document.getElementById("quickSignUp").addEventListener("click", quickSignUp);
document.getElementById("quickLogin").addEventListener("click", quickLogin);
document.getElementById("default-password").addEventListener("focus", defaultPasswordFocus);
document.getElementById("default-password").addEventListener("blur", defaultPasswordBlur);
document.getElementById("useCustom").addEventListener("click", useCustomToggle);
document.getElementById("storeData").addEventListener("click", storeDataToggle);
document.getElementById("refresh").addEventListener("click", refreshEmails);

//Variables
var signupUsername = ""
var signupPassword = ""
var signupEmail = ""
var signupToken = ""

//HTML Elements
var defaultPassword = document.getElementById("default-password");
var useCustom = document.getElementById("useCustom");
var storeData = document.getElementById("storeData");

chrome.storage.local.get(["useCustom"]).then((result) => {
    useCustom.checked = result.useCustom;
});
chrome.storage.local.get(["storeData"]).then((result) => {
    storeData.checked = result.storeData;
});
chrome.storage.local.get(["customPass"]).then((result) => {
    if (result.customPass == ""){
        defaultPassword.value = "Custom Password"
    }
    else {
        defaultPassword.value = result.customPass;
    }
});

await refreshEmails();

async function refreshEmails() {
    clearInbox();
    let emailList = await returnTabEmails();

    for (let i = 0; i < emailList["data"].length; i++) {
        addEmailToInbox(emailList["data"][i].from.address, emailList["data"][i].subject, emailList["data"][i].intro);
    }
}

function getTab() {
    let activeTab = ""

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        activeTab = tabs[0].name;
      });
    return activeTab;
}

function defaultPasswordFocus() {
    if (defaultPassword.value == "Custom Password"){
        defaultPassword.value = "";
        defaultPassword.style.color = "black";
    }
}

function clearInbox() {
    let inbox = document.getElementById("inbox");
    inbox.innerHTML = "";
}

function addEmailToInbox(sender, subject, content){
    let inbox = document.getElementById("inbox");
    inbox.innerHTML += '<div class="email-resource"><p class="email-sender">' + sender + '</p><p class="email-subject">' + subject + '</p><p class="email-body">' + content + '</p></div>'
}

async function returnTabEmails() {
    const result = await chrome.storage.local.get([ getTab() ]);
    let siteToken = result[ getTab() ].token;
    let msgList = await getEmails(siteToken);

    return msgList;
}

function defaultPasswordBlur() {
    const key = "customPass";
    const value = defaultPassword.value

    chrome.storage.local.set({[key]: value});

    if (defaultPassword.value == ""){
        defaultPassword.value = "Custom Password";
        defaultPassword.style.color = "#404040";
    }
}

function quickLogin() {
    //alert("This feature is currently not supported. It will be available in a later version, apologies!")
    chrome.storage.local.get([ getTab() ]).then((result) => {
        let data = result[getTab()];

        callFields(data["username"], data["email"], data["password"]);
    });
}

function useCustomToggle() {
    const key = "useCustom";
    const value = document.getElementById("useCustom").checked;

    chrome.storage.local.set({ [key]: value })
}

function storeDataToggle() {
    const key = "storeData";
    const value = document.getElementById("storeData").checked;

    chrome.storage.local.set({ [key]: value });
}

function generateRandomPassword() {
    let passLen = Math.floor(Math.random() * 8) + 8; //Random length between 8 and 16 characters
    let validChars = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "_", "#", "%", "$"
    ];
    
    let password = "";

    for (let i = 0; i < passLen; i++){
        let idx = Math.floor(Math.random() * validChars.length);
        password += validChars[idx];
    }

    return password;
}

function generateRandomUsername() {
    let passLen = Math.floor(Math.random() * 4) + 8; //Random length between 8 and 12 characters
    let validChars = [
        "a", "b", "c", "d", "e", "f", "g", "h", ,"i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    
    let username = "";

    for (let i = 0; i < passLen; i++){
        let idx = Math.floor(Math.random() * validChars.length);
        username += validChars[idx];
    }

    return username;
}

async function quickSignUp() {
    signupUsername = generateRandomUsername();
    pageConsoleLog()
    if (useCustom.checked) {
        signupPassword = document.getElementById("default-password").value;
    }
    else {
        signupPassword = generateRandomPassword();
    }
    pageConsoleLog("Runtime message transmitted to background...");
    const response = await chrome.runtime.sendMessage({name: "newEmail"});

    pageConsoleLog(response);
}

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if (msg.includes("@")){
        signupEmail = msg.split("|")[0];
        signupToken = msg.split("|")[1];
        const key = getTab()
        const value = {"email": signupEmail, "username": signupUsername, "password": signupPassword, "token": signupToken};
        if (storeData.checked) {
            chrome.storage.local.set({[key]: value});
        }

        callFields(signupUsername, signupEmail, signupPassword);
    }
});