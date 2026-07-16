(function () {
    "use strict";

    // Prevent loading twice
    if (window.ASpanWebinarLoaded) return;
    window.ASpanWebinarLoaded = true;

    // ==========================================
    // CONFIG
    // ==========================================

    const CONFIG = {

    webinarUrl:
        "https://weeklikse-webinar.systeme.io/webinar",

    imageUrl:
        "https://d1yei2z3i6k35z.cloudfront.net/5437503/6a58b7379ea7f9.10929008_a-span-weeklikse-webinar22.png",

    buttonId: "weekly-webinar-btn",

    bottom: 48,

    right: 12,

    desktopWidth: 140,

    mobileWidth: 120

};

    // ==========================================
    // CREATE CSS
    // ==========================================

    function injectStyles() {

        if (document.getElementById("a-span-webinar-style"))
            return;

        const style = document.createElement("style");

        style.id = "a-span-webinar-style";

        style.textContent = `

#${CONFIG.buttonId}{

    position:fixed;

    bottom:${CONFIG.bottom}px;

    right:${CONFIG.right}px;

    z-index:999999;

    transition:transform .25s ease;

}

#${CONFIG.buttonId}:hover{

    transform:scale(1.05);

}

#${CONFIG.buttonId} img{

    width:${CONFIG.desktopWidth}px;

    max-width:35vw;

    height:auto;

    display:block;

    border:none;

}

@media (max-width:768px){

    #${CONFIG.buttonId}{

        bottom:45px;

        right:10px;

    }

    #${CONFIG.buttonId} img{

        width:${CONFIG.mobileWidth}px;

    }

}

`;

        document.head.appendChild(style);

    }

        // ==========================================
    // CREATE BUTTON
    // ==========================================

    function createButton() {

        if (document.getElementById(CONFIG.buttonId))
            return;

        const link = document.createElement("a");

        link.id = CONFIG.buttonId;

        link.href = CONFIG.webinarUrl;

        link.target = "_blank";

        link.rel = "noopener";

        const image = document.createElement("img");

        image.src = CONFIG.imageUrl;

        image.alt = "Join our Weekly Webinar";

        link.appendChild(image);

        document.body.appendChild(link);

    }

        // ==========================================
    // START
    // ==========================================

    function start() {

        injectStyles();

        createButton();

    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    } else {

        start();

    }

})();