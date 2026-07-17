(function () {
    "use strict";

    // ==========================================
    // PREVENT LOADING TWICE
    // ==========================================

    if (window.ButtonSentraalTranslator) return;
    window.ButtonSentraalTranslator = true;

    // ==========================================
    // CONFIG
    // ==========================================

    const CONFIG = {

        pageLanguage: "en",

        targetLanguage: "af",

        storageKey: "button-sentraal-language",

        googleContainer: "google_translate_element",

        button: {

            id: "lang-toggle-btn",

            bottom: 20,

            left: 20,

            background: "#feb81c",

            color: "#000000",

            font: "Arial, Helvetica, sans-serif",

            borderRadius: 8,

            paddingY: 10,

            paddingX: 16,

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

#${CONFIG.googleContainer}{

    position:absolute!important;

    left:-9999px!important;

    top:-9999px!important;

    visibility:hidden!important;

}

.goog-te-gadget,
.goog-te-gadget-simple,
.goog-te-combo,
.goog-te-banner-frame,
.goog-te-balloon-frame,
.goog-tooltip,
.goog-text-highlight{

    display:none!important;

}

body{

    top:0!important;

}

iframe.goog-te-banner-frame{

    display:none!important;

}

#${CONFIG.button.id}{

    position:fixed;

    bottom:${CONFIG.button.bottom}px;

    left:${CONFIG.button.left}px;

    z-index:999999;

    display:flex;

    align-items:center;

    justify-content:center;

    gap:8px;

    background:${CONFIG.button.background};

    color:${CONFIG.button.color};

    padding:${CONFIG.button.paddingY}px ${CONFIG.button.paddingX}px;

    border:none;

    border-radius:${CONFIG.button.borderRadius}px;

    cursor:pointer;

    font-family:${CONFIG.button.font};

    font-size:14px;

    font-weight:600;

    box-shadow:0 6px 18px rgba(0,0,0,.20);

    transition:.25s;

}

#${CONFIG.button.id}:hover{

    transform:translateY(-2px);

}

`;

        document.head.appendChild(style);

    }
        // ==========================================
    // CREATE HTML
    // ==========================================

    function createHtml() {

        if (!document.getElementById(CONFIG.googleContainer)) {

            const div = document.createElement("div");

            div.id = CONFIG.googleContainer;

            document.body.appendChild(div);

        }

        if (!document.getElementById(CONFIG.button.id)) {

            const button = document.createElement("button");

            button.id = CONFIG.button.id;

            button.type = "button";

            button.innerHTML =
                `<span>🌐</span><span id="bs-language-text">${CONFIG.button.english}</span>`;

            document.body.appendChild(button);

        }

    }

    // ==========================================
    // LOAD GOOGLE TRANSLATE
    // ==========================================

    function loadGoogleTranslate() {

        if (document.getElementById("bs-google-translate"))
            return;

        const script = document.createElement("script");

        script.id = "bs-google-translate";

        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        document.head.appendChild(script);

    }

    // ==========================================
    // GOOGLE CALLBACK
    // ==========================================

    window.googleTranslateElementInit = function () {

        new google.translate.TranslateElement({

            pageLanguage: CONFIG.pageLanguage,

            includedLanguages:
                CONFIG.targetLanguage,

            autoDisplay: false,

            multilanguagePage: false

        }, CONFIG.googleContainer);

    };
        // ==========================================
    // CHANGE LANGUAGE
    // ==========================================

    function setLanguage(lang, done) {

        let tries = 0;

        const maxTries = 40;

        const interval = setInterval(function () {

            const select =
                document.querySelector(".goog-te-combo");

            if (select) {

                select.value = lang;

                select.dispatchEvent(
                    new Event("change")
                );

                clearInterval(interval);

                if (done)
                    done();

            }

            tries++;

            if (tries >= maxTries) {

                clearInterval(interval);

                console.log(
                    "Button Sentraal: Google Translate not ready."
                );

            }

        }, 400);

    }

    // ==========================================
    // BUTTON EVENTS
    // ==========================================

    function registerEvents() {

        const button =
            document.getElementById(CONFIG.button.id);

        const text =
            document.getElementById("bs-language-text");

        if (!button || !text)
            return;

        let currentLang =
            localStorage.getItem(CONFIG.storageKey) || "en";

        // Restore previous language

        setTimeout(function () {

            if (currentLang === "af") {

                setLanguage("af");

                text.textContent =
                    CONFIG.button.afrikaans;

            } else {

                text.textContent =
                    CONFIG.button.english;

            }

        }, 1500);

        button.addEventListener("click", function (e) {

            e.preventDefault();

            text.textContent =
                CONFIG.button.loading;

            if (currentLang === "en") {

                setLanguage("af", function () {

                    currentLang = "af";

                    localStorage.setItem(
                        CONFIG.storageKey,
                        "af"
                    );

                    text.textContent =
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

        loadGoogleTranslate();

        registerEvents();

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