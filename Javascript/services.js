// ============================================================
// SERVICES.JS
// Loads service data from the server and handles the
// booking form submission and quote button interactions.
// ============================================================

// ============================================================
// LOAD SERVICES FROM JSON
// Fetches /api/services and updates the page with live data
// ============================================================
fetch("http://localhost:3000/api/services")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log("services.js JSON loaded", data);

    // Update each service block's description using its data-service id
    if (data.services) {
      data.services.forEach(function (service) {
        // Find the "Request a Custom Quote" button with matching data-service
        const service_btn = document.querySelector(
          'a[data-service="' + service.id + '"]'
        );
        if (!service_btn) return;

        // Walk up to the parent service-block and update the <p> description
        const service_block = service_btn.closest(".service-block");
        if (!service_block) return;

        const desc_el = service_block.querySelector("p");
        if (desc_el) {
          desc_el.textContent = service.fullDescription;
        }
      });
    }

    // Update why-choose-us items if they exist
    if (data.whyChooseUs) {
      const why_items = document.querySelectorAll(".why-item");
      why_items.forEach(function (item, index) {
        if (data.whyChooseUs[index]) {
          const h3 = item.querySelector("h3");
          const p = item.querySelector("p");
          if (h3) h3.textContent = data.whyChooseUs[index].title;
          if (p) p.textContent = data.whyChooseUs[index].description;
        }
      });
    }
  })
  .catch(function (error) {
    console.log("services.js JSON not loaded yet.", error);
  });

// ============================================================
// QUOTE BUTTON → AUTO-SELECT SERVICE IN BOOKING FORM
// Clicking "Request a Custom Quote" scrolls to the form
// and pre-selects the matching service in the dropdown.
// ============================================================
const service_btns = document.querySelectorAll(".service-btn");
service_btns.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const service_id = btn.getAttribute("data-service");
    const service_select = document.getElementById("serviceType");
    if (service_select && service_id) {
      service_select.value = service_id;
    }
    // Scroll to booking form
    const booking_section = document.getElementById("booking");
    if (booking_section) {
      booking_section.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ============================================================
// BOOKING FORM VALIDATION + SUBMISSION
// Validates all fields and POSTs to /api/booking
// ============================================================

// Booking form validation + submission
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  const phoneInput = document.getElementById("phone");
  const budgetInput = document.getElementById("budget");

  // Restrict phone input to digits only
  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // Allow only digits, spaces, dash, and currency symbols in budget
  budgetInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9\s\-\$€£₹]/g, "");
  });

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const service_type = document.getElementById("serviceType").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = phoneInput.value.trim();
    const event_date = document.getElementById("eventDate").value.trim();
    const event_location = document.getElementById("eventLocation").value.trim();
    const consult_method = document.getElementById("consultMethod").value.trim();
    const budget = budgetInput.value.trim();
    const message = document.getElementById("message").value.trim();

    // Patterns
    const namePattern = /^[A-Za-z\s]{2,30}$/;   // letters only
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const phonePattern = /^[0-9]{10,15}$/;
    const locationPattern = /^[A-Za-z0-9\s]{3,}$/; // min 3 chars, letters/numbers/spaces

    // Checks
    if (service_type === "") { alert("Please select a service type."); return; }
    if (!name.match(namePattern)) { alert("Name must be letters only (2–30 characters)."); return; }
    if (!email.match(emailPattern)) { alert("Please enter a valid email."); return; }
    if (!phone.match(phonePattern)) { alert("Phone number must be 10–15 digits."); return; }
    if (event_date === "") { alert("Please select your event date."); return; }

    const today = new Date();
    const chosenDate = new Date(event_date);
    if (chosenDate < today.setHours(0,0,0,0)) {
      alert("Oops! That day has already passed. Please choose a future date.");
      return;
    }

    if (!event_location.match(locationPattern)) {
      alert("Event location must be at least 3 characters, using letters, numbers, or spaces.");
      return;
    }
    if (consult_method === "") { alert("Please select a consultation method."); return; }
    if (message === "") { alert("Please enter a short message."); return; } // message cannot be empty

    // Build booking object
    const booking_data = {
      serviceType: service_type,
      name: name,
      email: email,
      phone: phone,
      eventDate: event_date,
      eventLocation: event_location,
      consultMethod: consult_method,
      budget: budget,
      message: message
    };

    // POST to server
    fetch("http://localhost:3000/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking_data)
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          alert("✅ Consultation request submitted successfully!");
          bookingForm.reset();
        } else {
          alert("⚠️ Could not submit your request. Please try again.");
        }
      })
      .catch(err => {
        console.log(err);
        alert("⚠️ Server error. Please try again later.");
      });
  });
}
