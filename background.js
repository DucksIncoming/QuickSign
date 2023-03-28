import Mailjs from "/mailjs.js"
const mailjs = new Mailjs();

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.name == "newEmail"){
        newEmail();
    }
});

export async function getEmails(user) {
    await mailjs.login(user, "standardPassword");
    let msgs = await mailjs.getMessages();
    let output = [];

    for (let i = 0; i < msgs["data"].length; i++) {
        let msgResource = await mailjs.getMessage(msgs["data"][i].id);
        output.push(msgResource);
    }

    return output;
}

async function newEmail() {
    let account = await mailjs.createOneAccount();
    chrome.runtime.sendMessage(account.data.username + "|" + mailjs.token);
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
        if (input.type.toLowerCase() == "email" || input.name.toLowerCase().includes("email") || input.id.toLowerCase().includes("email")) {
            input.value = email;
        }
        else if (input.type.toLowerCase() == "text" || input.name.toLowerCase().includes("user") || input.id.toLowerCase().includes("user")) {
            input.value = username;
        }
        else if (input.type.toLowerCase() == "password" || input.name.toLowerCase().includes("pass") || input.id.toLowerCase().includes("pass")) {
            input.value = password;
        }
    }
}

export function pageConsoleLog(msg) {
    console.log(msg);
}