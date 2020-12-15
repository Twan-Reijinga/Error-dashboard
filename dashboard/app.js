header = document.getElementsByTagName("header")[0];
userName = "Twan";
header.innerHTML = "<h1>Welkom " + userName + ",</h1>";

errorBox = document.getElementById("error-box");
statistics = document.getElementById("total-errors");
var totalErrors = 0;
for(var key in errors) {
    errorBox.innerHTML += "<h3>" + key + "</h3><p>" + errors[key] + "</p>"
    totalErrors ++;
}

statistics.innerHTML = totalErrors;


