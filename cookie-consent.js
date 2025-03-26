// cookie-consent.js
document.addEventListener("DOMContentLoaded", function () {
    // Este código se ejecuta cuando el DOM está completamente cargado.

    function initializeCookieConsent() {

        // ---------------------------
        // DETECTAR IDIOMA (Usando la class del body)
        // ---------------------------
        let isEnglish = document.body.classList.contains('is-english');

        // ---------------------------
        // CAMBIAR TEXTOS DEL COOKIE CONSENT SEGÚN EL IDIOMA
        // ---------------------------
        function updateCookieConsentText() {
            var popup = document.getElementById("cookie-consent-popup");
            var settingsModal = document.getElementById("cookie-settings-modal");

            if (!popup || !settingsModal) {
                console.warn("Cookie consent popup or settings modal not found.");
                return;
            }

            if (isEnglish) {
                // Cambiar el texto del popup si la página está en inglés.
                const popupParagraph = document.querySelector("#cookie-consent-popup p");
                if (popupParagraph) {
                    popupParagraph.innerHTML = 'We use cookies to enhance your browsing experience and analyze our traffic. <a href="https://www.antiguomesonfuentebuena.com/en/privacy-policy" target="_blank">Privacy Policy</a>';
                }

                const acceptAllButton = document.getElementById("cookie-accept-all");
                if (acceptAllButton) acceptAllButton.innerText = "Accept";

                const settingsButton = document.getElementById("cookie-settings-button");
                if (settingsButton) settingsButton.innerText = "Settings";

                const settingsModalHeader = document.querySelector("#cookie-settings-modal h3");
                if (settingsModalHeader) settingsModalHeader.innerText = "Cookie Settings";

                const settingsModalParagraph = document.querySelector("#cookie-settings-modal p");
                if (settingsModalParagraph) settingsModalParagraph.innerText = "Here you can customize your cookie preferences:";

                const functionalLabel = document.querySelector("label[for='functional-cookies']");
                if (functionalLabel) {
                    functionalLabel.innerHTML = '<input type="checkbox" id="functional-cookies" data-category="functional" checked disabled> Functional Cookies (Always Active)';
                }

                const analyticsLabel = document.querySelector("label[for='analytics-cookies']");
                if (analyticsLabel) {
                    analyticsLabel.innerHTML = '<input type="checkbox" id="analytics-cookies" data-category="analytics"> Analytics Cookies';
                }

                const marketingLabel = document.querySelector("label[for='marketing-cookies']");
                if (marketingLabel) {
                    marketingLabel.innerHTML = '<input type="checkbox" id="marketing-cookies" data-category="marketing"> Marketing Cookies';
                }

                const cookieDescriptions = document.querySelectorAll(".cookie-description");
                if (cookieDescriptions.length === 3) {
                    cookieDescriptions[0].innerText = "These cookies are essential for the website to function.";
                    cookieDescriptions[1].innerText = "They help us understand how you use the site to improve it.";
                    cookieDescriptions[2].innerText = "Used to show you personalized advertising.";
                }

                const saveSettingsButton = document.getElementById("cookie-save-settings");
                if (saveSettingsButton) saveSettingsButton.innerText = "Save Settings";

                const cancelSettingsButton = document.getElementById("cookie-cancel-settings");
                if (cancelSettingsButton) cancelSettingsButton.innerText = "Cancel";
            }
        }

        updateCookieConsentText(); // Llamamos a la función para cambiar los textos si es necesario

    }

    // ---------------------------
    // INICIALIZACIÓN DEL COOKIE CONSENT
    // ---------------------------
    initializeCookieConsent();


    // ---------------------------
    // COOKIE CONSENT
    // ---------------------------
    const popup = document.getElementById('cookie-consent-popup');
    const acceptAllButton = document.getElementById('cookie-accept-all');
    const settingsButton = document.getElementById('cookie-settings-button');
    const saveSettingsButton = document.getElementById('cookie-save-settings');
    const cancelSettingsButton = document.getElementById('cookie-cancel-settings');
    const settingsModal = document.getElementById('cookie-settings-modal');
    const consentBackground = document.getElementById('cookie-consent-background');
    const analyticsCheckbox = document.getElementById('analytics-cookies');
    const marketingCheckbox = document.getElementById('marketing-cookies');

    function showPopup() {
        if (popup) popup.style.display = 'block';
    }

    function hidePopup() {
        if (popup) popup.style.display = 'none';
    }

    function showSettingsModal() {
        if (settingsModal) settingsModal.style.display = 'block';
        if (consentBackground) consentBackground.style.display = 'block';
    }

    function hideSettingsModal() {
        if (settingsModal) settingsModal.style.display = 'none';
        if (consentBackground) consentBackground.style.display = 'none';
    }

    function saveCookiePreferences(analytics, marketing) {
        localStorage.setItem('cookieConsent', 'true');
        localStorage.setItem('analyticsConsent', analytics);
        localStorage.setItem('marketingConsent', marketing);
    }

    function getCookiePreferences() {
        return {
            consent: localStorage.getItem('cookieConsent') === 'true',
            analytics: localStorage.getItem('analyticsConsent') === 'true',
            marketing: localStorage.getItem('marketingConsent') === 'true'
        };
    }

    function applyCookiePreferences() {
        const preferences = getCookiePreferences();

        if (typeof gtag !== 'undefined') {
            gtag('consent', 'default', {
                'analytics_storage': preferences.analytics ? 'granted' : 'denied',
                'ad_storage': preferences.marketing ? 'granted' : 'denied'
            });
        } else {
            console.warn("gtag is not defined. Ensure Google Analytics is properly installed.");
        }
    }

    if (!getCookiePreferences().consent) {
        showPopup();
    } else {
        applyCookiePreferences();
    }

    if (acceptAllButton) {
        acceptAllButton.addEventListener('click', function () {
            saveCookiePreferences(true, true);
            applyCookiePreferences();
            hidePopup();
        });
    }

    if (settingsButton) {
        settingsButton.addEventListener('click', function () {
            showSettingsModal();
            const preferences = getCookiePreferences();
            if (analyticsCheckbox) analyticsCheckbox.checked = preferences.analytics;
            if (marketingCheckbox) marketingCheckbox.checked = preferences.marketing;
        });
    }

    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function () {
            const analytics = analyticsCheckbox ? analyticsCheckbox.checked : false;
            const marketing = marketingCheckbox ? marketingCheckbox.checked : false;

            saveCookiePreferences(analytics, marketing);
            applyCookiePreferences();
            hideSettingsModal();
            hidePopup();
        });
    }

    if (cancelSettingsButton) {
        cancelSettingsButton.addEventListener('click', function () {
            hideSettingsModal();
        });
    }
});
