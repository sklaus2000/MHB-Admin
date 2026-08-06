/* ==========================================================

   Mountain Health Bar Admin

   QR Code Manager

========================================================== */

 

"use strict";

 

 

/* ----------------------------------------------------------

   CONFIGURATION

---------------------------------------------------------- */

 

const GUEST_WEBSITE_URL =

  "https://spa-order.pages.dev";

 

const QR_LOCATIONS = [

  {

    key: "indoor-pool",

    name: "Indoor Pool"

  },

  {

    key: "outdoor-pool-mountain-side",

    name: "Outdoor Pool Mountain Side"

  },

  {

    key: "outdoor-pool-garden-side",

    name: "Outdoor Pool Garden Side"

  },

  {

    key: "outdoor-pool-restaurant-side",

    name: "Outdoor Pool Restaurant Side"

  },

  {

    key: "mountain-health-bar-indoor-area",

    name: "Mountain Health Bar Indoor Area"

  },

  {

    key: "pool-terrace",

    name: "Pool Terrace"

  }

];

 

 

/* ----------------------------------------------------------

   ELEMENTS

---------------------------------------------------------- */

 

const qrCodeList =

  document.getElementById(

    "qrCodeList"

  );

 

const printQrCodesButton =

  document.getElementById(

    "printQrCodesButton"

  );

 

 

/* ----------------------------------------------------------

   INITIALIZE

---------------------------------------------------------- */

 

let qrButtonsInitialized = false;

 

async function renderQrCodes() {

  if (!qrCodeList) {

    return;

  }

 

  qrCodeList.innerHTML = `

    <div class="request-empty-state">

      Creating QR codes...

    </div>

  `;

 

  if (

    typeof QRCode === "undefined" ||

    typeof QRCode.toCanvas !== "function"

  ) {

    qrCodeList.innerHTML = `

      <div class="qr-generation-error">

        The QR code library could not be loaded. Please check the internet connection and refresh the page.

      </div>

    `;

 

    showToast(

      "QR codes could not be created.",

      "error"

    );

 

    return;

  }

 

  qrCodeList.innerHTML = "";

 

  for (const location of QR_LOCATIONS) {

    await createQrCard(location);

  }

 

  initializeQrButtons();

}

 

 

/* ----------------------------------------------------------

   CREATE CARD

---------------------------------------------------------- */

 

async function createQrCard(location) {

  const guestLink =

    GUEST_WEBSITE_URL +

    "/?area=" +

    encodeURIComponent(location.key);

 

  const card =

    document.createElement("article");

 

  card.className = "qr-card";

 

  const canvasId =

    "qr-canvas-" + location.key;

 

  card.innerHTML = `

    <div class="qr-canvas-wrapper">

      <canvas

        id="${escapeHtml(canvasId)}"

        aria-label="QR code for ${escapeHtml(location.name)}"

      ></canvas>

    </div>

 

    <div class="qr-card-content">

      <h3>${escapeHtml(location.name)}</h3>

 

      <span class="qr-location-key">

        ${escapeHtml(location.key)}

      </span>

 

      <p class="qr-guest-link">

        ${escapeHtml(guestLink)}

      </p>

 

      <div class="qr-card-actions">

        <button

          class="qr-secondary-action"

          type="button"

          data-copy-link="${escapeHtml(guestLink)}"

        >

          Copy Link

        </button>

 

        <button

          class="qr-download-button"

          type="button"

          data-download-canvas="${escapeHtml(canvasId)}"

          data-download-name="${escapeHtml(location.key)}"

        >

          Download PNG

        </button>

 

        <button

          class="qr-open-button"

          type="button"

          data-open-link="${escapeHtml(guestLink)}"

        >

          Open Guest Page

        </button>

      </div>

    </div>

  `;

 

  qrCodeList.appendChild(card);

 

  const canvas =

    document.getElementById(canvasId);

 

  try {

    await QRCode.toCanvas(

      canvas,

      guestLink,

      {

        width: 320,

        margin: 2,

        errorCorrectionLevel: "H",

        color: {

          dark: "#111418",

          light: "#ffffff"

        }

      }

    );

  } catch (error) {

    console.error(

      "QR code could not be created:",

      error

    );

 

    card.querySelector(

      ".qr-canvas-wrapper"

    ).innerHTML = `

      <span class="request-empty-state">

        QR code unavailable

      </span>

    `;

  }

}

 

 

/* ----------------------------------------------------------

   BUTTONS

---------------------------------------------------------- */

 

function initializeQrButtons() {

  if (qrButtonsInitialized) {

    return;

  }

 

  qrCodeList.addEventListener(

    "click",

    async function (event) {

      const copyButton =

        event.target.closest(

          "[data-copy-link]"

        );

 

      if (copyButton) {

        await copyText(

          copyButton.dataset.copyLink,

          "Guest link copied."

        );

 

        return;

      }

 

      const downloadButton =

        event.target.closest(

          "[data-download-canvas]"

        );

 

      if (downloadButton) {

        downloadQrCode(

          downloadButton.dataset.downloadCanvas,

          downloadButton.dataset.downloadName

        );

 

        return;

      }

 

      const openButton =

        event.target.closest(

          "[data-open-link]"

        );

 

      if (openButton) {

        window.open(

          openButton.dataset.openLink,

          "_blank",

          "noopener,noreferrer"

        );

      }

    }

  );

 

  if (printQrCodesButton) {

    printQrCodesButton.addEventListener(

      "click",

      function () {

        window.print();

      }

    );

  }

 

  qrButtonsInitialized = true;

}

 

 

/* ----------------------------------------------------------

   DOWNLOAD PNG

---------------------------------------------------------- */

 

function downloadQrCode(

  canvasId,

  locationKey

) {

  const canvas =

    document.getElementById(canvasId);

 

  if (!canvas) {

    showToast(

      "QR code could not be downloaded.",

      "error"

    );

 

    return;

  }

 

  try {

    const downloadLink =

      document.createElement("a");

 

    downloadLink.href =

      canvas.toDataURL("image/png");

 

    downloadLink.download =

      "MHB-QR-" +

      String(locationKey || "location") +

      ".png";

 

    document.body.appendChild(

      downloadLink

    );

 

    downloadLink.click();

    downloadLink.remove();

 

    showToast(

      "QR code downloaded."

    );

 

  } catch (error) {

    console.error(

      "QR download error:",

      error

    );

 

    showToast(

      "QR code could not be downloaded.",

      "error"

    );

  }

}


