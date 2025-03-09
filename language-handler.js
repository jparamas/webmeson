// language-handler.js
document.addEventListener("DOMContentLoaded", function () {

    // REDIRECCIÓN AUTOMÁTICA POR IDIOMA (Solo en Home en español "/")
    var path = window.location.pathname;
    let isEnglish = document.body.classList.contains('is-english');


    if ((path === "/" || path === "/index.html") && !isEnglish) { // Solo en la home en español
        var userPreference = localStorage.getItem("userLang");

        if (!userPreference) { // Solo redirigir si NO hay preferencia guardada
            var userLang = navigator.language || navigator.userLanguage;
            userLang = userLang.substring(0, 2);

            if (userLang === "en") {
                localStorage.setItem("userLang", "en"); // Guardamos la preferencia
                window.location.href = "https://meson-fuentebuena.webflow.io/en";
            } else {
                localStorage.setItem("userLang", "es"); // Guardamos español como preferido
            }
        }
    }

    // FUNCIÓN PARA CAMBIAR DE IDIOMA
    window.changeLanguage = function (lang) {
        localStorage.setItem("userLang", lang); // Guardar la preferencia del usuario

        if (lang === "en" && !window.location.href.includes("/en")) {
            window.location.href = "https://meson-fuentebuena.webflow.io/en";
        } else if (lang === "es" && window.location.href.includes("/en")) {
            window.location.href = "https://meson-fuentebuena.webflow.io/";
        }
    };
});
