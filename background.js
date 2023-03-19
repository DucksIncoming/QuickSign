import Mailjs from "/mailjs.js"
const mailjs = new Mailjs();

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.name == "newEmail"){
        newEmail();
    }
});

async function newEmail() {
    let account = await mailjs.createOneAccount();
    console.log(account);
    chrome.runtime.sendMessage(account.data.username);
}

export function callFields(user, em, pass) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];

        chrome.scripting.executeScript({
            target : {tabId : activeTab.id},
            func : fillFields,
            args: [user, em, pass]
        });
    });
}

function fillFields(user, em, pass) {
    console.log([user, em, pass]);

    var username = user;
    var email = em;
    var password = pass;

    inputs = document.getElementsByTagName("input");

    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i]
        if (input.type == "email" || input.name.includes("email") || input.id.includes("email")) {
            input.value = email;
        }
        else if (input.type == "text" || input.name.includes("user") || input.id.includes("user")) {
            input.value = username;
        }
        else if (input.type == "password" || input.name.includes("pass") || input.id.includes("pass")) {
            input.value = password;
        }
    }
}

export function pageConsoleLog(msg) {
    console.log(msg);
}

function generateRandomEmail() {
    let passLen = Math.floor(Math.random() * 4) + 8; //Random length between 8 and 12 characters
    let validChars = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    
    let email = "";

    for (let i = 0; i < passLen; i++){
        let idx = Math.floor(Math.random() * validChars.length);
        email += validChars[idx];
    }

    return email;
}