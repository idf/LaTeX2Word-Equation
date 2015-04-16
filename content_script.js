document.addEventListener("contextmenu", function (e) {
    var elem = e.srcElement;
    console.log(elem);
    if (elem instanceof HTMLImageElement) {
        var img = {
            src: elem.src,
            alt: elem.alt,
            height: elem.height,
            width: elem.width
        };
        chrome.extension.sendRequest(img);
    }
}, true);