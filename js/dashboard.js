/* ==========================================================
   Mountain Health Bar Admin
   Dashboard
========================================================== */
 
"use strict";
 
const todayRequestsElement = document.getElementById("todayRequests");
const serviceCallsElement = document.getElementById("serviceCalls");
const towelRequestsElement = document.getElementById("towelRequests");
const serviceStatusDot = document.getElementById("serviceStatusDot");
const serviceStatusText = document.getElementById("serviceStatusText");
const serviceStatusNote = document.getElementById("serviceStatusNote");
const latestRequestsList = document.getElementById("latestRequestsList");
const refreshRequestsButton = document.getElementById("refreshRequestsButton");
 
const dashboardState = {
  openingTime: "11:00",
  closingTime: "17:00"
};
 
let dashboardButtonsInitialized = false;
 
async function loadDashboard() {
  await Promise.all([
    loadDashboardNumbers(),
    loadLatestRequests(),
    loadDashboardOpeningHours()
  ]);

  updateServiceStatus();
  initializeDashboardButtons();
  startDashboardAutoRefresh();
}
 
async function loadDashboardNumbers() {
  try {
    const result = await apiDashboard();
 
    if (todayRequestsElement) {
      todayRequestsElement.textContent = Number(result.todayRequests) || 0;
    }
 
    if (serviceCallsElement) {
      serviceCallsElement.textContent = Number(result.serviceCalls) || 0;
    }
 
    if (towelRequestsElement) {
      towelRequestsElement.textContent = Number(result.towelRequests) || 0;
    }
  } catch (error) {
    console.error("Dashboard data could not be loaded:", error);
 
    if (todayRequestsElement) todayRequestsElement.textContent = "!";
    if (serviceCallsElement) serviceCallsElement.textContent = "!";
    if (towelRequestsElement) towelRequestsElement.textContent = "!";
 
    showToast("Dashboard data could not be loaded.", "error");
  }
}
 
async function loadLatestRequests() {
  if (!latestRequestsList) {
    return;
  }
 
  latestRequestsList.innerHTML = `
    <div class="request-empty-state">
      Loading latest requests...
    </div>
  `;
 
  try {
    const result = await apiLatestRequests();
    const requests = Array.isArray(result.requests) ? result.requests : [];
    renderLatestRequests(requests);
  } catch (error) {
    console.error("Latest requests could not be loaded:", error);
    latestRequestsList.innerHTML = `
      <div class="request-empty-state">
        Latest requests could not be loaded.
      </div>
    `;
    showToast("Latest requests could not be loaded.", "error");
  }
}
 
function renderLatestRequests(requests) {
  if (!latestRequestsList) {
    return;
  }
 
  latestRequestsList.innerHTML = "";
 
  if (requests.length === 0) {
    latestRequestsList.innerHTML = `
      <div class="request-empty-state">
        No recent requests were found.
      </div>
    `;
    return;
  }
 
  requests.forEach(function (request) {
    const item = document.createElement("article");
    item.className = "request-item";
 
    const isTowelRequest = request.requestType === "Fresh Towels";
    const badgeClass = request.reminder
      ? "reminder"
      : isTowelRequest
        ? "towels"
        : "service";
 
    const badgeText = request.reminder
      ? "Reminder"
      : request.requestType || "Request";
 
    item.innerHTML = `
      <div class="request-time">
        ${escapeHtml(request.time || "—")}
      </div>
 
      <div class="request-main">
        <strong>${escapeHtml(request.location || "Unknown location")}</strong>
        <span>
          ${escapeHtml(request.requestId || "")}
          ·
          ${escapeHtml(request.date || "")}
        </span>
      </div>
 
      <span class="request-type-badge ${badgeClass}">
        ${escapeHtml(badgeText)}
      </span>
    `;
 
    latestRequestsList.appendChild(item);
  });
}
 
async function loadDashboardOpeningHours() {
  try {
    const result = await apiSettings();
    const settings = result.settings || {};
    const openingSetting = settings["Opening Time"];
    const closingSetting = settings["Closing Time"];
 
    if (openingSetting?.en) {
      dashboardState.openingTime = normalizeTime(openingSetting.en);
    }
 
    if (closingSetting?.en) {
      dashboardState.closingTime = normalizeTime(closingSetting.en);
    }
  } catch (error) {
    console.error("Dashboard opening hours could not be loaded:", error);
  }
}
 
function updateServiceStatus() {
  const isOpen = checkIfServiceIsOpen();
 
  if (serviceStatusText) {
    serviceStatusText.textContent = isOpen ? "Open" : "Closed";
  }
 
  if (serviceStatusNote) {
    serviceStatusNote.textContent =
      "Available from " +
      dashboardState.openingTime +
      " to " +
      dashboardState.closingTime;
  }
 
  if (serviceStatusDot) {
    serviceStatusDot.classList.toggle("closed", !isOpen);
  }
}
 
function checkIfServiceIsOpen() {
  const viennaTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Vienna",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
 
  const currentMinutes = convertTimeToMinutes(viennaTime);
  const openingMinutes = convertTimeToMinutes(dashboardState.openingTime);
  const closingMinutes = convertTimeToMinutes(dashboardState.closingTime);
 
  return currentMinutes >= openingMinutes && currentMinutes < closingMinutes;
}
 
function initializeDashboardButtons() {
  if (dashboardButtonsInitialized || !refreshRequestsButton) {
    return;
  }
 
  refreshRequestsButton.addEventListener("click", async function () {
    refreshRequestsButton.disabled = true;
    refreshRequestsButton.textContent = "Loading...";
 
    await Promise.all([
      loadDashboardNumbers(),
      loadLatestRequests(),
      loadDashboardOpeningHours()
    ]);
 
    updateServiceStatus();
    refreshRequestsButton.disabled = false;
    refreshRequestsButton.textContent = "Refresh";
    showToast("Dashboard refreshed.");
  });
 
  dashboardButtonsInitialized = true;
}
/* ----------------------------------------------------------
   AUTOMATIC REFRESH
---------------------------------------------------------- */

let dashboardRefreshInterval = null;

function startDashboardAutoRefresh() {
  if (dashboardRefreshInterval) {
    window.clearInterval(
      dashboardRefreshInterval
    );
  }

  dashboardRefreshInterval =
    window.setInterval(
      async function () {
        await Promise.all([
          loadDashboardNumbers(),
          loadLatestRequests(),
          loadDashboardOpeningHours()
        ]);

        updateServiceStatus();
      },
      30000
    );
}