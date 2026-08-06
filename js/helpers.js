/* ==========================================================
   Mountain Health Bar Admin
   Helper Functions
========================================================== */
 
"use strict";
 
let toastTimeout = null;
 
function showToast(message, type = "success") {
  const adminToast = document.getElementById("adminToast");
 
  if (!adminToast) {
    return;
  }
 
  window.clearTimeout(toastTimeout);
  adminToast.textContent = message;
  adminToast.classList.remove("success", "error");
  adminToast.classList.add(type, "show");
 
  toastTimeout = window.setTimeout(function () {
    adminToast.classList.remove("show");
  }, 2800);
}
 
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
 
function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
 
  const number = Number(String(value).replace(",", "."));
 
  if (Number.isNaN(number)) {
    return value + " €";
  }
 
  return number.toFixed(2).replace(".", ",") + " €";
}
 
function normalizeTime(value) {
  const time = String(value || "").trim();
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
 
  if (!match) {
    return time;
  }
 
  return String(match[1]).padStart(2, "0") + ":" + match[2];
}
 
function convertTimeToMinutes(time) {
  const parts = String(time).split(":");
  const hours = Number(parts[0]) || 0;
  const minutes = Number(parts[1]) || 0;
  return hours * 60 + minutes;
}
 
async function copyText(text, successMessage = "Copied successfully.") {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
    return true;
  } catch (error) {
    console.error("Clipboard error:", error);
    showToast("The content could not be copied.", "error");
    return false;
  }
}
