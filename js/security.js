/* ==========================================================

   Mountain Health Bar Admin

   Security Session

========================================================== */

 

"use strict";

 

const ADMIN_KEY_STORAGE =

  "mhbAdminAccessKey";

 

const securityGate =

  document.getElementById("securityGate");

 

const securityForm =

  document.getElementById("securityForm");

 

const securityAccessKey =

  document.getElementById("securityAccessKey");

 

const securityError =

  document.getElementById("securityError");

 

const securitySubmitButton =

  document.getElementById("securitySubmitButton");

 

const logoutButton =

  document.getElementById("logoutButton");

 

let securedApplicationStarted = false;

 

function initializeSecurity(onAuthenticated) {

  if (logoutButton) {

    logoutButton.addEventListener(

      "click",

      logoutAdmin

    );

  }

 

  if (securityForm) {

    securityForm.addEventListener(

      "submit",

      async function (event) {

        event.preventDefault();

 

        const accessKey =

          String(securityAccessKey?.value || "")

            .trim();

 

        if (!accessKey) {

          setSecurityError(

            "Please enter the admin access key."

          );

          return;

        }

 

        await authenticateAdmin(

          accessKey,

          onAuthenticated

        );

      }

    );

  }

 

  const storedKey =

    sessionStorage.getItem(

      ADMIN_KEY_STORAGE

    );

 

  if (storedKey) {

    authenticateAdmin(

      storedKey,

      onAuthenticated,

      true

    );

  } else {

    showSecurityGate();

  }

}

 

async function authenticateAdmin(

  accessKey,

  onAuthenticated,

  silent = false

) {

  setSecurityLoading(true);

 

  if (!silent) {

    setSecurityError("");

  }

 

  try {

    await apiVerifyAdminAccess(

      accessKey

    );

 

    sessionStorage.setItem(

      ADMIN_KEY_STORAGE,

      accessKey

    );

 

    hideSecurityGate();

 

    if (!securedApplicationStarted) {

      securedApplicationStarted = true;

      await onAuthenticated();

    }

 

  } catch (error) {

    console.error(

      "Admin authentication failed:",

      error

    );

 

    sessionStorage.removeItem(

      ADMIN_KEY_STORAGE

    );

 

    showSecurityGate();

    setSecurityError(

      silent

        ? "Your session has expired. Please sign in again."

        : "The admin access key is incorrect."

    );

  } finally {

    setSecurityLoading(false);

  }

}

 

function showSecurityGate() {

  if (!securityGate) {

    return;

  }

 

  securityGate.classList.remove(

    "hidden"

  );

  securityGate.setAttribute(

    "aria-hidden",

    "false"

  );

 

  window.setTimeout(function () {

    securityAccessKey?.focus();

  }, 50);

}

 

function hideSecurityGate() {

  if (!securityGate) {

    return;

  }

 

  securityGate.classList.add(

    "hidden"

  );

  securityGate.setAttribute(

    "aria-hidden",

    "true"

  );

 

  if (securityAccessKey) {

    securityAccessKey.value = "";

  }

}

 

function setSecurityError(message) {

  if (securityError) {

    securityError.textContent =

      message;

  }

}

 

function setSecurityLoading(isLoading) {

  if (!securitySubmitButton) {

    return;

  }

 

  securitySubmitButton.disabled =

    isLoading;

 

  securitySubmitButton.textContent =

    isLoading

      ? "Checking..."

      : "Open Admin";

}

 

function logoutAdmin() {

  sessionStorage.removeItem(

    ADMIN_KEY_STORAGE

  );

 

  window.location.reload();

}

