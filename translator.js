(function () {
    "use strict";

    // Prevent loading twice
    if (window.ButtonSentraalTranslator) return;
    window.ButtonSentraalTranslator = true;

    // ==========================================
    // CONFIG
    // ==========================================

    const CONFIG = {

        pageLanguage: "en",

        targetLanguage: "af",

        storageKey: "button-sentraal-language",

        button: {

            id: "lang-toggle-btn",

            bottom: 20,

            left: 20,

            background: "#feb81c",

            color: "#000",

            english: "Afrikaans 🇿🇦",

            afrikaans: "English 🇬🇧",

            loading: "Switching..."

        }

    };

    // ==========================================
    // CREATE CSS
    // ==========================================

    function injectStyles() {

        if (document.getElementById("bs-translator-style"))
            return;

        const style = document.createElement("style");

        style.id = "bs-translator-style";

        style.textContent = `


#${CONFIG.button.id}{

    position:fixed;

    bottom:${CONFIG.button.bottom}px;

    left:${CONFIG.button.left}px;

    z-index:999999;

    background:${CONFIG.button.background};

    color:${CONFIG.button.color};

    border:none;

    border-radius:8px;

    padding:10px 16px;

    font-size:13px;

    font-weight:600;

    font-family:Arial,Helvetica,sans-serif;

    cursor:pointer;

    box-shadow:0 6px 18px rgba(0,0,0,.2);

    transition:.25s;

}

#${CONFIG.button.id}:hover{

    transform:translateY(-2px);

}

#google_translate_element{

    display:none;

}

.goog-te-banner-frame,
.goog-te-balloon-frame,
.goog-logo-link{

    display:none!important;

}

body{

    top:0!important;

}

.goog-te-gadget{

    font-size:0!important;

    color:transparent!important;

}

.goog-te-combo{

    opacity:0;

    position:absolute;

    pointer-events:none;

}

`;

        document.head.appendChild(style);

    }
// ==========================================
// CREATE HTML
// ==========================================

function createHtml() {

    if (!document.body)
        return;

    if (!document.getElementById("google_translate_element")) {

        const translate =
            document.createElement("div");

        translate.id =
            "google_translate_element";

        document.body.appendChild(translate);

    }

    if (!document.getElementById(CONFIG.button.id)) {

        const button =
            document.createElement("button");

        button.id =
            CONFIG.button.id;

        button.textContent =
            CONFIG.button.english;

        document.body.appendChild(button);

    }

}
    // ==========================================
    // GOOGLE TRANSLATE
    // ==========================================

    window.googleTranslateElementInit = function () {

        new google.translate.TranslateElement({

            pageLanguage: CONFIG.pageLanguage,

            includedLanguages: CONFIG.targetLanguage,

            autoDisplay: false,

            multilanguagePage: false

        }, "google_translate_element");

    };
        // ==========================================
    // LOAD GOOGLE SCRIPT
    // ==========================================

    function loadGoogle() {

        if (document.getElementById("bs-google-script"))
            return;

        const script = document.createElement("script");

        script.id = "bs-google-script";

        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        document.head.appendChild(script);

    }
    // ==========================================
    // CHANGE LANGUAGE
    // ==========================================

    function setLang(lang, callback) {

        let attempts = 0;

        function trySet() {

            const select =
                document.querySelector(".goog-te-combo");

            if (select) {

                select.value = lang;

                select.dispatchEvent(
                    new Event("change")
                );

                if (callback)
                    callback();

            } else if (attempts < 50) {

                attempts++;

                setTimeout(
                    trySet,
                    300
                );

            }

        }

        trySet();

    }
        // ==========================================
    // BUTTON EVENTS
    // ==========================================

    function registerEvents() {

        const button =
            document.getElementById(CONFIG.button.id);

        if (!button)
            return;

        let lang =
            localStorage.getItem(CONFIG.storageKey) || "en";

        if (lang === "af") {

            button.textContent =
                CONFIG.button.afrikaans;

        }

        button.addEventListener("click", function () {

            button.textContent =
                CONFIG.button.loading;

            if (lang === "en") {

                setLang("af", function () {

                    lang = "af";

                    localStorage.setItem(
                        CONFIG.storageKey,
                        "af"
                    );

                    button.textContent =
                        CONFIG.button.afrikaans;

                });

            } else {

                localStorage.setItem(
                    CONFIG.storageKey,
                    "en"
                );

                location.reload();

            }

        });

    }
        // ==========================================
    // START
    // ==========================================

    function start() {

    injectStyles();

    createHtml();

    loadGoogle();

    const lang =
        localStorage.getItem(CONFIG.storageKey) || "en";

    setTimeout(function () {

        const button =
            document.getElementById(CONFIG.button.id);

        if (!button)
            return;

        if (lang === "af") {

            setLang("af");

            button.textContent =
                CONFIG.button.afrikaans;

        } else {

            button.textContent =
                CONFIG.button.english;

        }

        registerEvents();

    }, 1500);

}
        // ==========================================
    // BOOT
    // ==========================================

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    } else {

        start();

    }

})();