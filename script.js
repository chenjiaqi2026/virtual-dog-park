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
// Adopt a dog, then feed, play, advance days, and start over.
// The dog is saved in the browser so it survives a page refresh.
// ---------------------------------------------------------------

// The single saved dog lives in localStorage under this key.
// localStorage is a tiny store built into every browser. The data is
// saved on THIS computer, inside the browser, for THIS website only.
// (You can peek at it in DevTools -> Application -> Local Storage.)
const STORAGE_KEY = "virtualDogParkPetV1";

// myDog holds the adopted dog in memory. null means nobody is adopted yet.
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
const growthFill = document.getElementById("growth-fill");

const feedButton = document.getElementById("feed-button");
const playButton = document.getElementById("play-button");
const nextDayButton = document.getElementById("next-day-button");
const startOverButton = document.getElementById("start-over-button");

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
// Day 1 = Puppy, Days 2-3 = Young Dog, Day 4 and later = Adult Dog.
function getGrowthStage(day) {
  if (day === 1) {
    return "Puppy";
  }
  if (day <= 3) {
    return "Young Dog";
  }
  return "Adult Dog";
}

// getGrowthPercent: a number from 0 to 100 used to fill the growth bar.
// It is only a friendly visual; the word above is the real stage.
function getGrowthPercent(day) {
  if (day <= 1) { return 25; }
  if (day === 2) { return 50; }
  if (day === 3) { return 75; }
  return 100;
}

// updateHappiness: adds points but never lets happiness pass 100 or drop below 0.
function updateHappiness(amount) {
  myDog.happiness = myDog.happiness + amount;
  if (myDog.happiness > 100) {
    myDog.happiness = 100;       // cap at 100
  }
  if (myDog.happiness < 0) {
    myDog.happiness = 0;         // floor at 0
  }
}

// renderDog: writes the dog's details onto the page.
// We use textContent so the name is shown as plain text and is never
// treated as HTML (this keeps the page safe from bad input).
function renderDog() {
  dogNameDisplay.textContent = myDog.name;
  dogBreed.textContent = myDog.breed;
  dogDay.textContent = myDog.day;
  dogStage.textContent = getGrowthStage(myDog.day);             // text states the stage
  dogHappiness.textContent = myDog.happiness;
  growthFill.style.width = getGrowthPercent(myDog.day) + "%";    // visual bar
}

// saveDog: writes the current dog to localStorage as text (JSON).
function saveDog() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(myDog));
}

// loadDog: reads the saved dog from localStorage, or null if there is none.
function loadDog() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    return null;
  }
  return JSON.parse(saved);
}

// adoptDog: runs when the Adopt button/form is used.
function adoptDog(event) {
  event.preventDefault();        // stops the page from reloading

  const chosenBreed = adoptForm.querySelector('input[name="breed"]:checked').value;
  const validName = validateName(dogNameInput.value);

  if (validName === null) {
    // Show a helpful message and stop. We do NOT change an already-adopted dog.
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

  saveDog();                     // save right after adoption
  adoptForm.hidden = true;        // hide the form now that we have a dog
  dogCard.hidden = false;         // reveal the dog card
  renderDog();
}

// nextDay: move to the next day. Day +1, happiness -5 (never below 0).
function nextDay() {
  if (myDog === null) { return; }
  myDog.day = myDog.day + 1;
  updateHappiness(-5);
  saveDog();                     // save after every day change
  renderDog();
}

// startOver: ask before deleting the saved dog and returning to the form.
function startOver() {
  const sure = window.confirm("Start over? This will delete your dog and cannot be undone.");
  if (sure === false) {
    return;                      // visitor cancelled: keep the dog
  }
  localStorage.removeItem(STORAGE_KEY);
  myDog = null;
  dogCard.hidden = true;         // hide the dog card
  adoptForm.hidden = false;      // show the adoption form again
  dogNameInput.value = "";
  nameMessage.textContent = "";
}

// Connect the buttons to their functions.
adoptForm.addEventListener("submit", adoptDog);

feedButton.addEventListener("click", function () {
  if (myDog === null) { return; }   // ignore if no dog is adopted yet
  updateHappiness(10);
  saveDog();                        // save after every Feed
  renderDog();
});

playButton.addEventListener("click", function () {
  if (myDog === null) { return; }   // ignore if no dog is adopted yet
  updateHappiness(10);
  saveDog();                        // save after every Play
  renderDog();
});

nextDayButton.addEventListener("click", nextDay);
startOverButton.addEventListener("click", startOver);

// Restore a saved dog when the page loads (for example, after a refresh).
const savedDog = loadDog();
if (savedDog !== null) {
  myDog = savedDog;
  // Make the breed radio match the saved dog, so the form stays consistent.
  const matchingRadio = adoptForm.querySelector('input[name="breed"][value="' + savedDog.breed + '"]');
  if (matchingRadio !== null) {
    matchingRadio.checked = true;
  }
  adoptForm.hidden = true;
  dogCard.hidden = false;
  renderDog();
}
