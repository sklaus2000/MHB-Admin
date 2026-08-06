/* ==========================================================

   Mountain Health Bar Admin

   Main Application

========================================================== */

 

"use strict";

 

document.addEventListener("DOMContentLoaded", async function () {

  initializeNavigation();

  showPage("dashboard");

  renderQrCodes();

 

  await Promise.all([

    loadDashboard(),

    loadMenu(),

    loadSettings()

  ]);

});