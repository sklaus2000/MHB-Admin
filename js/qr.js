/* ==========================================================
   Mountain Health Bar Admin
   QR Codes
========================================================== */
 
"use strict";
 
const GUEST_WEBSITE_URL = "https://spa-order.pages.dev";
 
const QR_LOCATIONS = [
  { key: "indoor-pool", name: "Indoor Pool" },
  { key: "outdoor-pool-mountain-side", name: "Outdoor Pool Mountain Side" },
  { key: "outdoor-pool-garden-side", name: "Outdoor Pool Garden Side" },
  { key: "outdoor-pool-restaurant-side", name: "Outdoor Pool Restaurant Side" },
  { key: "mountain-health-bar-indoor-area", name: "Mountain Health Bar Indoor Area" },
  { key: "pool-terrace", name: "Pool Terrace" }
];
 
const qrCodeList = document.getElementById("qrCodeList");
 
function renderQrCodes() {
  if (!qrCodeList) {
    return;
  }
 
  qrCodeList.innerHTML = "";
 
  QR_LOCATIONS.forEach(function (location) {
    const guestLink = GUEST_WEBSITE_URL + "/?area=" + location.key;
    const card = document.createElement("article");
    card.className = "qr-item";
 
    card.innerHTML = `
      <div class="qr-item-content">
        <div>
          <h3>${escapeHtml(location.name)}</h3>
          <p>${escapeHtml(guestLink)}</p>
        </div>
        <button class="copy-link-button" type="button">Copy Link</button>
      </div>
    `;
 
    const copyButton = card.querySelector(".copy-link-button");
    copyButton.addEventListener("click", async function () {
      await copyText(guestLink, "Guest link copied.");
    });
 
    qrCodeList.appendChild(card);
  });
}
