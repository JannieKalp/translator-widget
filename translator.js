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
    // STATE
    // ==========================================

    const STATE = {

        currentLanguage:
            localStorage.getItem(CONFIG.storageKey) || "en",

        button: null,

        translateContainer: null

    };

    // ==========================================
    // WAIT FOR DOM
    // ==========================================

    function ready(callback) {

        if (document.readyState === "loading") {

            document.addEventListener(
                "DOMContentLoaded",
                callback,
                { once: true }
            );

            return;

        }

        callback();

    }

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

.goog-te-gadget{
    font-size:0!important;
}

.goog-logo-link{
    display:none!important;
}

.goog-te-gadget span{
    display:none!important;
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

        if (!document.body) return;

        if (!document.getElementById("google_translate_element")) {

            STATE.translateContainer =
                document.createElement("div");

            STATE.translateContainer.id =
                "google_translate_element";

            document.body.appendChild(
                STATE.translateContainer
            );

        }

        if (!document.getElementById(CONFIG.button.id)) {

            STATE.button =
                document.createElement("button");

            STATE.button.id =
                CONFIG.button.id;

            STATE.button.textContent =
                STATE.currentLanguage === "af"
                ? CONFIG.button.afrikaans
                : CONFIG.button.english;

            document.body.appendChild(
                STATE.button
            );

        } else {

            STATE.button =
                document.getElementById(CONFIG.button.id);

        }

    }

    // ==========================================
    // GOOGLE TRANSLATE CALLBACK
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

        const script =
            document.createElement("script");

        script.id = "bs-google-script";

        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        document.head.appendChild(script);

    }
        // ==========================================
    // WAIT FOR GOOGLE TRANSLATE
    // ==========================================

    function waitForTranslate(callback) {

        let attempts = 0;

        function check() {

            const combo =
                document.querySelector(".goog-te-combo");

            if (combo) {

                callback(combo);
                return;

            }

            attempts++;

            if (attempts < 50) {

                setTimeout(check, 300);

            } else {

                console.warn(
                    "Button Sentraal: Google Translate did not initialise."
                );

            }

        }

        check();

    }

    // ==========================================
    // CHANGE LANGUAGE
    // ==========================================

    function setLanguage(language, callback) {

        waitForTranslate(function (combo) {

            combo.value = language;

            combo.dispatchEvent(
                new Event("change")
            );

            STATE.currentLanguage = language;

            localStorage.setItem(
                CONFIG.storageKey,
                language
            );

            updateButton();

            if (callback) {
                callback();
            }

        });

    }

    // ==========================================
    // UPDATE BUTTON
    // ==========================================

    function updateButton() {

        if (!STATE.button) return;

        if (STATE.currentLanguage === "af") {

            STATE.button.textContent =
                CONFIG.button.afrikaans;

        } else {

            STATE.button.textContent =
                CONFIG.button.english;

        }

    }



    // ==========================================
    // RESTORE SAVED LANGUAGE
    // ==========================================

    function restoreLanguage() {

        if (STATE.currentLanguage !== "af")
            return;

        setLanguage("af");

    }

    // ==========================================
    // BUTTON EVENTS
    // ==========================================

    function registerEvents() {

        STATE.button.addEventListener(
            "click",
            function () {

                STATE.button.textContent =
                    CONFIG.button.loading;

                if (STATE.currentLanguage === "en") {

                    setLanguage("af");

                } else {

                    waitForTranslate(function (combo) {

                        combo.value = "en";

                        combo.dispatchEvent(
                            new Event("change")
                        );

                        STATE.currentLanguage = "en";

                        localStorage.setItem(
                            CONFIG.storageKey,
                            "en"
                        );

                        updateButton();

                    });

                }

            }
        );

    }

    // ==========================================
    // START
    // ==========================================

    function start() {

    injectStyles();

    createHtml();

    loadGoogle();

    registerEvents();

    // Keep the button below the Google banner
    setInterval(updateButtonPosition, 500);

    // Give Google Translate a moment
    setTimeout(function () {

        restoreLanguage();

    }, 1000);

}

    // ==========================================
    // BOOT
    // ==========================================

    ready(start);

})();