console.log("TEAM JS LOADED");

// ============================================================
// RENDER TEAM CARDS FROM JSON
// Fetches team data from server and builds the card HTML
// dynamically, then re-attaches all interactions.
// ============================================================
function buildCard(person) {
  return `
    <div class="team-card">
      <img src="${person.image}" alt="${person.name}">
      <div class="team-info">
        <h3>${person.name}</h3>
        <span class="role">${person.role}</span>
        <p class="mini-quote">"${person.quote}"</p>
        <h4>${person.specialty}</h4>
        <p>${person.bio}</p>
        <div class="member-contact">
          <p>${person.email}</p>
          <p>${person.phone}</p>
        </div>
      </div>
    </div>
  `;
}

function attachCardInteractions() {
  const team_cards = document.querySelectorAll(".team-card");

  // Expand / collapse on click
  team_cards.forEach(function (single_team_card) {
    single_team_card.addEventListener("click", function () {
      console.log("CLICK WORKS");
      single_team_card.classList.toggle("card_expanded");
    });
  });

  // Hover animation
  team_cards.forEach(function (single_team_card) {
    single_team_card.addEventListener("mouseenter", function () {
      single_team_card.classList.add("card_hover_active");
    });
    single_team_card.addEventListener("mouseleave", function () {
      single_team_card.classList.remove("card_hover_active");
    });
  });
}

fetch("http://localhost:3000/api/team")
  .then(function (response) {
    return response.json();
  })
  .then(function (team_data) {
    console.log("team.js JSON loaded", team_data);

    // --- Render founders ---
    const founders_grid = document.querySelector(".founders-section .team-grid");
    if (founders_grid && team_data.founders) {
      founders_grid.innerHTML = team_data.founders.map(buildCard).join("");
    }

    // --- Render team members ---
    const members_grid = document.querySelector(".team-members .team-grid");
    if (members_grid && team_data.members) {
      members_grid.innerHTML = team_data.members.map(buildCard).join("");
    }

    // Re-attach click and hover interactions after DOM is updated
    attachCardInteractions();
  })
  .catch(function (error) {
    console.log("team.js JSON not loaded yet.", error);
    // If server is unavailable, still attach interactions to static HTML cards
    attachCardInteractions();
  });
