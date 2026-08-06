/* ==========================================================
   Mountain Health Bar Admin
   Menu Editor
========================================================== */
 
"use strict";
 
const menuTableBody =
  document.getElementById("menuTableBody");
 
const refreshMenuButton =
  document.getElementById("refreshMenuButton");
 
const menuSearchInput =
  document.getElementById("menuSearchInput");
 
const menuCategoryFilter =
  document.getElementById("menuCategoryFilter");
 
const menuEditorModal =
  document.getElementById("menuEditorModal");
 
const menuEditorForm =
  document.getElementById("menuEditorForm");
 
const closeMenuEditorButton =
  document.getElementById("closeMenuEditorButton");
 
const cancelMenuEditorButton =
  document.getElementById("cancelMenuEditorButton");
 
const saveMenuItemButton =
  document.getElementById("saveMenuItemButton");
 
const menuRowNumber =
  document.getElementById("menuRowNumber");
 
const menuItemId =
  document.getElementById("menuItemId");
 
const menuNameEn =
  document.getElementById("menuNameEn");
 
const menuNameDe =
  document.getElementById("menuNameDe");
 
const menuDescriptionEn =
  document.getElementById("menuDescriptionEn");
 
const menuDescriptionDe =
  document.getElementById("menuDescriptionDe");
 
const menuVolumeEn =
  document.getElementById("menuVolumeEn");
 
const menuVolumeDe =
  document.getElementById("menuVolumeDe");
 
const menuCategory =
  document.getElementById("menuCategory");
 
const menuPrice =
  document.getElementById("menuPrice");
 
const menuSortOrder =
  document.getElementById("menuSortOrder");
 
const menuVisible =
  document.getElementById("menuVisible");
 
const menuState = {
  items: [],
  categories: [],
  search: "",
  category: ""
};
 
let menuButtonsInitialized = false;
 
async function loadMenu() {
  await Promise.all([
    loadMenuCategories(),
    loadMenuItems()
  ]);
 
  renderCategoryControls();
  renderMenuTable();
  initializeMenuButtons();
}
 
async function loadMenuCategories() {
  try {
    const result = await apiCategories();
 
    menuState.categories =
      Array.isArray(result.categories)
        ? result.categories
        : [];
  } catch (error) {
    console.error(
      "Menu categories could not be loaded:",
      error
    );
 
    menuState.categories = [];
  }
}
 
async function loadMenuItems() {
  if (!menuTableBody) {
    return;
  }
 
  menuTableBody.innerHTML = `
    <tr>
      <td colspan="6">Loading menu...</td>
    </tr>
  `;
 
  try {
    const result = await apiAdminMenu();
 
    menuState.items =
      Array.isArray(result.items)
        ? result.items
        : [];
  } catch (error) {
    console.error(
      "Admin menu could not be loaded:",
      error
    );
 
    menuState.items = [];
 
    menuTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          The menu could not be loaded.
        </td>
      </tr>
    `;
 
    showToast(
      "Menu could not be loaded.",
      "error"
    );
  }
}
 
function renderCategoryControls() {
  if (menuCategoryFilter) {
    menuCategoryFilter.innerHTML = `
      <option value="">All categories</option>
    `;
  }
 
  if (menuCategory) {
    menuCategory.innerHTML = "";
  }
 
  menuState.categories.forEach(function (category) {
    const name =
      category.name?.en ||
      category.name?.de ||
      category.id;
 
    if (menuCategoryFilter) {
      const filterOption =
        document.createElement("option");
 
      filterOption.value = category.id;
      filterOption.textContent = name;
 
      menuCategoryFilter.appendChild(
        filterOption
      );
    }
 
    if (menuCategory) {
      const editorOption =
        document.createElement("option");
 
      editorOption.value = category.id;
      editorOption.textContent = name;
 
      menuCategory.appendChild(
        editorOption
      );
    }
  });
}
 
function renderMenuTable() {
  if (!menuTableBody) {
    return;
  }
 
  const filteredItems =
    getFilteredMenuItems();
 
  menuTableBody.innerHTML = "";
 
  if (filteredItems.length === 0) {
    menuTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          No matching menu products were found.
        </td>
      </tr>
    `;
 
    return;
  }
 
  filteredItems.forEach(function (item) {
    const row =
      document.createElement("tr");
 
    const productName =
      item.name?.en ||
      item.name?.de ||
      "Unnamed Product";
 
    const categoryName =
      getMenuCategoryName(item.category);
 
    const volume =
      item.volume?.en ||
      item.volume?.de ||
      "—";
 
    const visibleText =
      item.visible ? "Yes" : "No";
 
    row.innerHTML = `
      <td>
        <strong>${escapeHtml(productName)}</strong>
      </td>
      <td>${escapeHtml(categoryName)}</td>
      <td>${escapeHtml(volume)}</td>
      <td>${escapeHtml(formatPrice(item.price))}</td>
      <td>
        <span class="visibility-status ${
          item.visible
            ? "is-visible"
            : "is-hidden"
        }">
          ${visibleText}
        </span>
      </td>
      <td>
        <button
          class="edit-product-button"
          type="button"
          data-item-id="${escapeHtml(item.id)}"
        >
          Edit
        </button>
      </td>
    `;
 
    const editButton =
      row.querySelector(
        ".edit-product-button"
      );
 
    editButton.addEventListener(
      "click",
      function () {
        openMenuEditor(item.id);
      }
    );
 
    menuTableBody.appendChild(row);
  });
}
 
function getFilteredMenuItems() {
  const search =
    menuState.search
      .trim()
      .toLowerCase();
 
  return [...menuState.items]
    .filter(function (item) {
      const categoryMatches =
        !menuState.category ||
        item.category === menuState.category;
 
      const searchableText = [
        item.id,
        item.name?.en,
        item.name?.de,
        item.description?.en,
        item.description?.de
      ]
        .join(" ")
        .toLowerCase();
 
      const searchMatches =
        !search ||
        searchableText.includes(search);
 
      return (
        categoryMatches &&
        searchMatches
      );
    })
    .sort(function (firstItem, secondItem) {
      return (
        Number(firstItem.sortOrder || 9999) -
        Number(secondItem.sortOrder || 9999)
      );
    });
}
 
function getMenuCategoryName(categoryId) {
  const category =
    menuState.categories.find(
      function (entry) {
        return entry.id === categoryId;
      }
    );
 
  if (!category) {
    return categoryId || "Unknown";
  }
 
  return (
    category.name?.en ||
    category.name?.de ||
    category.id
  );
}
 
function openMenuEditor(itemId) {
  const item =
    menuState.items.find(
      function (entry) {
        return entry.id === itemId;
      }
    );
 
  if (!item || !menuEditorModal) {
    return;
  }
 
  menuRowNumber.value =
    String(item.rowNumber || "");
 
  menuItemId.value =
    item.id || "";
 
  menuNameEn.value =
    item.name?.en || "";
 
  menuNameDe.value =
    item.name?.de || "";
 
  menuDescriptionEn.value =
    item.description?.en || "";
 
  menuDescriptionDe.value =
    item.description?.de || "";
 
  menuVolumeEn.value =
    item.volume?.en || "";
 
  menuVolumeDe.value =
    item.volume?.de || "";
 
  menuCategory.value =
    item.category || "";
 
  menuPrice.value =
    item.price ?? "";
 
  menuSortOrder.value =
    item.sortOrder || 1;
 
  menuVisible.checked =
    item.visible === true;
 
  menuEditorModal.classList.remove(
    "hidden"
  );
 
  menuEditorModal.setAttribute(
    "aria-hidden",
    "false"
  );
 
  document.body.style.overflow =
    "hidden";
 
  menuNameEn.focus();
}
 
function closeMenuEditor() {
  if (!menuEditorModal) {
    return;
  }
 
  menuEditorModal.classList.add(
    "hidden"
  );
 
  menuEditorModal.setAttribute(
    "aria-hidden",
    "true"
  );
 
  document.body.style.overflow = "";
 
  menuEditorForm?.reset();
}
 
async function saveMenuItem(event) {
  event.preventDefault();
 
  const payload = {
    rowNumber:
      Number(menuRowNumber.value),
 
    id:
      menuItemId.value.trim(),
 
    category:
      menuCategory.value,
 
    name: {
      en: menuNameEn.value.trim(),
      de: menuNameDe.value.trim()
    },
 
    description: {
      en: menuDescriptionEn.value.trim(),
      de: menuDescriptionDe.value.trim()
    },
 
    volume: {
      en: menuVolumeEn.value.trim(),
      de: menuVolumeDe.value.trim()
    },
 
    price:
      Number(menuPrice.value),
 
    visible:
      menuVisible.checked,
 
    sortOrder:
      Number(menuSortOrder.value)
  };
 
  if (
    !payload.rowNumber ||
    !payload.id ||
    !payload.category ||
    !payload.name.en ||
    !payload.name.de ||
    Number.isNaN(payload.price) ||
    Number.isNaN(payload.sortOrder)
  ) {
    showToast(
      "Please complete all required fields.",
      "error"
    );
 
    return;
  }
 
  saveMenuItemButton.disabled = true;
  saveMenuItemButton.textContent =
    "Saving...";
 
  try {
    await apiSaveMenuItem(payload);
 
    await loadMenuItems();
    renderMenuTable();
 
    closeMenuEditor();
 
    showToast(
      "Product saved successfully."
    );
  } catch (error) {
    console.error(
      "Product could not be saved:",
      error
    );
 
    showToast(
      error.message ||
      "Product could not be saved.",
      "error"
    );
  } finally {
    saveMenuItemButton.disabled = false;
    saveMenuItemButton.textContent =
      "Save Product";
  }
}
 
function initializeMenuButtons() {
  if (menuButtonsInitialized) {
    return;
  }
 
  refreshMenuButton?.addEventListener(
    "click",
    async function () {
      refreshMenuButton.disabled = true;
      refreshMenuButton.textContent =
        "Loading...";
 
      await Promise.all([
        loadMenuCategories(),
        loadMenuItems()
      ]);
 
      renderCategoryControls();
      renderMenuTable();
 
      refreshMenuButton.disabled = false;
      refreshMenuButton.textContent =
        "Refresh";
 
      showToast("Menu refreshed.");
    }
  );
 
  menuSearchInput?.addEventListener(
    "input",
    function () {
      menuState.search =
        menuSearchInput.value;
 
      renderMenuTable();
    }
  );
 
  menuCategoryFilter?.addEventListener(
    "change",
    function () {
      menuState.category =
        menuCategoryFilter.value;
 
      renderMenuTable();
    }
  );
 
  closeMenuEditorButton?.addEventListener(
    "click",
    closeMenuEditor
  );
 
  cancelMenuEditorButton?.addEventListener(
    "click",
    closeMenuEditor
  );
 
  menuEditorModal?.addEventListener(
    "click",
    function (event) {
      if (event.target === menuEditorModal) {
        closeMenuEditor();
      }
    }
  );
 
  menuEditorForm?.addEventListener(
    "submit",
    saveMenuItem
  );
 
  document.addEventListener(
    "keydown",
    function (event) {
      if (
        event.key === "Escape" &&
        !menuEditorModal?.classList.contains(
          "hidden"
        )
      ) {
        closeMenuEditor();
      }
    }
  );
 
  menuButtonsInitialized = true;
}
