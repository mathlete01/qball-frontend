// Modal functions
import { state } from '../game/state.js';
import { savePlayer } from '../api/api.js';
import { skip } from '../game/gameControl.js';

export function showModal(titleHtml, content) {
  if (state.testing) {
    console.log(`showModal()`);
  }
  const modal = document.createElement("div");
  modal.classList.add("modal--");
  modal.innerHTML = `
    <div class="modal--inner">
      <div class="modal--top">
        <div class="modal--title">${titleHtml}</div>
        <button type="button" class="modal--close">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="modal--content">${content}</div>
      <div class="modal--bottom"></div>
    </div>
  `;

  modal.querySelector(".modal--close").addEventListener("click", () => {
    if (state.testing) {
      console.log(`showModal modal--close`);
    }
    document.body.removeChild(modal);
  });

  document.body.appendChild(modal);
}

export function showSaveModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal--");
  modal.innerHTML = `
    <div class="modal--inner">
      <div class="modal--top">
        <div class="modal--title">Save Your Score</div>
        <button type="button" class="modal--close">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="modal--content">
        <p>Type your name below</p>
        <input type="name" id="nameField" required />
      </div>
      <div class="modal--bottom"></div>
    </div>
  `;

  // Close Button
  modal.querySelector(".modal--close").addEventListener("click", () => {
    if (state.testing) {
      console.log(`showSaveModal: close`);
    }
    document.body.removeChild(modal);
    skip();
  });

  // Skip Button
  const skipButton = document.createElement("button");
  skipButton.setAttribute("type", "button");
  skipButton.classList.add("modal--button");
  skipButton.textContent = "Skip This";
  skipButton.addEventListener("click", () => {
    if (state.testing) {
      console.log(`showSaveModal: skip`);
    }
    document.body.removeChild(modal);
    skip();
  });
  modal.querySelector(".modal--bottom").appendChild(skipButton);

  // Save Button
  const saveButton = document.createElement("button");
  saveButton.setAttribute("type", "button");
  saveButton.classList.add("modal--button");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    if (state.testing) {
      console.log(`showSaveModal: save`);
    }
    const nameField = document.getElementById("nameField");
    savePlayer(nameField.value.toUpperCase());
    document.body.removeChild(modal);
  });
  modal.querySelector(".modal--bottom").appendChild(saveButton);

  document.body.appendChild(modal);
}

