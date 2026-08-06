/* ==========================================================
   Mountain Health Bar Admin
   Navigation
========================================================== */
 
"use strict";
 
const navigationButtons = document.querySelectorAll(".nav-link");
const adminPages = document.querySelectorAll(".admin-page");
let navigationInitialized = false;
 
function initializeNavigation() {
  if (navigationInitialized) {
    return;
  }
 
  navigationButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showPage(button.dataset.page);
    });
  });
 
  navigationInitialized = true;
}
 
function showPage(pageName) {
  navigationButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.page === pageName);
  });
 
  adminPages.forEach(function (page) {
    page.classList.toggle("active", page.id === "page-" + pageName);
  });
 
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
