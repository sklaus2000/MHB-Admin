/* ==========================================================

   Mountain Health Bar Admin

   Statistics

========================================================== */

 

"use strict";

 

 

/* ----------------------------------------------------------

   ELEMENTS

---------------------------------------------------------- */

 

const statisticsTodayTotal =

  document.getElementById("statisticsTodayTotal");

 

const statisticsWeekTotal =

  document.getElementById("statisticsWeekTotal");

 

const statisticsMonthTotal =

  document.getElementById("statisticsMonthTotal");

 

const statisticsTopArea =

  document.getElementById("statisticsTopArea");

 

const statisticsTopAreaNote =

  document.getElementById("statisticsTopAreaNote");

 

const statisticsServiceCalls =

  document.getElementById("statisticsServiceCalls");

 

const statisticsTowelRequests =

  document.getElementById("statisticsTowelRequests");

 

const statisticsDailyBars =

  document.getElementById("statisticsDailyBars");

 

const statisticsAreaList =

  document.getElementById("statisticsAreaList");

 

const refreshStatisticsButton =

  document.getElementById("refreshStatisticsButton");

 

 

/* ----------------------------------------------------------

   LOAD STATISTICS

---------------------------------------------------------- */

 

let statisticsButtonsInitialized = false;

 

async function loadStatistics() {

  setStatisticsLoadingState();

 

  try {

    const result = await apiStatistics();

    const statistics = result.statistics || {};

 

    renderStatisticsSummary(statistics);

    renderStatisticsDailyBars(statistics.daily || []);

    renderStatisticsAreas(statistics.areas || []);

 

  } catch (error) {

    console.error(

      "Statistics could not be loaded:",

      error

    );

 

    setStatisticsErrorState();

 

    showToast(

      "Statistics could not be loaded.",

      "error"

    );

  }

 

  initializeStatisticsButtons();

}

 

 

/* ----------------------------------------------------------

   SUMMARY

---------------------------------------------------------- */

 

function renderStatisticsSummary(statistics) {

  if (statisticsTodayTotal) {

    statisticsTodayTotal.textContent =

      Number(statistics.todayTotal) || 0;

  }

 

  if (statisticsWeekTotal) {

    statisticsWeekTotal.textContent =

      Number(statistics.weekTotal) || 0;

  }

 

  if (statisticsMonthTotal) {

    statisticsMonthTotal.textContent =

      Number(statistics.monthTotal) || 0;

  }

 

  if (statisticsServiceCalls) {

    statisticsServiceCalls.textContent =

      Number(statistics.weekServiceCalls) || 0;

  }

 

  if (statisticsTowelRequests) {

    statisticsTowelRequests.textContent =

      Number(statistics.weekTowelRequests) || 0;

  }

 

  const topArea = statistics.topArea || {};

 

  if (statisticsTopArea) {

    statisticsTopArea.textContent =

      topArea.name || "—";

  }

 

  if (statisticsTopAreaNote) {

    const count =

      Number(topArea.count) || 0;

 

    statisticsTopAreaNote.textContent =

      count > 0

        ? count + " requests during the last seven days"

        : "No requests available";

  }

}

 

 

/* ----------------------------------------------------------

   DAILY BARS

---------------------------------------------------------- */

 

function renderStatisticsDailyBars(days) {

  if (!statisticsDailyBars) {

    return;

  }

 

  statisticsDailyBars.innerHTML = "";

 

  if (!Array.isArray(days) || days.length === 0) {

    statisticsDailyBars.innerHTML = `

      <div class="request-empty-state">

        No daily statistics are available.

      </div>

    `;

 

    return;

  }

 

  const maximum =

    Math.max(

      1,

      ...days.map(function (day) {

        return Number(day.total) || 0;

      })

    );

 

  days.forEach(function (day) {

    const total =

      Number(day.total) || 0;

 

    const percentage =

      Math.max(

        total > 0 ? 8 : 0,

        Math.round(

          total / maximum * 100

        )

      );

 

    const row =

      document.createElement("div");

 

    row.className =

      "statistics-bar-row";

 

    row.innerHTML = `

      <span class="statistics-bar-label">

        ${escapeHtml(day.label || day.date || "—")}

      </span>

 

      <div class="statistics-bar-track">

        <span

          class="statistics-bar-fill"

          style="width: ${percentage}%"

        ></span>

      </div>

 

      <strong class="statistics-bar-number">

        ${total}

      </strong>

    `;

 

    statisticsDailyBars.appendChild(row);

  });

}

 

 

/* ----------------------------------------------------------

   AREAS

---------------------------------------------------------- */

 

function renderStatisticsAreas(areas) {

  if (!statisticsAreaList) {

    return;

  }

 

  statisticsAreaList.innerHTML = "";

 

  if (!Array.isArray(areas) || areas.length === 0) {

    statisticsAreaList.innerHTML = `

      <div class="request-empty-state">

        No area statistics are available.

      </div>

    `;

 

    return;

  }

 

  const maximum =

    Math.max(

      1,

      ...areas.map(function (area) {

        return Number(area.count) || 0;

      })

    );

 

  areas.forEach(function (area) {

    const count =

      Number(area.count) || 0;

 

    const percentage =

      Math.round(

        count / maximum * 100

      );

 

    const item =

      document.createElement("div");

 

    item.className =

      "statistics-area-row";

 

    item.innerHTML = `

      <div class="statistics-area-heading">

        <strong>

          ${escapeHtml(area.name || "Unknown area")}

        </strong>

 

        <span>

          ${count}

        </span>

      </div>

 

      <div class="statistics-area-track">

        <span

          class="statistics-area-fill"

          style="width: ${percentage}%"

        ></span>

      </div>

    `;

 

    statisticsAreaList.appendChild(item);

  });

}

 

 

/* ----------------------------------------------------------

   STATES

---------------------------------------------------------- */

 

function setStatisticsLoadingState() {

  if (statisticsDailyBars) {

    statisticsDailyBars.innerHTML = `

      <div class="request-empty-state">

        Loading statistics...

      </div>

    `;

  }

 

  if (statisticsAreaList) {

    statisticsAreaList.innerHTML = `

      <div class="request-empty-state">

        Loading areas...

      </div>

    `;

  }

}

 

 

function setStatisticsErrorState() {

  if (statisticsDailyBars) {

    statisticsDailyBars.innerHTML = `

      <div class="qr-generation-error">

        Statistics could not be loaded.

      </div>

    `;

  }

 

  if (statisticsAreaList) {

    statisticsAreaList.innerHTML = `

      <div class="qr-generation-error">

        Area statistics could not be loaded.

      </div>

    `;

  }

}

 

 

/* ----------------------------------------------------------

   BUTTON

---------------------------------------------------------- */

 

function initializeStatisticsButtons() {

  if (

    statisticsButtonsInitialized ||

    !refreshStatisticsButton

  ) {

    return;

  }

 

  refreshStatisticsButton.addEventListener(

    "click",

    async function () {

      refreshStatisticsButton.disabled =

        true;

 

      refreshStatisticsButton.textContent =

        "Loading...";

 

      await loadStatistics();

 

      refreshStatisticsButton.disabled =

        false;

 

      refreshStatisticsButton.textContent =

        "Refresh Statistics";

 

      showToast(

        "Statistics refreshed."

      );

    }

  );

 

  statisticsButtonsInitialized = true;

}

