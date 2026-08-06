/* ==========================================================
   Mountain Health Bar Admin
   API
========================================================== */
 
"use strict";
 
const API_BASE_URL =
  "https://script.google.com/macros/s/AKfycbxUEfzSQbKEnNMXF2x9OnRTMge1eYmazwi5v9EoygSbo15LSZUMMkCzfVhlexPfKPfK/exec";
 
const API_URLS = {
  dashboard: `${API_BASE_URL}?action=dashboard`,
  latestRequests: `${API_BASE_URL}?action=latestRequests`,
  menu: `${API_BASE_URL}?action=menu`,
  adminMenu: `${API_BASE_URL}?action=adminMenu`,
  categories: `${API_BASE_URL}?action=categories`,
  settings: `${API_BASE_URL}?action=settings`
};
 
async function fetchJson(url) {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store"
  });
 
  if (!response.ok) {
    throw new Error("HTTP Error " + response.status);
  }
 
  const result = await response.json();
 
  if (result && result.success === false) {
    throw new Error(
      result.message ||
      "Unknown server error."
    );
  }
 
  return result;
}
 
async function postJson(payload) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });
 
  if (!response.ok) {
    throw new Error("HTTP Error " + response.status);
  }
 
  const result = await response.json();
 
  if (!result || result.success !== true) {
    throw new Error(
      result?.message ||
      "The changes could not be saved."
    );
  }
 
  return result;
}
 
async function apiDashboard() {
  return await fetchJson(API_URLS.dashboard);
}
 
async function apiLatestRequests() {
  return await fetchJson(API_URLS.latestRequests);
}
 
async function apiMenu() {
  return await fetchJson(API_URLS.menu);
}
 
async function apiAdminMenu() {
  return await fetchJson(API_URLS.adminMenu);
}
 
async function apiCategories() {
  return await fetchJson(API_URLS.categories);
}
 
async function apiSettings() {
  return await fetchJson(API_URLS.settings);
}
 
async function apiSaveMenuItem(item) {
  return await postJson({
    action: "adminUpdateMenuItem",
    item: item
  });
}
