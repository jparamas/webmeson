document.addEventListener("DOMContentLoaded", function () {
    // ----------------------------------------------------------------------
    // 1. Obtención de Elementos del DOM
    // ----------------------------------------------------------------------

    const dateInput = document.getElementById("date-en");
    const hourRadios = document.querySelectorAll('input[name="hora"]');
    const phoneInput = document.getElementById("phone-en");
    const form = document.getElementById("wf-form-reservas-EN");
    const categoryInput = document.getElementById("category-en"); // Input oculto de categoría
    const formAlerts = document.getElementById("form-alerts-en");
    const availabilityMessage = document.getElementById("availability-message-en");

    // ----------------------------------------------------------------------
    // 2. Configuración Inicial: Constantes y Datos
    // ----------------------------------------------------------------------

    // Lista completa de países soportados para la validación del teléfono
    const supportedCountries = [
        "ES", "FR", "DE", "IT", "PT", "IE", "NL", "BE", "LU", "AT", "SE", "FI", "DK", "NO", "CH",
        "PL", "CZ", "SK", "HU", "RO", "BG", "GR", "CY", "MT", "LT", "LV", "EE", "HR", "SI", "US"
    ];

    // Fechas permitidas para la reserva (en formato europeo e ISO) - KEEP THESE IN SPANISH
    const fechasPermitidas = ["02-03-2025", "03-03-2025", "13-04-2025", "14-04-2025", "15-04-2025", "16-04-2025", "17-04-2025"];
    const fechasPermitidasISO = fechasPermitidas.map(fecha => {
        const [day, month, year] = fecha.split("-");
        return `${year}-${month}-${day}`;
    });

    // Horas bloqueadas generales - KEEP THESE IN SPANISH
    const horasBloqueadas = ["14:30", "15:00"];

    // Horas bloqueadas por fecha específica - KEEP THESE IN SPANISH
    const horasBloqueadasPorFecha = {
        "2025-04-17": ["13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45",
            "15:00", "15:15", "15:30", "20:30", "20:45",
            "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30"]
    };

    // ----------------------------------------------------------------------
    // 3. Inicialización de Flatpickr (Calendario)
    // ----------------------------------------------------------------------

    // Crear configuración regional personalizada para el lunes como primer día
    const customEnglish = {
        firstDayOfWeek: 1
    };
    flatpickr.localize(customEnglish);

    let flatpickrInstance = flatpickr(dateInput, {
        enableTime: false,
        dateFormat: "Y-m-d",
        minDate: "today",
        //locale: "en", // Configuración regional en inglés
        inline: true,
        firstDayOfWeek: 1, // Esto es redundante, pero lo dejo por claridad. La configuración global tiene prioridad
        disable: [
            function (date) {
                const fechaISO = date.toISOString().split("T")[0];
                if (fechasPermitidasISO.includes(fechaISO)) return false;
                return [1, 2, 3, 4].includes(date.getDay()); // Bloquear lunes a jueves
            }
        ],
        onChange: function (selectedDates, dateStr, instance) {
            updateAvailableHours();
            if (selectedDates.length > 0) {
                availabilityMessage.style.display = "none"; // clear the alerts
            }
        },
        onClose: function (selectedDates, dateStr, instance) {
            if (selectedDates.length === 0) {
                availabilityMessage.innerHTML = `<p style="color: red;">⚠️ Closed day. Please choose another date.</p>`;
                availabilityMessage.style.display = "block";
                dateInput.value = ""; // clear the date
            }
        }
    });

    // ----------------------------------------------------------------------
    // 4. Validación del Teléfono (Función Anónima con Listener)
    // ----------------------------------------------------------------------

    phoneInput.addEventListener("blur", function () {
        let phone = phoneInput.value.trim();
        let validNumber = false;

        if (phone) {
            for (const country of supportedCountries) {
                try {
                    let phoneNumber = libphonenumber.parsePhoneNumberFromString(phone, country);
                    if (phoneNumber && phoneNumber.isValid()) {
                        validNumber = true;
                        phoneInput.value = phoneNumber.formatInternational();
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }
        }

        if (!validNumber) {
            phoneInput.value = "";
        }
    });

    // ----------------------------------------------------------------------
    // 5. Función para Actualizar las Horas Disponibles
    // ----------------------------------------------------------------------

    function updateAvailableHours() {
        const fechaSeleccionada = dateInput.value;
        if (!fechaSeleccionada) {
            // Clear hour selection and category if date is cleared
            hourRadios.forEach(radio => {
                radio.checked = false;
            });
            categoryInput.value = "";
            availabilityMessage.style.display = "none";  // Hide previous alerts
            return;
        }

        const fechaHoy = new Date();
        const fechaSeleccionadaDate = new Date(fechaSeleccionada + "T00:00:00");

        let comidaDisponible = false;
        let cenaDisponible = false;
        let algunaHoraDisponible = false;

        hourRadios.forEach(radio => {
            const hora = radio.value;
            const [h, m] = hora.split(":").map(Number);
            const horaCompleta = new Date(fechaSeleccionadaDate);
            horaCompleta.setHours(h, m, 0, 0);

            let bloquear = false;

            // Bloquear horas si la fecha es hoy y la hora ya pasó
            if (fechaSeleccionadaDate.toDateString() === fechaHoy.toDateString() && horaCompleta < fechaHoy) {
                bloquear = true;
            }

            // Bloquear horas generales
            if (horasBloqueadas.includes(hora)) {
                bloquear = true;
            }

            // Bloquear horas específicas por fecha
            if (horasBloqueadasPorFecha[fechaSeleccionada] && horasBloqueadasPorFecha[fechaSeleccionada].includes(hora)) {
                bloquear = true;
            }

            // Bloquear horas en domingo después de las 20:30
            if (fechaSeleccionadaDate.getDay() === 0 && ["20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30"].includes(hora)) {
                bloquear = true;
            }

            // Aplicar bloqueo visualmente
            radio.disabled = bloquear;
            radio.parentElement.style.opacity = bloquear ? "0.5" : "1";

            if (!bloquear) {
                algunaHoraDisponible = true;
                const horaNumerica = parseInt(hora.split(":")[0], 10);
                if (horaNumerica < 16) {
                    comidaDisponible = true;
                } else {
                    cenaDisponible = true;
                }
            }
        });

        // Mostrar alertas si no hay disponibilidad
        if (!algunaHoraDisponible) {
            availabilityMessage.innerHTML = `<p style="color: red;">⚠️ There is no availability for the selected date.</p>`;
            availabilityMessage.style.display = "block";
        } else if (!comidaDisponible) {
            availabilityMessage.innerHTML = `<p style="color: red;">⚠️ There is no availability for lunch.</p>`;
            availabilityMessage.style.display = "block";
        } else if (!cenaDisponible) {
            availabilityMessage.innerHTML = `<p style="color: red;">⚠️ There is no availability for dinner.</p>`;
            availabilityMessage.style.display = "block";
        } else {
            availabilityMessage.style.display = "none";
        }
    }

    // Llamada inicial para establecer las horas disponibles al cargar la página
    updateAvailableHours();

    // Listener para actualizar las horas disponibles al cambiar la fecha
    dateInput.addEventListener("change", updateAvailableHours);

    // add a listener to flatpickr `Clear` button
    const clearButton = document.querySelector(".flatpickr-clear");
    if (clearButton) {
        clearButton.addEventListener("click", function () {
            dateInput.value = "";
            updateAvailableHours();
        });
    }

    // ----------------------------------------------------------------------
    // 6. Categorización Automática (Comida/Cena)
    // ----------------------------------------------------------------------

    hourRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            const horaSeleccionada = radio.value;
            const horaNumerica = parseInt(horaSeleccionada.split(":")[0], 10);

            // Si la hora es antes de las 16:00 → COMIDA, si no → CENA
            if (horaNumerica < 16) {
                categoryInput.value = "COMIDA";
            } else {
                categoryInput.value = "CENA";
            }
        });
    });

    // ----------------------------------------------------------------------
    // 7. Validación del Formulario (Función Anónima con Listener)
    // ----------------------------------------------------------------------

    form.addEventListener("submit", function (event) {
        let isValid = true;
        const messages = [];
        const phone = phoneInput.value.trim();
        const checkbox = document.getElementById("privacy-en").checked;
        const horaSeleccionada = document.querySelector('input[name="hora"]:checked');
        const nombre = document.getElementById("name-en").value.trim();
        const apellido = document.getElementById("lastName-en").value.trim();
        const email = document.getElementById("email-en").value.trim();
        const personas = document.getElementById("guests-en").value.trim();
        const fecha = dateInput.value.trim();
        const categoria = categoryInput.value.trim();

        if (!fecha) {
            messages.push("⚠️ Please select a date.");
            isValid = false;
        }

        if (!horaSeleccionada) {
            messages.push("⚠️ Please select a time.");
            isValid = false;
        }

        if (nombre.length < 2) {
            messages.push("⚠️ The name must be at least 2 characters long.");
            isValid = false;
        }

        if (apellido.length < 2) {
            messages.push("⚠️ The last name must be at least 2 characters long.");
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            messages.push("⚠️ Enter a valid email address.");
            isValid = false;
        }

        if (!personas || isNaN(personas) || personas < 1) {
            messages.push("⚠️ Select a valid number of people.");
            isValid = false;
        }

        if (!phone) {
            messages.push("⚠️ Enter a valid phone number.");
            isValid = false;
        }

        if (!checkbox) {
            messages.push("⚠️ You must accept the privacy policy.");
            isValid = false;
        }

        /*        
        if (!categoria) {
            messages.push("⚠️ The category is not valid.");
            isValid = false;
        }
        */

        if (!isValid) {
            event.preventDefault();
            event.stopPropagation();
            formAlerts.innerHTML = messages.map(msg => `<p style="color: red;">${msg}</p>`).join("");
            formAlerts.style.display = "block";
            return false;
        }
    });
});
