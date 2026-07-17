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

        includedLanguages: "en,es,af",

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

        // -------------------------------
        // Hidden Google Translate Container
        // -------------------------------

        if (!document.getElementById(CONFIG.googleContainer)) {

            const google = document.createElement("div");

            google.id = CONFIG.googleContainer;

            document.body.appendChild(google);

        }

        // -------------------------------
        // Create Spanish Buttons
        // -------------------------------

        document.querySelectorAll(".bs-translator").forEach(function (container) {

            if (container.querySelector(".bs-spanish-btn"))
                return;

            const button = document.createElement("button");

            button.className = "bs-spanish-btn";

            button.type = "button";

            button.innerHTML = `
                <span>🌐</span>
                <span class="bs-spanish-text">
                    ${CONFIG.spanishButton.text}
                </span>
            `;

            container.appendChild(button);

        });

        // -------------------------------
        // Create Afrikaans Floating Button
        // -------------------------------

        if (!document.getElementById(CONFIG.afrikaansButton.id)) {

            const button = document.createElement("button");

            button.id = CONFIG.afrikaansButton.id;

            button.type = "button";

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
    // CHANGE LANGUAGE
    // ==========================================

    function setLanguage(lang, callback) {

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
    // SPANISH BUTTON EVENTS
    // ==========================================

    function registerSpanishButtons() {

        document.querySelectorAll(".bs-spanish-btn")
            .forEach(function (button) {

                const text =
                    button.querySelector(".bs-spanish-text");

                button.addEventListener("click", function () {

                    let lang =
                        localStorage.getItem(CONFIG.storageKey) || "en";

                    text.textContent = "Switching...";

                    if (lang !== "es") {

                        setLanguage("es", function () {

                            localStorage.setItem(
                                CONFIG.storageKey,
                                "es"
                            );

                            text.textContent =
                                CONFIG.spanishButton.active;

                        });

                    } else {

                        setLanguage("en", function () {

                            localStorage.setItem(
                                CONFIG.storageKey,
                                "en"
                            );

                            text.textContent =
                                CONFIG.spanishButton.text;

                        });

                    }

                });

            });

    }

    // ==========================================
    // AFRIKAANS BUTTON EVENTS
    // ==========================================

    function registerAfrikaansButton() {

        const button =
            document.getElementById(
                CONFIG.afrikaansButton.id
            );

        if (!button)
            return;

        const text =
            document.getElementById(
                "bs-afrikaans-text"
            );

        button.addEventListener("click", function () {

            let lang =
                localStorage.getItem(CONFIG.storageKey) || "en";

            text.textContent =
                "Switching...";

            if (lang !== "af") {

                setLanguage("af", function () {

                    localStorage.setItem(
                        CONFIG.storageKey,
                        "af"
                    );

                    text.textContent =
                        CONFIG.afrikaansButton.active;

                });

            } else {

                setLanguage("en", function () {

                    localStorage.setItem(
                        CONFIG.storageKey,
                        "en"
                    );

                    text.textContent =
                        CONFIG.afrikaansButton.text;

                });

            }

        });

    }
        // ==========================================
    // RESTORE PREVIOUS LANGUAGE
    // ==========================================

    function restoreLanguage() {

        const lang =
            localStorage.getItem(CONFIG.storageKey) || "en";

        setTimeout(function () {

            if (lang === "es") {

                setLanguage("es");

                document.querySelectorAll(".bs-spanish-text")
                    .forEach(function (text) {

                        text.textContent =
                            CONFIG.spanishButton.active;

                    });

            }

            if (lang === "af") {

                setLanguage("af");

                const text =
                    document.getElementById(
                        "bs-afrikaans-text"
                    );

                if (text) {

                    text.textContent =
                        CONFIG.afrikaansButton.active;

                }

            }

        }, 1500);

    }

    // ==========================================
    // START
    // ==========================================

    function start() {

        injectStyles();

        createHtml();

        loadGoogleTranslate();

        registerSpanishButtons();

        registerAfrikaansButton();

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