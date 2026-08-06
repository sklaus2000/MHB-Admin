/* ==========================================================
   Mountain Health Bar Admin
   Settings
========================================================== */
 
"use strict";
 
const openingTimeInput = document.getElementById("openingTime");
const closingTimeInput = document.getElementById("closingTime");
const weatherSettingStatus = document.getElementById("weatherSettingStatus");
const uvSettingStatus = document.getElementById("uvSettingStatus");
const announcementSettingStatus = document.getElementById("announcementSettingStatus");
 
const settingsState = {
  settings: {},
  openingTime: "11:00",
  closingTime: "17:00"
};
 
async function loadSettings() {
  try {
    const result = await apiSettings();
    settingsState.settings = result.settings || {};
    readOpeningHours();
    updateOpeningHoursForm();
    updateSettingsDisplay();
  } catch (error) {
    console.error("Settings could not be loaded:", error);
    showToast("Settings could not be loaded.", "error");
  }
}
 
function readOpeningHours() {
  const openingSetting = settingsState.settings["Opening Time"];
  const closingSetting = settingsState.settings["Closing Time"];
 
  if (openingSetting?.en) {
    settingsState.openingTime = normalizeTime(openingSetting.en);
  }
 
  if (closingSetting?.en) {
    settingsState.closingTime = normalizeTime(closingSetting.en);
  }
}
 
function updateOpeningHoursForm() {
  if (openingTimeInput) {
    openingTimeInput.value = settingsState.openingTime;
  }
 
  if (closingTimeInput) {
    closingTimeInput.value = settingsState.closingTime;
  }
}
 
function updateSettingsDisplay() {
  const weatherSetting = settingsState.settings["Weather Widget"];
  const uvSetting = settingsState.settings["UV Widget"];
  const announcementTitle = settingsState.settings["Announcement Title"];
  const announcementText = settingsState.settings["Announcement Text"];
 
  updateSettingStatus(weatherSettingStatus, weatherSetting?.active === true);
  updateSettingStatus(uvSettingStatus, uvSetting?.active === true);
 
  const announcementActive =
    announcementTitle?.active === true ||
    announcementText?.active === true;
 
  updateSettingStatus(announcementSettingStatus, announcementActive);
}
 
function updateSettingStatus(element, isActive) {
  if (!element) {
    return;
  }
 
  element.textContent = isActive ? "Active" : "Inactive";
  element.classList.toggle("inactive", !isActive);
}
