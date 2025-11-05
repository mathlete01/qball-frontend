// Navigation handlers
import { showModal } from './modals.js';

let contentAbout = "";
let contentHireMe = "";

function getContent() {
  Promise.all([
    fetch("content/about.html").then((x) => x.text()),
    fetch("content/hireMe.html").then((x) => x.text()),
  ]).then(([about, hireMe]) => {
    contentAbout = about;
    contentHireMe = hireMe;
  });
}

export function initializeNavigation() {
  getContent();

  const aboutNav = document.getElementById("aboutNav");
  aboutNav.addEventListener("click", () => {
    showModal("About", contentAbout, [
      {
        label: "Close",
        onClick: (modal) => {},
      },
    ]);
  });

  const hireMeNav = document.getElementById("hireMeNav");
  hireMeNav.addEventListener("click", () => {
    showModal("Hire Me", contentHireMe, [
      {
        label: "Close",
        onClick: (modal) => {},
      },
    ]);
  });
}

