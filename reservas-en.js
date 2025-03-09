document.addEventListener("DOMContentLoaded", function () {
    // 📌 DOM Elements (Existing code - NO CHANGE)
    const dateInput = document.getElementById("date-en");
    const hourRadios = document.querySelectorAll('input[name="hora"]');
    const phoneInput = document.getElementById("phone-en");
    const form = document.getElementById("wf-form-reservas-EN"); // MAKE SURE THIS MATCHES THE ID OF YOUR ENGLISH FORM
    const categoryInput = document.getElementById("category-en"); // 📌 Hidden category input
    const formAlerts = document.getElementById("form-alerts-en");
    const availabilityMessage = document.getElementById("availability-message-en");

    // 📌 List of supported countries for phone validation (Existing code - NO CHANGE)
    const supportedCountries = [ /* ... */ ];

    // 📌 Allowed dates (European and ISO format) (Existing code - NO CHANGE)
    const fechasPermitidas = [ /* ... */ ];
    const fechasPermitidasISO = fechasPermitidas.map(fecha => { /* ... */ });

    // 📌 General blocked hours (Existing code - NO CHANGE)
    const horasBloqueadas = [ /* ... */ ];

    // 📌 Blocked hours by specific date (Existing code - NO CHANGE)
    const horasBloqueadasPorFecha = { /* ... */ };

    let flatpickrInstance;

    // Crear configuración regional personalizada (Existing code - NO CHANGE)
    const customEnglish = { /* ... */ };

    flatpickr.localize(customEnglish);

    // 📌 Flatpickr Initialization (Calendar) (Existing code - NO CHANGE)
    flatpickrInstance = flatpickr(dateInput, { /* ... */ });

    // 📌 Phone validation and formatting (Existing code - NO CHANGE)
    phoneInput.addEventListener("blur", function () { /* ... */ });

    // 📌 Function to update available hours (Existing code - NO CHANGE)
    function updateAvailableHours() { /* ... */ }

    dateInput.addEventListener("change", updateAvailableHours);
    updateAvailableHours();

    // add a listener to flatpickr `Clear` button (Existing code - NO CHANGE)
    const clearButton = document.querySelector(".flatpickr-clear");
    if(clearButton){ /* ... */ }

    // 📌 Categorize automatically according to the selected "data-categoria" attribute (Existing code - NO CHANGE)
    hourRadios.forEach(radio => { /* ... */ });

    // 📌 Form validation before submission
    form.addEventListener("submit", function (event) {
        let isValid = true;
        const messages = [];
        const phone = phoneInput.value.trim();
        const checkbox = document.getElementById("privacy-en").checked;
        const selectedHour = document.querySelector('input[name="hora"]:checked');
        const name = document.getElementById("name-en").value.trim();
        const lastName = document.getElementById("lastName-en").value.trim();
        const email = document.getElementById("email-en").value.trim();
        const guests = document.getElementById("guests-en").value.trim();
        const date = dateInput.value.trim();
        const category = categoryInput.value;

         // 📌 Get the FORM ORIGIN - Added code
        const formularioOrigen = document.querySelector('input[name="formulario_origen"]').value;

        // 📌 VALIDATE FORM ORIGIN - Added code
        if (formularioOrigen !== "reserva_ingles") {
            messages.push("⚠️ Este formulario no es un formulario de reserva válido."); //Customizar los mensajes
            isValid = false;
            console.error("Formulario no válido.  Origen: " + formularioOrigen);
        }

        if (!date) {
            messages.push("⚠️ Please select a date."); // Existing code
            isValid = false;
        }

        if (!selectedHour) {
            messages.push("⚠️ Please select a time."); // Existing code
            isValid = false;
        }

        if (name.length < 2) {
            messages.push("⚠️ The name must be at least 2 characters long."); // Existing code
            isValid = false;
        }

        if (lastName.length < 2) {
            messages.push("⚠️ The last name must be at least 2 characters long."); // Existing code
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            messages.push("⚠️ Enter a valid email address."); // Existing code
            isValid = false;
        }

        if (!guests || isNaN(guests) || guests < 1) {
            messages.push("⚠️ Select a valid number of people."); // Existing code
            isValid = false;
        }

        if (!phone) {
            messages.push("⚠️ Enter a valid phone number."); // Existing code
            isValid = false;
        }

        if (!checkbox) {
            messages.push("⚠️ You must accept the privacy policy."); // Existing code
            isValid = false;
        }

        if (!category) {
            messages.push("⚠️ The category is not valid."); // Existing code
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault(); // Existing code
            event.stopPropagation(); // Existing code
            formAlerts.innerHTML = messages.map(msg => `<p style="color: red;">${msg}</p>`).join(""); // Existing code
            formAlerts.style.display = "block"; // Existing code
            return false; // Existing code
        }

        // If the FORM is valid and is a reservation, continue with the default form submission (existing code)

    });
});
