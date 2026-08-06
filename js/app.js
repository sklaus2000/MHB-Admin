/* ==========================================================

   Mountain Health Bar Admin

   Main Application

========================================================== */

 

"use strict";

 

document.addEventListener(

  "DOMContentLoaded",

  function () {

    initializeSecurity(

      startAdminApplication

    );

  }

);

 

async function startAdminApplication() {

  initializeNavigation();

  showPage("dashboard");

  renderQrCodes();

 

  await Promise.all([

    loadDashboard(),

    loadMenu(),

    loadSettings(),

    loadStatistics()

  ]);

}

