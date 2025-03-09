// swiper-initializer.js
document.addEventListener("DOMContentLoaded", function () {
    // SWIPER INITIALIZATION (Solo en Home en español "/" e inglés "/en")
    var path = window.location.pathname;
    // Define las URLs exactas para las páginas de inicio
    var isHomePageSpanish = path === "/" || path === "/index.html";
    var isHomePageEnglish = path === "/en";

    if ((isHomePageSpanish || isHomePageEnglish)) { //Si estoy en la home y en el idioma correcto

        function initSwiper(selector, options) {
            const swiperElement = document.querySelector(selector);
            if (swiperElement) {
                return new Swiper(selector, options);
            } else {
                console.warn(`Swiper element with selector "${selector}" not found.`);
                return null;
            }
        }

        function waitForSwiper(callback) {
            if (typeof Swiper !== "undefined") {
                callback();
            } else {
                setTimeout(() => waitForSwiper(callback), 100);
            }
        }

        waitForSwiper(() => {
            initSwiper('.swiper.is-home-header', {
                loop: true,
                effect: 'fade',
                fadeEffect: { crossFade: true },
                autoplay: {
                    delay: 1600,
                    disableOnInteraction: false
                },
                simulateTouch: true,
                grabCursor: true,
                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                }
            });

            initSwiper(".swiper.is-home-food", {
                slidesPerView: 1,
                spaceBetween: 16,
                loop: true,
                keyboard: { enabled: true },
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                navigation: {
                    nextEl: ".home-food_next-nav",
                    prevEl: ".home-food_prev-nav"
                },
                breakpoints: {
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 16
                    },
                    1220: {
                        slidesPerView: 4,
                        spaceBetween: 16
                    }
                }
            });
        });
    }
});
