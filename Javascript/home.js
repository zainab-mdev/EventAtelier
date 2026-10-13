
//Hero Carousel
let index = 0;
const slides = document.querySelectorAll(".wedding-slide");
const track = document.querySelector(".wedding-track");
const totalSlides = slides.length;

function moveSlider() {
    index++;
    if (index >= totalSlides) {
        index = 0;
    }
    track.style.transform = `translateX(-${index * 100}vw)`;
}

setInterval(moveSlider, 3000);



// WHATSAPP PULSE
var whatsapp = document.querySelector(".whatsapp-float");
setInterval(function () {
if (!whatsapp) return;
whatsapp.classList.toggle("pulse");
}, 2000);

//FORM VALIDATION

var form = document.getElementById("ctaForm");
if (form) {
  var phoneInput = form.querySelector("input[type='tel']");

  // Restrict phone input to digits only
  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.querySelector("input[type='text']").value.trim();
    var email = form.querySelector("input[type='email']").value.trim();
    var phone = phoneInput.value.trim();

    // Regex patterns
    var namePattern = /^[A-Za-z\s]{2,30}$/;   // letters + spaces, 2–30 chars
    var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; // basic email format
    var phonePattern = /^[0-9]{10,15}$/;      // 10–15 digits

    // Checks
    if (name === "" || email === "" || phone === "") {
      alert("⚠️ Please fill in all fields.");
      return;
    }
    if (!name.match(namePattern)) {
      alert("⚠️ Name must be letters only (2–30 characters).");
      return;
    }
    if (!email.match(emailPattern)) {
      alert("⚠️ Please enter a valid email (e.g. name@example.com).");
      return;
    }
    if (!phone.match(phonePattern)) {
      alert("⚠️ Phone number must be 10–15 digits.");
      return;
    }

    // Success
    alert("✅ Thanks! We will get back to you soon.");
    var formData = {
      name: name,
      email: email,
      phone: phone,
      timestamp: new Date().toISOString()
    };

    fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Saved:", data);
    })
    .catch(err => console.error("Error saving:", err));

    // Reset AFTER saving
    form.reset();
  });
}

