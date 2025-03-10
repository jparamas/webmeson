document.addEventListener("DOMContentLoaded", function () {
        // 📌 DOM Elements
        const dateInput = document.getElementById("date-en");
        const hourRadios = document.querySelectorAll('input[name="hora"]');
        const phoneInput = document.getElementById("phone-en");
        const form = document.getElementById("wf-form-reservas-EN"); // MAKE SURE THIS MATCHES THE ID OF YOUR ENGLISH FORM
        const categoryInput = document.getElementById("category-en"); // 📌 Hidden category input
        const formAlerts = document.getElementById("form-alerts-en");
        const availabilityMessage = document.getElementById("availability-message-en"); // New div for availability alerts (English version)
    
        // 📌 List of supported countries for phone validation
        const supportedCountries = [
            "ES", "FR", "DE", "IT", "PT", "IE", "NL", "BE", "LU", "AT", "SE", "FI", "DK", "NO", "CH", 
            "PL", "CZ", "SK", "HU", "RO", "BG", "GR", "CY", "MT", "LT", "LV", "EE", "HR", "SI", "US"
        ];
    
        // 📌 Allowed dates (European and ISO format) - KEEP THESE IN SPANISH
        const fechasPermitidas = ["02-03-2025", "03-03-2025", "13-04-2025", "14-04-2025", "15-04-2025", "16-04-2025", "17-04-2025"];
        const fechasPermitidasISO = fechasPermitidas.map(fecha => {
            const [day, month, year] = fecha.split("-");
            return `${year}-${month}-${day}`;
        });
    
        // 📌 General blocked hours - KEEP THESE IN SPANISH
        const horasBloqueadas = ["14:30", "15:00"];
    
        // 📌 Blocked hours by specific date - KEEP THESE IN SPANISH
        const horasBloqueadasPorFecha = {
            "2025-04-17": ["13:30", "14:00"]
        };
    
        let flatpickrInstance;
    
         // Crear configuración regional personalizada
        const customEnglish = {
          firstDayOfWeek: 1
        };
    
        flatpickr.localize(customEnglish);
    
        // 📌 Flatpickr Initialization (Calendar)
        flatpickrInstance = flatpickr(dateInput, {
            enableTime: false,
            dateFormat: "Y-m-d", // Keep this, but remember to display the date correctly for the user.
            minDate: "today",
            //locale: customEnglish, // Usar la configuración regional personalizada
            inline: true,
            firstDayOfWeek: 1,
            disable: [
                function (date) {
                    const fechaISO = date.toISOString().split("T")[0];
                    if (fechasPermitidasISO.includes(fechaISO)) return false;
                    return [1, 2, 3, 4].includes(date.getDay()); // Block Monday to Thursday
                }
            ],
            onChange: function (selectedDates, dateStr, instance) {
                updateAvailableHours();
                if(selectedDates.length > 0){
                    availabilityMessage.style.display = "none"; // clear the alerts
                }
            },
            onClose: function(selectedDates, dateStr, instance){
                if(selectedDates.length === 0){
                    availabilityMessage.innerHTML = `<p style="color: red;">⚠️ Closed day. Please choose another date.</p>`;
                    availabilityMessage.style.display = "block";
                    dateInput.value = ""; // clear the date
                }
            }
        });
    
    
        // 📌 Phone validation and formatting
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
    
        // 📌 Function to update available hours
        function updateAvailableHours() {
            const selectedDate = dateInput.value;
            if (!selectedDate) {
                // Clear hour selection and category if date is cleared
                hourRadios.forEach(radio => {
                    radio.checked = false;
                });
                categoryInput.value = "";
                availabilityMessage.style.display = "none";  // Hide previous alerts
                return;
            }
    
            const today = new Date();
            const selectedDateDate = new Date(selectedDate + "T00:00:00");
    
            let mealAvailable = false;
            let dinnerAvailable = false;
            let anyHourAvailable = false;
    
            hourRadios.forEach(radio => {
                const hora = radio.value;
                const [h, m] = hora.split(":").map(Number);
                const fullHour = new Date(selectedDateDate);
                fullHour.setHours(h, m, 0, 0);
    
                let block = false;
    
                // 📌 Block hours if the date is today and the time has passed
                if (selectedDateDate.toDateString() === today.toDateString() && fullHour < today) {
                    block = true;
                }
    
                // 📌 Block general hours
                if (horasBloqueadas.includes(hora)) {
                    block = true;
                }
    
                // 📌 Block specific hours by date
                if (horasBloqueadasPorFecha[selectedDate] && horasBloqueadasPorFecha[selectedDate].includes(hora)) {
                    block = true;
                }
    
                // 📌 Block hours on Sunday after 8:30 PM
                if (selectedDateDate.getDay() === 0 && ["20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30"].includes(hora)) {
                    block = true;
                }
    
                // 📌 Apply block visually
                radio.disabled = block;
                radio.parentElement.style.opacity = block ? "0.5" : "1";
    
                if (!block) {
                    anyHourAvailable = true;
                    const hourNumeric = parseInt(hora.split(":")[0], 10);
                    if (hourNumeric < 16) {
                        mealAvailable = true;
                    } else {
                        dinnerAvailable = true;
                    }
                }
            });
    
    
            // Show alerts if no availability
            if (!anyHourAvailable) {
                availabilityMessage.innerHTML = `<p style="color: red;">⚠️ There is no availability for the selected date</p>`;
                availabilityMessage.style.display = "block";
            } else if (!mealAvailable) {
                availabilityMessage.innerHTML = `<p style="color: red;">⚠️ There is no availability for lunch.</p>`;
                availabilityMessage.style.display = "block";
            } else if (!dinnerAvailable) {
                availabilityMessage.innerHTML = `<p style="color: red;">⚠️ There is no availability for dinner.</p>`;
                availabilityMessage.style.display = "block";
            }else {
                 availabilityMessage.style.display = "none";
            }
        }
    
        dateInput.addEventListener("change", updateAvailableHours);
        updateAvailableHours();
    
          // add a listener to flatpickr `Clear` button
        const clearButton = document.querySelector(".flatpickr-clear");
        if(clearButton){
            clearButton.addEventListener("click", function(){
               dateInput.value = "";
                updateAvailableHours();
            });
        }
    
        // 📌 Categorize automatically according to the selected "data-categoria" attribute
        hourRadios.forEach(radio => {
            radio.addEventListener("change", function () {
                const categoriaSeleccionada = this.dataset.categoria; // Access the "data-categoria" attribute
                categoryInput.value = categoriaSeleccionada; // Set the hidden input value to "comida" or "cena"
            });
        });
    
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
    
            if (!date) {
                messages.push("⚠️ Please select a date.");
                isValid = false;
            }
    
            if (!selectedHour) {
                messages.push("⚠️ Please select a time.");
                isValid = false;
            }
    
            if (name.length < 2) {
                messages.push("⚠️ The name must be at least 2 characters long.");
                isValid = false;
            }
    
            if (lastName.length < 2) {
                messages.push("⚠️ The last name must be at least 2 characters long.");
                isValid = false;
            }
    
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                messages.push("⚠️ Enter a valid email address.");
                isValid = false;
            }
    
            if (!guests || isNaN(guests) || guests < 1) {
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
            if (!category) {
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
