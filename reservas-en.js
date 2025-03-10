document.addEventListener("DOMContentLoaded", function () {
    // 📌 Elementos del DOM
    const fechaInput = document.getElementById("fecha");
    const horasRadios = document.querySelectorAll('input[name="hora"]');
    const telefonoInput = document.getElementById("telefono");
    const form = document.getElementById("wf-form-reservas-ES");
    const categoriaInput = document.getElementById("categoria"); // 📌 Input oculto de categoría
    const formAlerts = document.getElementById("form-alerts");
    const availabilityMessage = document.getElementById("availability-message"); // 📌 Nuevo div para alertas de disponibilidad


    // 📌 Lista completa de países soportados para validación de teléfono
    const supportedCountries = [
        "ES", "FR", "DE", "IT", "PT", "IE", "NL", "BE", "LU", "AT", "SE", "FI", "DK", "NO", "CH", 
        "PL", "CZ", "SK", "HU", "RO", "BG", "GR", "CY", "MT", "LT", "LV", "EE", "HR", "SI", "US"
    ];

    // 📌 Fechas permitidas (en formato europeo e ISO)
    const fechasPermitidas = ["02-03-2025", "03-03-2025", "13-04-2025", "14-04-2025", "15-04-2025", "16-04-2025", "17-04-2025"];
    const fechasPermitidasISO = fechasPermitidas.map(fecha => {
        const [day, month, year] = fecha.split("-");
        return `${year}-${month}-${day}`;
    });

    // 📌 Horas bloqueadas generales
    const horasBloqueadas = ["14:30", "15:00"]; 

    // 📌 Horas bloqueadas por fecha específica
    const horasBloqueadasPorFecha = {
        "2025-04-17": ["13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "20:30", "20:45",
    "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30"]
    };

    let flatpickrInstance; // Store the Flatpickr instance


    // 📌 Inicialización de Flatpickr (Calendario)
    flatpickrInstance = flatpickr(fechaInput, {
        enableTime: false,
        dateFormat: "Y-m-d",
        minDate: "today",
        locale: "es",
        inline: true,
        disable: [
            function (date) {
                const fechaISO = date.toISOString().split("T")[0];
                if (fechasPermitidasISO.includes(fechaISO)) return false;
                return [1, 2, 3, 4].includes(date.getDay()); // Bloquear lunes a jueves
            }
        ],
        onChange: function (selectedDates, dateStr, instance) {
            actualizarHorasDisponibles();
            if(selectedDates.length > 0){
                availabilityMessage.style.display = "none"; // clear the alerts
            }
        },
        onClose: function(selectedDates, dateStr, instance){

             if(selectedDates.length === 0){
                    availabilityMessage.innerHTML = `<p style="color: red;">⚠️ Día cerrado. Por favor, elige otra fecha.</p>`;
                    availabilityMessage.style.display = "block";
                    fechaInput.value = ""; // clear the date
             }
        }
    });

    // 📌 Validación y formateo de teléfono
    telefonoInput.addEventListener("blur", function () {
        let telefono = telefonoInput.value.trim();
        let validNumber = false;

        if (telefono) {
            for (const country of supportedCountries) {
                try {
                    let phoneNumber = libphonenumber.parsePhoneNumberFromString(telefono, country);
                    if (phoneNumber && phoneNumber.isValid()) {
                        validNumber = true;
                        telefonoInput.value = phoneNumber.formatInternational();
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }
        }

        if (!validNumber) {
            telefonoInput.value = "";
        }
    });

    // 📌 Función para actualizar las horas disponibles
     function actualizarHorasDisponibles() {
        const fechaSeleccionada = fechaInput.value;
        if (!fechaSeleccionada) {
            // Clear hour selection and category if date is cleared
            horasRadios.forEach(radio => {
                radio.checked = false;
            });
            categoriaInput.value = "";
            availabilityMessage.style.display = "none";  // Hide previous alerts
            return;
        }

        const fechaHoy = new Date();
        const fechaSeleccionadaDate = new Date(fechaSeleccionada + "T00:00:00");

        let comidaDisponible = false;
        let cenaDisponible = false;
        let algunaHoraDisponible = false;

        horasRadios.forEach(radio => {
            const hora = radio.value;
            const [h, m] = hora.split(":").map(Number);
            const horaCompleta = new Date(fechaSeleccionadaDate);
            horaCompleta.setHours(h, m, 0, 0);

            let bloquear = false;

            // 📌 Bloquear horas si la fecha es hoy y la hora ya pasó
            if (fechaSeleccionadaDate.toDateString() === fechaHoy.toDateString() && horaCompleta < fechaHoy) {
                bloquear = true;
            }

            // 📌 Bloquear horas generales
            if (horasBloqueadas.includes(hora)) {
                bloquear = true;
            }

            // 📌 Bloquear horas específicas por fecha
            if (horasBloqueadasPorFecha[fechaSeleccionada] && horasBloqueadasPorFecha[fechaSeleccionada].includes(hora)) {
                bloquear = true;
            }

            // 📌 Bloquear horas en domingo después de las 20:30
            if (fechaSeleccionadaDate.getDay() === 0 && ["20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30"].includes(hora)) {
                bloquear = true;
            }

            // 📌 Aplicar bloqueo visualmente
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
            availabilityMessage.innerHTML = `<p style="color: red;">⚠️ No hay disponibilidad para la fecha seleccionada.</p>`;
            availabilityMessage.style.display = "block";
        } else if (!comidaDisponible) {
            availabilityMessage.innerHTML = `<p style="color: red;">⚠️ No hay disponibilidad en horario de comidas.</p>`;
            availabilityMessage.style.display = "block";
        } else if (!cenaDisponible) {
            availabilityMessage.innerHTML = `<p style="color: red;">⚠️ No hay disponibilidad en horario de cenas.</p>`;
            availabilityMessage.style.display = "block";
        }else {
             availabilityMessage.style.display = "none";
        }
    }

    fechaInput.addEventListener("change", actualizarHorasDisponibles);


     // add a listener to flatpickr `Clear` button
    const clearButton = document.querySelector(".flatpickr-clear");
    if(clearButton){
        clearButton.addEventListener("click", function(){
           fechaInput.value = "";
            actualizarHorasDisponibles();
        });
    }
    actualizarHorasDisponibles();


     // 📌 Categorizar automáticamente según la hora seleccionada
     horasRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            const horaSeleccionada = radio.value;
            const horaNumerica = parseInt(horaSeleccionada.split(":")[0], 10);

            // 📌 Si la hora es antes de las 16:00 → COMIDA, si no → CENA
            if (horaNumerica < 16) {
                categoriaInput.value = "COMIDA";
            } else {
                categoriaInput.value = "CENA";
            }
        });
    });





    // 📌 Validación del formulario antes del envío
    form.addEventListener("submit", function (event) {
        let isValid = true;
        const messages = [];
        const telefono = telefonoInput.value.trim();
        const checkbox = document.getElementById("checkbox").checked;
        const horaSeleccionada = document.querySelector('input[name="hora"]:checked');
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const email = document.getElementById("email").value.trim();
        const personas = document.getElementById("personas").value.trim();
        const fecha = fechaInput.value.trim();
        const categoria = categoriaInput.value.trim();

        if (!fecha) {
            messages.push("⚠️ Por favor, selecciona una fecha.");
            isValid = false;
        }

        if (!horaSeleccionada) {
            messages.push("⚠️ Por favor, selecciona una hora.");
            isValid = false;
        }

        if (nombre.length < 2) {
            messages.push("⚠️ El nombre debe tener al menos 2 caracteres.");
            isValid = false;
        }

        if (apellido.length < 2) {
            messages.push("⚠️ El apellido debe tener al menos 2 caracteres.");
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            messages.push("⚠️ Ingresa un correo electrónico válido.");
            isValid = false;
        }

        if (!personas || isNaN(personas) || personas < 1) {
            messages.push("⚠️ Selecciona un número válido de personas.");
            isValid = false;
        }

        if (!telefono) {
            messages.push("⚠️ Ingresa un número de teléfono válido.");
            isValid = false;
        }

        if (!checkbox) {
            messages.push("⚠️ Debes aceptar las condiciones de privacidad.");
            isValid = false;
        }
      
        /*
        if (!categoria) {
            messages.push("⚠️ La categoría no es válida.");
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
