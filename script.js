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

// ---------------------------------------------------------------
// 3) "My Virtual Dog" feature
// Lets a visitor adopt a dog, then feed and play with it.
// ---------------------------------------------------------------

// One variable holds the adopted dog. null means nobody is adopted yet.
let myDog = null;

// Grab the page elements we will use.
const adoptForm = document.getElementById("adopt-form");
const dogNameInput = document.getElementById("dog-name");
const nameMessage = document.getElementById("name-message");

const dogCard = document.getElementById("dog-card");
const dogNameDisplay = document.getElementById("dog-name-display");
const dogBreed = document.getElementById("dog-breed");
const dogDay = document.getElementById("dog-day");
const dogStage = document.getElementById("dog-stage");
const dogHappiness = document.getElementById("dog-happiness");

const feedButton = document.getElementById("feed-button");
const playButton = document.getElementById("play-button");

// validateName: trims the spaces at the start and end. If the result is
// empty or longer than 20 characters, it returns null (not allowed).
// Spaces in the MIDDLE of the name are kept.
function validateName(rawName) {
  const trimmed = rawName.trim();
  if (trimmed.length === 0) {
    return null;                 // empty or only spaces -> not allowed
  }
  if (trimmed.length > 20) {
    return null;                 // too long -> not allowed
  }
  return trimmed;                // valid name, ready to use
}

// getGrowthStage: turns a day number into a simple word.
// A new dog is on Day 1, which is the "Puppy" stage.
function getGrowthStage(day) {
  if (day <= 2) {
    return "Puppy";
  }
  if (day <= 4) {
    return "Teen";
  }
  return "Adult";
}

// updateHappiness: adds points but never lets happiness go above 100.
function updateHappiness(amount) {
  myDog.happiness = myDog.happiness + amount;
  if (myDog.happiness > 100) {
    myDog.happiness = 100;       // cap at 100
  }
}

// renderDog: writes the dog's details onto the page.
// We use textContent so the name is shown as plain text and is never
// treated as HTML (this keeps the page safe from bad input).
function renderDog() {
  dogNameDisplay.textContent = myDog.name;
  dogBreed.textContent = myDog.breed;
  dogDay.textContent = myDog.day;
  dogStage.textContent = getGrowthStage(myDog.day);
  dogHappiness.textContent = myDog.happiness;
}

// adoptDog: runs when the Adopt button/form is used.
function adoptDog(event) {
  event.preventDefault();        // stops the page from reloading

  const chosenBreed = adoptForm.querySelector('input[name="breed"]:checked').value;
  const validName = validateName(dogNameInput.value);

  if (validName === null) {
    // Show a helpful message and stop. We do NOT hide an already-adopted dog.
    nameMessage.textContent = "Please enter a name that is not empty and is 20 characters or fewer.";
    return;
  }

  nameMessage.textContent = "";  // clear any old error message

  // Create the new dog with the starting values: Day 1, Puppy, happiness 50.
  myDog = {
    name: validName,
    breed: chosenBreed,
    day: 1,
    happiness: 50
  };

  dogCard.hidden = false;        // reveal the dog card
  renderDog();
}

// Connect the buttons to their functions.
adoptForm.addEventListener("submit", adoptDog);

feedButton.addEventListener("click", function () {
  if (myDog === null) { return; }   // ignore if no dog is adopted yet
  updateHappiness(10);
  renderDog();
});

playButton.addEventListener("click", function () {
  if (myDog === null) { return; }   // ignore if no dog is adopted yet
  updateHappiness(10);
  renderDog();
});
