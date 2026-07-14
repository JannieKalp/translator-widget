(function () {

if (window.TranslatorWidgetLoaded) return;
window.TranslatorWidgetLoaded = true;

// =======================
// CREATE STYLES
// =======================

const style = document.createElement("style");

style.textContent = `
#lang-toggle-btn{
    position:fixed;
    top:20px;
    left:20px;
    z-index:10000;
    background:#0b7fab;
    color:#fff;
    padding:10px 16px;
    border:none;
    border-radius:8px;
    font-size:13px;
    font-weight:600;
    cursor:pointer;
    box-shadow:0 6px 18px rgba(0,0,0,.2);
    transition:.3s ease;
    font-family:Arial, Helvetica, sans-serif;
}

#lang-toggle-btn:hover{
    transform:translateY(-2px);
}

.goog-te-banner-frame,
.goog-te-balloon-frame,
.goog-logo-link{
    display:none !important;
}

body{
    top:0 !important;
}

.goog-te-gadget{
    font-size:0 !important;
    color:transparent !important;
}

.goog-te-combo{
    opacity:0;
    position:absolute;
    pointer-events:none;
}
`;

document.head.appendChild(style);

// =======================
// CREATE HTML
// =======================

const translateDiv = document.createElement("div");
translateDiv.id = "google_translate_element";

document.body.appendChild(translateDiv);

const button = document.createElement("button");

button.id = "lang-toggle-btn";
button.innerHTML = "Afrikaans 🇿🇦";

document.body.appendChild(button);
  // =======================
// GOOGLE TRANSLATE
// =======================

window.googleTranslateElementInit = function () {

    new google.translate.TranslateElement({

        pageLanguage: "en",
        includedLanguages: "af",
        autoDisplay: false,
        multilanguagePage: false

    }, "google_translate_element");

};

// =======================
// CHANGE LANGUAGE
// =======================

function setLang(lang, callback){

    let attempts = 0;

    function trySet(){

        const select = document.querySelector(".goog-te-combo");

        if(select){

            select.value = lang;
            select.dispatchEvent(new Event("change"));

            if(callback) callback();

        }else if(attempts < 50){

            attempts++;
            setTimeout(trySet,300);

        }

    }

    trySet();

}
  // =======================
// PAGE LOAD
// =======================

document.addEventListener("DOMContentLoaded", function(){

    let lang = localStorage.getItem("lang") || "en";

    setTimeout(function(){

        if(lang === "af"){

            setLang("af");

            button.innerHTML = "English 🇬🇧";

        }else{

            button.innerHTML = "Afrikaans 🇿🇦";

        }

    },1500);

    button.addEventListener("click", function(){

        button.innerHTML = "Switching...";

        if(lang === "en"){

            setLang("af", function(){

                lang = "af";

                localStorage.setItem("lang","af");

                button.innerHTML = "English 🇬🇧";

            });

        }else{

            localStorage.setItem("lang","en");

            location.reload();

        }

    });

});

// =======================
// LOAD GOOGLE SCRIPT
// =======================

const script = document.createElement("script");

script.src =
"https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

document.head.appendChild(script);

})();
