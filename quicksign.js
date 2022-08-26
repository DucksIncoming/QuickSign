document.getElementById("default-password").addEventListener("focus", defaultPasswordFocus);
document.getElementById("default-password").addEventListener("blur", defaultPasswordBlur);

function defaultPasswordFocus() {
    elm = document.getElementById("default-password");
    if (elm.value == "Custom Password"){
        elm.value = "";
        elm.style.colorcolor = "black";
    }
}

function defaultPasswordBlur() {
    elm = document.getElementById("default-password");
    if (elm.value == ""){
        elm.value = "Custom Password";
        elm.style.color = "#848484";
    }
}