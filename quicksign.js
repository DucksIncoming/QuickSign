import { signUp } from "./credentials.js";

document.getElementById("default-password").addEventListener("focus", defaultPasswordFocus);
document.getElementById("default-password").addEventListener("blur", defaultPasswordBlur);

document.getElementById("quickLogin").addEventListener("click", quickLogin);
document.getElementById("quickSignUp").addEventListener("click", getSiteAddress);

document.getElementById("useCustom").addEventListener("click", useCustomToggle);
document.getElementById("storeData").addEventListener("click", storeDataToggle);

retrieveLocalStorage();

var bkg = chrome.extension.getBackgroundPage();


function defaultPasswordFocus() {
    if (defaultPassword.value == "Custom Password"){
        defaultPassword.value = "";
        defaultPassword.style.color = "black";
    }
}

function defaultPasswordBlur() {
    defaultPassword = document.getElementById("default-password");
    localStorage.setItem("customPassword", defaultPassword.value);

    if (defaultPassword.value == ""){
        defaultPassword.value = "Custom Password";
        defaultPassword.style.color = "#404040";
    }
}

function useCustomToggle() {
    useCustom = document.getElementById("useCustom");
    localStorage.setItem("useCustom", useCustom.checked);
    bkg.console.log('foo');
}

function storeDataToggle() {
    storeData = document.getElementById("storeData");
    localStorage.setItem("storeData", storeData.checked);
}

function retrieveLocalStorage() {
    console.log(localStorage);

    useCustom = document.getElementById("useCustom");
    storeData = document.getElementById("storeData");
    defaultPassword = document.getElementById("default-password");
    defaultPassword.value = localStorage.getItem("customPassword");

    useCustom.checked = (localStorage.getItem("useCustom") == "true");
    storeData.checked = (localStorage.getItem("storeData") == "true");

    if (defaultPassword.value == ""){
        defaultPassword.value = "Custom Password";
        defaultPassword.style.color = "#404040";
    }
    else {
        defaultPassword.style.color = "black";
    }
}

function quickSignUp() {
    chrome.tabs.executeScript(null, {file: './credentials.js'}, () => console.log("Injection successful."));

    email = generateEmail();
    siteAddress = getSiteAddress();
    if (localStorage.getItem("useCustom") == "true"){
        password = localStorage.getItem("customPassword");
    }
    else {
        password = generateRandomPassword();
    }

    signInData = parseJSON([username, password]);
    localStorage.setItem(siteAddress, signInData);

    signUp(username, password);
}

function quickLogin() {
    userField = searchForUsernameField();
    passField = searchForPasswordField();

    //userField.value = localStorage.getItem("")
}

async function getSiteAddress() {       
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {
        tabURL = tabs[0].url;

        tabURL = tabURL.replace("https://", "");
        tabURL = tabURL.replace("http://", "");
        tabTruncatedURL = tabURL.split("/")[0];
        //document.getElementById("default-password").value = tabTruncatedURL;

        return tabTruncatedURL;
    });    
  }

function generateEmail() { 
    
}

function generateRandomPassword() {
    passLen = Math.floor(Math.random() * 8) + 8; //Random length between 8 and 16 characters
    validChars = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "_", "#", "%", "$"
    ];
    
    password = "";

    for (i = 0; i < passLen; i++){
        idx = Math.floor(Math.random() * validChars.length);
        password += validChars[idx];
    }

    return password;
}