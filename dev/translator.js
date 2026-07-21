(function () {

    "use strict";

    // ==========================================
    // PREVENT LOADING TWICE
    // ==========================================

    if (window.ButtonSentraalTranslator)
        return;

    window.ButtonSentraalTranslator = true;

    // ==========================================
    // CONFIG
    // ==========================================

    const CONFIG = {

        pageLanguage: "en",

        includedLanguages: "en,es,af",

        defaultLanguage: "af",

        storageKey: "button-sentraal-language",

        googleContainer: "button-sentraal-google",

        spanishButton: {

            text: "🇪🇸 Watch in Spanish",

            active: "🇬🇧 View in English",

            background: "#0b7fab",

            color: "#ffffff"

        },

        afrikaansButton: {

            id: "bs-afrikaans-btn",

            text: "🇿🇦 Afrikaans",

            active: "🇬🇧 English",

            background: "#feb81c",

            color: "#000000",

            bottom: 20,

            left: 20

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

/* =====================================
   HIDE GOOGLE TRANSLATE
===================================== */

#${CONFIG.googleContainer}{

    position:absolute!important;
    left:-9999px!important;
    top:-9999px!important;
    visibility:hidden!important;

}

.goog-te-banner-frame,
.goog-te-balloon-frame,
.goog-logo-link,
.goog-tooltip,
.goog-text-highlight{

    display:none!important;

}

body{

    top:0!important;

}

/* =====================================
   SPANISH BUTTON
===================================== */

.bs-spanish-btn{

    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:10px;

    background:${CONFIG.spanishButton.background};
    color:${CONFIG.spanishButton.color};

    padding:16px 24px;

    border:none;
    border-radius:10px;

    cursor:pointer;

    font-family:Arial, Helvetica, sans-serif;
    font-size:16px;
    font-weight:600;

    text-decoration:none;
    box-sizing:border-box;

    transition:.25s;

}

.bs-spanish-btn:hover{

    opacity:.95;

}

/* =====================================
   AFRIKAANS BUTTON
===================================== */

#${CONFIG.afrikaansButton.id}{

    position:fixed;

    bottom:${CONFIG.afrikaansButton.bottom}px;
    left:${CONFIG.afrikaansButton.left}px;

    z-index:999999;

    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;

    background:${CONFIG.afrikaansButton.background};
    color:${CONFIG.afrikaansButton.color};

    padding:10px 16px;

    border:none;
    border-radius:8px;

    cursor:pointer;

    font-family:Arial, Helvetica, sans-serif;
    font-size:14px;
    font-weight:600;

    box-shadow:0 6px 18px rgba(0,0,0,.20);

    transition:.25s;

}

#${CONFIG.afrikaansButton.id}:hover{

    transform:translateY(-2px);

}

`;

        document.head.appendChild(style);

    }

    // ==========================================
    // CREATE HTML
    // ==========================================

    function createHtml() {

        // Hidden Google Translate container

        if (!document.getElementById(CONFIG.googleContainer)) {

            const google = document.createElement("div");

            google.id = CONFIG.googleContainer;

            document.body.appendChild(google);

        }

        // Spanish buttons

        document.querySelectorAll(".bs-translator").forEach(function (container) {

            if (container.querySelector(".bs-spanish-btn"))
                return;

            const button = document.createElement("button");

            button.type = "button";

            button.className = "bs-spanish-btn";

            button.dataset.language = "es";

            button.innerHTML = `
                <span>🌐</span>
                <span class="bs-spanish-text">
                    ${CONFIG.spanishButton.text}
                </span>
            `;

            container.appendChild(button);

        });

        // Floating Afrikaans button

        if (!document.getElementById(CONFIG.afrikaansButton.id)) {

            const button = document.createElement("button");

            button.type = "button";

            button.id = CONFIG.afrikaansButton.id;

            button.dataset.language = "af";

            button.innerHTML = `
                <span>🌐</span>
                <span id="bs-afrikaans-text">
                    ${CONFIG.afrikaansButton.text}
                </span>
            `;

            document.body.appendChild(button);

        }

    }
    // ==========================================
    // LOAD GOOGLE TRANSLATE
    // ==========================================

    function loadGoogleTranslate() {

        if (document.getElementById("bs-google-script"))
            return;

        const script = document.createElement("script");

        script.id = "bs-google-script";

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

            includedLanguages: CONFIG.includedLanguages,

            autoDisplay: false,

            multilanguagePage: false

        }, CONFIG.googleContainer);

    };

    // ==========================================
    // WAIT FOR GOOGLE
    // ==========================================

    function waitForTranslate(callback) {

        let attempts = 0;

        function check() {

            const select =
                document.querySelector(".goog-te-combo");

            if (select) {

                callback(select);
                return;

            }

            attempts++;

            if (attempts < 50) {

                setTimeout(check, 300);

            }

        }

        check();

    }

    // ==========================================
    // APPLY LANGUAGE
    // ==========================================

    function applyLanguage(lang, callback) {

        waitForTranslate(function (select) {

            select.value = lang;

            select.dispatchEvent(
                new Event("change")
            );

            if (callback)
                callback();

        });

    }
    // ==========================================
    // UPDATE BUTTONS
    // ==========================================

    function updateButtons(lang) {

        // Spanish buttons

        document
            .querySelectorAll(".bs-spanish-text")
            .forEach(function (text) {

                text.textContent =
                    (lang === "es")
                    ? CONFIG.spanishButton.active
                    : CONFIG.spanishButton.text;

            });

        // Afrikaans button

        const afText =
            document.getElementById("bs-afrikaans-text");

        if (afText) {

            afText.textContent =
                (lang === "af")
                ? CONFIG.afrikaansButton.active
                : CONFIG.afrikaansButton.text;

        }

    }

    // ==========================================
    // CHANGE LANGUAGE
    // ==========================================

    function changeLanguage(lang) {

        applyLanguage(lang, function () {

            localStorage.setItem(
                CONFIG.storageKey,
                lang
            );

            updateButtons(lang);

        });

    }

    // ==========================================
    // TOGGLE LANGUAGE
    // ==========================================

    function toggleLanguage(targetLanguage) {

        const current =
            localStorage.getItem(CONFIG.storageKey) || "en";

        if (current === targetLanguage) {

            changeLanguage("en");

        } else {

            changeLanguage(targetLanguage);

        }

    }
    // ==========================================
    // REGISTER BUTTON EVENTS
    // ==========================================

    function registerButtons() {

        // Spanish buttons

        document
            .querySelectorAll(".bs-spanish-btn")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    const text =
                        button.querySelector(".bs-spanish-text");

                    text.textContent = "Switching...";

                    toggleLanguage("es");

                });

            });

        // Afrikaans button

        const afButton =
            document.getElementById(
                CONFIG.afrikaansButton.id
            );

        if (afButton) {

            afButton.addEventListener("click", function () {

                const text =
                    document.getElementById(
                        "bs-afrikaans-text"
                    );

                text.textContent = "Switching...";

                toggleLanguage("af");

            });

        }

    }

    // ==========================================
    // RESTORE SAVED LANGUAGE
    // ==========================================

    function restoreLanguage() {

        let lang =
            localStorage.getItem(
                CONFIG.storageKey
            );

        // First visit

        if (!lang) {

            lang =
                CONFIG.defaultLanguage;

        }

        localStorage.setItem(
            CONFIG.storageKey,
            lang
        );

        setTimeout(function () {

            changeLanguage(lang);

        }, 1500);

    }
    // ==========================================
    // START
    // ==========================================

    function start() {

        injectStyles();

        createHtml();

        loadGoogleTranslate();

        registerButtons();

        restoreLanguage();

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