userField = document.querySelector("input[type=text]");
passFields = document.querySelectorAll("input[type=password]");

userField.value = username;
for (i = 0; i < passFields.length; i++){
    passFields[i].value = password;
}