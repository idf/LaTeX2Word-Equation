var bkg = chrome.extension.getBackgroundPage();
var alt = "";

var storeAlt = function(e) {
    alt = e.alt;
};

var copyToClipBoard = function(text) {
    var input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = text;
    input.focus();
    input.select();
    document.execCommand('Copy');
    input.remove();
};

var toMathMarkUp = function(text) {
    return "";
};


var clickHandler = function(e) {
    bkg.console.log(e);
    var buzzPostUrl = "http://www.google.com/buzz/post?";

    var text;
    if (e.selectionText) {
        text = e.selectionText;
    }

    if (e.mediaType==="image") {
        text = alt;
    }

    bkg.console.log(text);
    copyToClipBoard(text);
};

chrome.extension.onRequest.addListener(storeAlt);

chrome.contextMenus.create({
    "title": "LaTex2Word-Equation",
    "contexts": ["selection", "image"],
    "onclick": clickHandler
});

