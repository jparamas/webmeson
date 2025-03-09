document.addEventListener("DOMContentLoaded", function () {
    // 📌 Elementos del DOM (Existing code - NO CHANGE)
    const fechaInput = document.getElementById("fecha");
    const horasRadios = document.querySelectorAll('input[name="hora"]');
    const telefonoInput = document.getElementById("telefono");
    const form = document.getElementById("wf-form-reservas-ES");
    const categoriaInput = document.getElementById("categoria"); // 📌 Input oculto de categoría
    const formAlerts = document.getElementById("form-alerts");
    const availabilityMessage = document.getElementById("availability-message");

    // 📌 Lista completa de países soportados para validación de teléfono (Existing code - NO CHANGE)
    const supportedCountries = [ /* ... */ ];

    // 📌 Fechas permitidas (en formato europeo e ISO) (Existing code - NO CHANGE)
    const fechasPermitidas = [ /* ... */ ];
    const fechasPermitidasISO = fechasPermitidas.map(fecha => { /* ... */ });

    // 📌 Horas bloqueadas generales (Existing code - NO CHANGE)
    const horasBloqueadas = [ /* ... */ ];

    // 📌 Horas bloqueadas por fecha específica (Existing code - NO CHANGE)
    const horasBloqueadasPorFecha = { /* ... */ };

    let flatpickrInstance; // Store the Flatpickr instance

    // 📌 Inicialización de Flatpickr (Calendario) (Existing code - NO CHANGE)
    flatpickrInstance = flatpickr(fechaInput, { /* ... */ });

    // 📌 Validación y formateo de teléfono (Existing code - NO CHANGE)
    telefonoInput.addEventListener("blur", function () { /* ... */ });

    // 📌 Función para actualizar las horas disponibles (Existing code - NO CHANGE)
    function actualizarHorasDisponibles() { /* ... */ }

    fechaInput.addEventListener("change", actualizarHorasDisponibles);

    // add a listener to flatpickr `Clear` button (Existing code - NO CHANGE)
    const clearButton = document.querySelector(".flatpickr-clear");
    if(clearButton){ /* ... */ }

    actualizarHorasDisponibles();

    // 📌 Categorizar automáticamente según la hora seleccionada (Existing code - NO CHANGE)
    horasRadios.forEach(radio => { /* ... */ });

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

        // 📌 Get the FORM ORIGIN - Added code
        const formularioOrigen = document.querySelector('input[name="formulario_origen"]').value;

        // 📌 VALIDATE FORM ORIGIN - Added code
        if (formularioOrigen !== "reserva_espanol") {
            messages.push("⚠️ Este formulario no es un formulario de reserva válido.");
            isValid = false;
            console.error("Formulario no válido.  Origen: " + formularioOrigen);
        }

        if (!fecha) {
            messages.push("⚠️ Por favor, selecciona una fecha."); // Existing code
            isValid = false;
        }

        if (!horaSeleccionada) {
            messages.push("⚠️ Por favor, selecciona una hora."); // Existing code
            isValid = false;
        }

        if (nombre.length < 2) {
            messages.push("⚠️ El nombre debe tener al menos 2 caracteres."); // Existing code
            isValid = false;
        }

        if (apellido.length < 2) {
            messages.push("⚠️ El apellido debe tener al menos 2 caracteres."); // Existing code
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            messages.push("⚠️ Ingresa un correo electrónico válido."); // Existing code
            isValid = false;
        }

        if (!personas || isNaN(personas) || personas < 1) {
            messages.push("⚠️ Selecciona un número válido de personas."); // Existing code
            isValid = false;
        }

        if (!telefono) {
            messages.push("⚠️ Ingresa un número de teléfono válido."); // Existing code
            isValid = false;
        }

        if (!checkbox) {
            messages.push("⚠️ Debes aceptar las condiciones de privacidad."); // Existing code
            isValid = false;
        }

        if (!categoria) {
            messages.push("⚠️ La categoría no es válida."); // Existing code
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault(); // Existing code
            event.stopPropagation(); // Existing code
            formAlerts.innerHTML = messages.map(msg => `<p style="color: red;">${msg}</p>`).join(""); // Existing code
            formAlerts.style.display = "block"; // Existing code
            return false; // Existing code
        }

        // Si el FORMULARIO es válido y es una reserva, continuar con el envío normal (existing code)
    });
});
