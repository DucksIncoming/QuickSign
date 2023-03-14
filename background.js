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