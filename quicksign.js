import { callFields, pageConsoleLog } from "/background.js"

document.getElementById("quickSignUp").addEventListener("click", quickSignUp);
document.getElementById("emailButton").addEventListener("click", openEmails)
document.getElementById("quickLogin").addEventListener("click", quickLogin);
document.getElementById("default-password").addEventListener("focus", defaultPasswordFocus)
document.getElementById("default-password").addEventListener("blur", defaultPasswordBlur)

//Variables
var signupUsername = ""
var signupPassword = ""
var signupEmail = ""
var signupToken = ""

//HTML Elements
var defaultPassword = document.getElementById("default-password");
var useCustom = document.getElementById("useCustom");
var storeData = document.getElementById("storeData");

function getTab() {
    var activeTabId = 0;

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

function defaultPasswordBlur() {
    localStorage.setItem("customPassword", defaultPassword.value);

    if (defaultPassword.value == ""){
        defaultPassword.value = "Custom Password";
        defaultPassword.style.color = "#404040";
    }
}

function quickLogin() {
    let tabName = getTab();
    let siteData = chrome.storage.local.get([ tabName ])
    if (siteData !== null) {
        callFields(siteData["username"], siteData["email"], siteData["password"]);
    }
    else {
        alert("Error: No temporary login data found for address: " + tabName.toString());
    }
}

function useCustomToggle() {
    localStorage.setItem("useCustom", useCustom.checked);
    bkg.console.log('foo');
}

function storeDataToggle() {
    localStorage.setItem("storeData", storeData.checked);
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

function openEmails(){
    var emailURL = "https://www.minuteinbox.com/";
    chrome.tabs.create({"url": emailURL});
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
    signupPassword = generateRandomPassword();

    pageConsoleLog("Runtime message transmitted to background...");
    const response = await chrome.runtime.sendMessage({name: "newEmail"});

    pageConsoleLog(response);
}

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if (msg.includes("@")){
        signupEmail = msg.split("|")[0];
        signupToken = msg.split("|")[1];
        data = {"example.com": {"email": "example", "username": "example", "password": "example"}};
        //data = {};
        data[getTab()] = {"email": signupEmail, "username": signupUsername, "password": signupPassword, "token": signupToken};

        chrome.storage.local.set(data);
        callFields(signupUsername, signupEmail, signupPassword);
    }
});