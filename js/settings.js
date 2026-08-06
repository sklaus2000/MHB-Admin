/* ==========================================================

   Mountain Health Bar Admin

   Settings and Opening Hours

========================================================== */

 

"use strict";

 

/* ----------------------------------------------------------

   ELEMENTS

---------------------------------------------------------- */

 

const openingHoursForm =

  document.getElementById("openingHoursForm");

 

const openingTimeInput =

  document.getElementById("openingTime");

 

const closingTimeInput =

  document.getElementById("closingTime");

 

const saveOpeningHoursButton =

  document.getElementById("saveOpeningHoursButton");

 

const openingHoursSaveStatus =

  document.getElementById("openingHoursSaveStatus");

 

const websiteSettingsForm =

  document.getElementById("websiteSettingsForm");

 

const weatherWidgetActive =

  document.getElementById("weatherWidgetActive");

 

const uvWidgetActive =

  document.getElementById("uvWidgetActive");

 

const announcementActive =

  document.getElementById("announcementActive");

 

const announcementTitleEn =

  document.getElementById("announcementTitleEn");

 

const announcementTitleDe =

  document.getElementById("announcementTitleDe");

 

const announcementTextEn =

  document.getElementById("announcementTextEn");

 

const announcementTextDe =

  document.getElementById("announcementTextDe");

 

const saveWebsiteSettingsButton =

  document.getElementById("saveWebsiteSettingsButton");

 

const websiteSettingsSaveStatus =

  document.getElementById("websiteSettingsSaveStatus");

 

const weatherSettingStatus =

  document.getElementById("weatherSettingStatus");

 

const uvSettingStatus =

  document.getElementById("uvSettingStatus");

 

const announcementSettingStatus =

  document.getElementById("announcementSettingStatus");

 

/* ----------------------------------------------------------

   STATE

---------------------------------------------------------- */

 

const settingsState = {

  settings: {},

  openingTime: "11:00",

  closingTime: "17:00"

};

 

let settingsButtonsInitialized = false;

 

/* ----------------------------------------------------------

   LOAD SETTINGS

---------------------------------------------------------- */

 

async function loadSettings() {

  try {

    const result = await apiSettings();

 

    settingsState.settings = result.settings || {};

 

    readOpeningHours();

    updateOpeningHoursForm();

    updateWebsiteSettingsForm();

    initializeSettingsButtons();

 

  } catch (error) {

    console.error("Settings could not be loaded:", error);

 

    setOpeningHoursStatus(

      "Settings could not be loaded.",

      "error"

    );

 

    setWebsiteSettingsStatus(

      "Settings could not be loaded.",

      "error"

    );

 

    showToast(

      "Settings could not be loaded.",

      "error"

    );

  }

}

 

/* ----------------------------------------------------------

   OPENING HOURS

---------------------------------------------------------- */

 

function readOpeningHours() {

  const openingSetting =

    settingsState.settings["Opening Time"];

 

  const closingSetting =

    settingsState.settings["Closing Time"];

 

  if (openingSetting?.en) {

    settingsState.openingTime =

      normalizeTime(openingSetting.en);

  }

 

  if (closingSetting?.en) {

    settingsState.closingTime =

      normalizeTime(closingSetting.en);

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

 

/* ----------------------------------------------------------

   WEBSITE SETTINGS FORM

---------------------------------------------------------- */

 

function updateWebsiteSettingsForm() {

  const weatherSetting =

    settingsState.settings["Weather Widget"] || {};

 

  const uvSetting =

    settingsState.settings["UV Widget"] || {};

 

  const titleSetting =

    settingsState.settings["Announcement Title"] || {};

 

  const textSetting =

    settingsState.settings["Announcement Text"] || {};

 

  if (weatherWidgetActive) {

    weatherWidgetActive.checked =

      weatherSetting.active === true;

  }

 

  if (uvWidgetActive) {

    uvWidgetActive.checked =

      uvSetting.active === true;

  }

 

  const announcementIsActive =

    titleSetting.active === true ||

    textSetting.active === true;

 

  if (announcementActive) {

    announcementActive.checked = announcementIsActive;

  }

 

  if (announcementTitleEn) {

    announcementTitleEn.value = titleSetting.en || "";

  }

 

  if (announcementTitleDe) {

    announcementTitleDe.value = titleSetting.de || "";

  }

 

  if (announcementTextEn) {

    announcementTextEn.value = textSetting.en || "";

  }

 

  if (announcementTextDe) {

    announcementTextDe.value = textSetting.de || "";

  }

 

  updateSettingStatus(

    weatherSettingStatus,

    weatherSetting.active === true

  );

 

  updateSettingStatus(

    uvSettingStatus,

    uvSetting.active === true

  );

 

  updateSettingStatus(

    announcementSettingStatus,

    announcementIsActive

  );

}

 

function updateSettingStatus(element, isActive) {

  if (!element) {

    return;

  }

 

  element.textContent = isActive ? "Active" : "Inactive";

  element.classList.toggle("inactive", !isActive);

}

 

/* ----------------------------------------------------------

   EVENT LISTENERS

---------------------------------------------------------- */

 

function initializeSettingsButtons() {

  if (settingsButtonsInitialized) {

    return;

  }

 

  if (openingHoursForm) {

    openingHoursForm.addEventListener(

      "submit",

      saveOpeningHours

    );

  }

 

  if (websiteSettingsForm) {

    websiteSettingsForm.addEventListener(

      "submit",

      saveWebsiteSettings

    );

  }

 

  [

    [weatherWidgetActive, weatherSettingStatus],

    [uvWidgetActive, uvSettingStatus],

    [announcementActive, announcementSettingStatus]

  ].forEach(function (entry) {

    const input = entry[0];

    const status = entry[1];

 

    if (!input) {

      return;

    }

 

    input.addEventListener("change", function () {

      updateSettingStatus(status, input.checked);

    });

  });

 

  settingsButtonsInitialized = true;

}

 

/* ----------------------------------------------------------

   SAVE OPENING HOURS

---------------------------------------------------------- */

 

async function saveOpeningHours(event) {

  event.preventDefault();

 

  const openingTime = normalizeTime(

    openingTimeInput?.value || ""

  );

 

  const closingTime = normalizeTime(

    closingTimeInput?.value || ""

  );

 

  if (!isValidOpeningHours(openingTime, closingTime)) {

    setOpeningHoursStatus(

      "Closing time must be later than opening time.",

      "error"

    );

 

    showToast(

      "Please check the opening hours.",

      "error"

    );

 

    return;

  }

 

  setOpeningHoursSaving(true);

 

  try {

    const result = await apiSaveOpeningHours(

      openingTime,

      closingTime

    );

 

    settingsState.openingTime = openingTime;

    settingsState.closingTime = closingTime;

 

    settingsState.settings["Opening Time"] = {

      en: openingTime,

      de: openingTime,

      active: true

    };

 

    settingsState.settings["Closing Time"] = {

      en: closingTime,

      de: closingTime,

      active: true

    };

 

    setOpeningHoursStatus(

      result.message || "Opening hours saved successfully.",

      "success"

    );

 

    if (typeof loadDashboardOpeningHours === "function") {

      await loadDashboardOpeningHours();

    }

 

    if (typeof updateServiceStatus === "function") {

      updateServiceStatus();

    }

 

    showToast("Opening hours saved successfully.");

 

  } catch (error) {

    console.error("Opening hours could not be saved:", error);

 

    setOpeningHoursStatus(

      error.message || "Opening hours could not be saved.",

      "error"

    );

 

    showToast(

      "Opening hours could not be saved.",

      "error"

    );

 

  } finally {

    setOpeningHoursSaving(false);

  }

}

 

/* ----------------------------------------------------------

   SAVE WEBSITE SETTINGS

---------------------------------------------------------- */

 

async function saveWebsiteSettings(event) {

  event.preventDefault();

 

  const payload = {

    weatherActive: weatherWidgetActive?.checked === true,

    uvActive: uvWidgetActive?.checked === true,

    announcementActive: announcementActive?.checked === true,

    announcementTitle: {

      en: String(announcementTitleEn?.value || "").trim(),

      de: String(announcementTitleDe?.value || "").trim()

    },

    announcementText: {

      en: String(announcementTextEn?.value || "").trim(),

      de: String(announcementTextDe?.value || "").trim()

    }

  };

 

  if (

    payload.announcementActive &&

    (!payload.announcementTitle.en ||

      !payload.announcementTitle.de ||

      !payload.announcementText.en ||

      !payload.announcementText.de)

  ) {

    setWebsiteSettingsStatus(

      "Please complete all announcement fields before activating the banner.",

      "error"

    );

 

    showToast(

      "Please complete the announcement fields.",

      "error"

    );

 

    return;

  }

 

  setWebsiteSettingsSaving(true);

 

  try {

    const result = await apiSaveWebsiteSettings(payload);

 

    settingsState.settings["Weather Widget"] = {

      en: payload.weatherActive ? "TRUE" : "FALSE",

      de: payload.weatherActive ? "TRUE" : "FALSE",

      active: payload.weatherActive

    };

 

    settingsState.settings["UV Widget"] = {

      en: payload.uvActive ? "TRUE" : "FALSE",

      de: payload.uvActive ? "TRUE" : "FALSE",

      active: payload.uvActive

    };

 

    settingsState.settings["Announcement Title"] = {

      en: payload.announcementTitle.en,

      de: payload.announcementTitle.de,

      active: payload.announcementActive

    };

 

    settingsState.settings["Announcement Text"] = {

      en: payload.announcementText.en,

      de: payload.announcementText.de,

      active: payload.announcementActive

    };

 

    updateWebsiteSettingsForm();

 

    setWebsiteSettingsStatus(

      result.message || "Settings saved successfully.",

      "success"

    );

 

    showToast("Settings saved successfully.");

 

  } catch (error) {

    console.error("Settings could not be saved:", error);

 

    setWebsiteSettingsStatus(

      error.message || "Settings could not be saved.",

      "error"

    );

 

    showToast(

      "Settings could not be saved.",

      "error"

    );

 

  } finally {

    setWebsiteSettingsSaving(false);

  }

}

 

/* ----------------------------------------------------------

   VALIDATION AND BUTTON STATES

---------------------------------------------------------- */

 

function isValidOpeningHours(openingTime, closingTime) {

  if (!/^\d{2}:\d{2}$/.test(openingTime)) {

    return false;

  }

 

  if (!/^\d{2}:\d{2}$/.test(closingTime)) {

    return false;

  }

 

  return (

    convertTimeToMinutes(closingTime) >

    convertTimeToMinutes(openingTime)

  );

}

 

function setOpeningHoursSaving(isSaving) {

  if (!saveOpeningHoursButton) {

    return;

  }

 

  saveOpeningHoursButton.disabled = isSaving;

  saveOpeningHoursButton.textContent = isSaving

    ? "Saving..."

    : "Save Opening Hours";

}

 

function setWebsiteSettingsSaving(isSaving) {

  if (!saveWebsiteSettingsButton) {

    return;

  }

 

  saveWebsiteSettingsButton.disabled = isSaving;

  saveWebsiteSettingsButton.textContent = isSaving

    ? "Saving..."

    : "Save Settings";

}

 

function setOpeningHoursStatus(message, type = "") {

  setFormStatus(openingHoursSaveStatus, message, type);

}

 

function setWebsiteSettingsStatus(message, type = "") {

  setFormStatus(websiteSettingsSaveStatus, message, type);

}

 

function setFormStatus(element, message, type = "") {

  if (!element) {

    return;

  }

 

  element.textContent = message;

  element.classList.remove("is-success", "is-error");

 

  if (type === "success") {

    element.classList.add("is-success");

  }

 

  if (type === "error") {

    element.classList.add("is-error");

  }

}

