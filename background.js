var bkg = chrome.extension.getBackgroundPage();
var alt = "";
// access MathJax through CDN
$('script').append('<script type="text/javascript" src="MathJax/MathJax.js?config=TeX-AMS_HTML"></script>');

var storeAlt = function(e) {
    alt = e.alt;
};

var strip_format = function(text) {
    return text.replace(/^\$+|\$+$/g, '');
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

var JaxToML = {
    toMathML: function(jax, callback) {
        var mml;
        try {
            mml = jax.root.toMathML("");
        } catch (err) {
            if (!err.restart) {
                throw err
            } // an actual error
            return MathJax.Callback.After([JaxToML.toMathML, jax, callback], err.restart);
        }
        MathJax.Callback(callback)(mml);
    },
    convert: function(AjaxText, callback) {
        var tempDiv = $('<div style="width:455px;height:450px:border-width:thick;border-style:double;"></div>').appendTo("body").html(AjaxText)[0];
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, tempDiv]); //first place in Q
        MathJax.Hub.Queue(function() { //wait for a callback to be fired
            var jax = MathJax.Hub.getAllJax(tempDiv);
            for (var i = 0; i < jax.length; i++) {
                JaxToML.toMathML(jax[i], function(mml) {//alert(jax[i].originalText + "\n\n=>\n\n"+ mml);
                    AjaxText = AjaxText.replace(jax[i].originalText, mml);
                });
            }
            $(tempDiv).remove();
            //AjaxText = AjaxText.replace(/\(/g,""); //notice this escape character for ( - i.e it has to be \( , know why it is beacuse JS will treat ) or ( as end/begin of function as there are no quotes here.
            //AjaxText = AjaxText.replace(/\)/g,""); //notice this escape character for ) - i.e it has to be \)
            AjaxText = AjaxText.replace(/\\/g,"");
            callback(AjaxText);
        });
    }
};

var clickHandler = function(e) {
    var text;
    if (e.selectionText) {
        text = e.selectionText;
    }

    if (e.mediaType==="image") {
        text = alt;
    }
    //text = text.replace("(", "\\(");
    //text = text.replace(")", "\\)");
    text = strip_format(text);
    JaxToML.convert("$$\n"+text+"\n$$", function(mml) {
        mml = strip_format(mml);
        copyToClipBoard(mml);
    });
};

chrome.extension.onRequest.addListener(storeAlt);

chrome.contextMenus.create({
    "title": "LaTex2Word-Equation",
    "contexts": ["selection", "image"],
    "onclick": clickHandler
});

