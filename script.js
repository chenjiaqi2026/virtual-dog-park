// Virtual Dog Park - simple interactivity
// This file adds two small, friendly touches to the page.
// It does NOT use any framework, backend, or external library.

// ---------------------------------------------------------------
// 1) Visit counter
// localStorage is built into every browser. It lets us remember a
// small number between page opens, with no server needed.
// ---------------------------------------------------------------
const visitCountEl = document.getElementById("visit-count");

// Read the saved number. If there is none yet, start at 0.
let visits = Number(localStorage.getItem("vdp_visits")) || 0;
visits = visits + 1;                       // count this visit
localStorage.setItem("vdp_visits", visits); // save it for next time
visitCountEl.textContent = visits;

// ---------------------------------------------------------------
// 2) "Pet me" buttons
// For each button, show a happy message for that dog when clicked.
// ---------------------------------------------------------------
const petButtons = document.querySelectorAll(".pet-button");

petButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Move up from the button to its card, then find the name and message.
    const card = button.closest(".breed-card");
    const name = card.querySelector(".breed-name").textContent;
    const message = card.querySelector(".pet-message");
    message.textContent = name + " wags their tail happily!";
  });
});
