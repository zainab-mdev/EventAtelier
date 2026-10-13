const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve all static files (HTML, CSS, JS, images) from the project root
app.use(express.static(path.join(__dirname, "..")));

// ============================================================
// HELPER: read a JSON file from the data/ folder
// ============================================================
function readJSON(filename, callback) {
  fs.readFile(path.join(__dirname, "..", "data", filename), "utf8", function (err, data) {
    if (err) {
      callback(err, null);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch (parseErr) {
      callback(parseErr, null);
    }
  });
}

// ============================================================
// HELPER: write a JSON file to the data/ folder
// ============================================================
function writeJSON(filename, data, callback) {
  fs.writeFile(
    path.join(__dirname, "..", "data", filename),
    JSON.stringify(data, null, 2),
    callback
  );
}

// ============================================================
// GET /api/company
// Returns company info, vision, mission, values, timeline
// ============================================================
app.get("/api/company", function (req, res) {
  readJSON("company.json", function (err, data) {
    if (err) {
      res.status(500).json({ success: false, message: "Could not load company data." });
      return;
    }
    res.json(data);
  });
});

// ============================================================
// GET /api/services
// Returns all services and why-choose-us content
// ============================================================
app.get("/api/services", function (req, res) {
  readJSON("services.json", function (err, data) {
    if (err) {
      res.status(500).json({ success: false, message: "Could not load services data." });
      return;
    }
    res.json(data);
  });
});

// ============================================================
// GET /api/team
// Returns founders and team members
// ============================================================
app.get("/api/team", function (req, res) {
  readJSON("team.json", function (err, data) {
    if (err) {
      res.status(500).json({ success: false, message: "Could not load team data." });
      return;
    }
    res.json(data);
  });
});

// ============================================================
// GET /api/testimonials
// Returns all client reviews
// ============================================================
app.get("/api/testimonials", function (req, res) {
  readJSON("testimonials.json", function (err, data) {
    if (err) {
      res.status(500).json({ success: false, message: "Could not load testimonials data." });
      return;
    }
    res.json(data);
  });
});

// ============================================================
// POST /api/contact
// Saves contact form submission to data/contact.json
// ============================================================
app.post("/api/contact", function (req, res) {
  console.log("SERVER RECEIVED:", req.body);

  const contact_data = req.body;

  readJSON("contact.json", function (err, data) {
    let contact_list = [];

    // If file exists and has an array, use it
    if (!err && data && Array.isArray(data.submissions)) {
      contact_list = data.submissions;
    }

    // Add timestamp
    contact_data.submittedAt = new Date().toISOString();

    // Push new entry
    contact_list.push(contact_data);

    // Save back to JSON
    writeJSON("contact.json", { submissions: contact_list }, function (writeErr) {
      if (writeErr) {
        res.json({ success: false });
        return;
      }
      res.json({ success: true });
    });
  });
});


// ============================================================
// POST /api/booking
// Saves consultation form submission to data/bookings.json
// ============================================================
app.post("/api/booking", function (req, res) {
  const booking_data = req.body;

  readJSON("bookings.json", function (err, data) {
    let bookings_list = [];

    if (!err && data && Array.isArray(data.bookings)) {
      bookings_list = data.bookings;
    }

    // Add timestamp to the submission
    booking_data.submittedAt = new Date().toISOString();
    bookings_list.push(booking_data);

    writeJSON("bookings.json", { bookings: bookings_list }, function (writeErr) {
      if (writeErr) {
        res.json({ success: false });
        return;
      }
      res.json({ success: true });
    });
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(3000, function () {
  console.log("Event Atelier server running at http://localhost:3000");
});
