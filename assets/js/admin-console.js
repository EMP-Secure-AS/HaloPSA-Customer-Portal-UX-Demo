// Admin console UI wiring for navigation, pages, and layout editing
(function () {
  var navListEl;
  var pageListEl;
  var layoutPageSelect;
  var layoutSummaryEl;
  var layoutCanvasEl;
  var widgetVisibilityEl;
  var ticketOverridesEl;
  var roleCatalogEl;
  var widgetLibrary = [];
  var selectedPageId = null;
  var roles = [];

  function getPreviewRole() {
    if (window.AppState && window.AppState.getCurrentRole) {
      return window.AppState.getCurrentRole();
    }
    if (window.LayoutLibrary && window.LayoutLibrary.getDefaultRole) {
      return window.LayoutLibrary.getDefaultRole();
    }
    return "end_user";
  }

  function createPill(text) {
    var pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = text;
    return pill;
  }

  function createIconButton(label, direction) {
    var btn = document.createElement("button");
    btn.className = "btn btn-ghost btn-icon";
    btn.textContent = direction === "up" ? "↑" : "↓";
    btn.setAttribute("aria-label", label);
    return btn;
  }

  function renderNavManager() {
    if (!navListEl || !window.LayoutLibrary) return;
    var items = window.LayoutLibrary.getNavItemsForRole(getPreviewRole());
    navListEl.innerHTML = "";

    items.forEach(function (item, index) {
      var row = document.createElement("div");
      row.className = "list-row";

      var main = document.createElement("div");
      main.className = "list-row__main";
      var title = document.createElement("div");
      title.className = "list-row__title";
      title.textContent = item.label;
      main.appendChild(title);
      var meta = document.createElement("div");
      meta.className = "list-row__meta";
      meta.textContent = item.icon + " • " + item.route;
      main.appendChild(meta);
      var vis = document.createElement("div");
      vis.className = "list-row__meta";
      vis.textContent = "Visibility: " + item.visibleForRoles.length + " role(s)";
      main.appendChild(vis);

      var actions = document.createElement("div");
      actions.className = "list-row__actions";
      var up = createIconButton("Move up", "up");
      var down = createIconButton("Move down", "down");
      up.disabled = index === 0;
      down.disabled = index === items.length - 1;
      up.addEventListener("click", function () {
        window.LayoutLibrary.moveNavItem(item.id, -1);
        renderNavManager();
      });
      down.addEventListener("click", function () {
        window.LayoutLibrary.moveNavItem(item.id, 1);
        renderNavManager();
      });
      actions.appendChild(up);
      actions.appendChild(down);

      row.appendChild(main);
      row.appendChild(actions);
      navListEl.appendChild(row);
    });
  }

  function renderPageList() {
    if (!pageListEl || !window.LayoutLibrary) return;
    var previewRole = getPreviewRole();
    var pages = window.LayoutLibrary.getPagesForRole(previewRole);
    if (!selectedPageId && pages.length) {
      selectedPageId = pages[0].id;
    }
    if (!pages.find(function (p) { return p.id === selectedPageId; }) && pages.length) {
      selectedPageId = pages[0].id;
    }

    pageListEl.innerHTML = "";
    pages.forEach(function (page) {
      var row = document.createElement("div");
      row.className = "list-row";

      var main = document.createElement("div");
      main.className = "list-row__main";
      var title = document.createElement("div");
      title.className = "list-row__title";
      title.textContent = page.name;
      main.appendChild(title);
      var meta = document.createElement("div");
      meta.className = "list-row__meta";
      meta.textContent = page.route + " • " + page.type;
      main.appendChild(meta);
      var vis = document.createElement("div");
      vis.className = "list-row__meta";
      vis.textContent = "Visible to " + page.visibleForRoles.length + " role(s)";
      main.appendChild(vis);
      var status = document.createElement("div");
      status.appendChild(createPill(page.status));
      main.appendChild(status);

      var actions = document.createElement("div");
      actions.className = "list-row__actions";
      var editBtn = document.createElement("button");
      editBtn.className = "btn btn-secondary";
      editBtn.textContent = "Edit layout";
      editBtn.addEventListener("click", function () {
        selectedPageId = page.id;
        renderLayoutEditor();
      });
      actions.appendChild(editBtn);

      row.appendChild(main);
      row.appendChild(actions);
      pageListEl.appendChild(row);
    });
  }

  function renderLayoutSummary(page, layout) {
    layoutSummaryEl.innerHTML = "";

    var title = document.createElement("h3");
    title.style.margin = "0";
    title.textContent = page.name + " layout";
    layoutSummaryEl.appendChild(title);

    var meta = document.createElement("div");
    meta.className = "inline";
    meta.style.flexWrap = "wrap";
    meta.style.gap = "0.5rem";
    meta.appendChild(createPill(page.route));
    meta.appendChild(createPill(page.type.toUpperCase()));
    meta.appendChild(createPill(page.status));
    meta.appendChild(createPill(layout.rows.length + " row(s)"));
    layoutSummaryEl.appendChild(meta);

    var desc = document.createElement("p");
    desc.className = "muted";
    desc.style.margin = "0";
    desc.textContent = "Add or remove widgets to simulate a drag-and-drop builder.";
    layoutSummaryEl.appendChild(desc);
  }

  function renderWidgetChip(widget, pageId, rowId, colIndex) {
    var chip = document.createElement("div");
    chip.className = "widget-chip";
    var name = widgetLibrary.find(function (w) {
      return w.id === widget.id;
    });
    var label = name ? name.name : widget.id;
    if (widget.variant) {
      label += " • " + widget.variant;
    }
    chip.textContent = label;
    var rolesLabel = document.createElement("span");
    rolesLabel.className = "pill pill--ghost";
    var roleCount = (widget.visibleForRoles || []).length;
    rolesLabel.textContent = roleCount === roles.length ? "All roles" : roleCount + " role(s)";
    chip.appendChild(rolesLabel);

    var remove = document.createElement("button");
    remove.className = "btn btn-ghost btn-icon";
    remove.textContent = "✕";
    remove.setAttribute("aria-label", "Remove widget");
    remove.addEventListener("click", function () {
      window.LayoutLibrary.removeWidgetFromPage(pageId, rowId, colIndex, widget.id);
      renderLayoutEditor();
    });
    chip.appendChild(remove);
    return chip;
  }

  function renderColumnControls(pageId, row, columnIndex) {
    var control = document.createElement("div");
    control.className = "inline";
    control.style.marginTop = "0.5rem";
    control.style.gap = "0.5rem";

    var select = document.createElement("select");
    widgetLibrary.forEach(function (widget) {
      var opt = document.createElement("option");
      opt.value = widget.id;
      opt.textContent = widget.name;
      select.appendChild(opt);
    });

    var addBtn = document.createElement("button");
    addBtn.className = "btn btn-primary btn-compact";
    addBtn.textContent = "Add widget";
    addBtn.addEventListener("click", function () {
      window.LayoutLibrary.addWidgetToPage(pageId, row.id, columnIndex, select.value);
      renderLayoutEditor();
    });

    control.appendChild(select);
    control.appendChild(addBtn);
    return control;
  }

  function renderLayoutCanvas(pageId, layout) {
    layoutCanvasEl.innerHTML = "";
    layout.rows.forEach(function (row) {
      var rowEl = document.createElement("div");
      rowEl.className = "layout-row";

      var rowLabel = document.createElement("div");
      rowLabel.className = "layout-row__label";
      rowLabel.textContent = row.label;
      rowEl.appendChild(rowLabel);

      var columnsEl = document.createElement("div");
      columnsEl.className = "layout-row__columns";
      row.columns.forEach(function (col, colIndex) {
        var colEl = document.createElement("div");
        colEl.className = "layout-col";
        colEl.style.flexBasis = (col.width / 12) * 100 + "%";

        var header = document.createElement("div");
        header.className = "layout-col__header";
        header.textContent = "Column " + col.width + "/12";
        colEl.appendChild(header);

        var body = document.createElement("div");
        body.className = "layout-col__body";
        if (!col.widgets.length) {
          var empty = document.createElement("div");
          empty.className = "muted small-text";
          empty.textContent = "No widgets";
          body.appendChild(empty);
        } else {
          col.widgets.forEach(function (widget) {
            body.appendChild(renderWidgetChip(widget, pageId, row.id, colIndex));
          });
        }
        colEl.appendChild(body);

        colEl.appendChild(renderColumnControls(pageId, row, colIndex));
        columnsEl.appendChild(colEl);
      });

      rowEl.appendChild(columnsEl);
      layoutCanvasEl.appendChild(rowEl);
    });
  }

  function renderLayoutEditor() {
    if (!layoutPageSelect || !layoutSummaryEl || !layoutCanvasEl) return;
    var pages = window.LayoutLibrary.getPagesForRole(getPreviewRole());
    if (!pages.length) return;

    layoutPageSelect.innerHTML = "";
    pages.forEach(function (page) {
      var opt = document.createElement("option");
      opt.value = page.id;
      opt.textContent = page.name;
      if (page.id === selectedPageId) {
        opt.selected = true;
      }
      layoutPageSelect.appendChild(opt);
    });

    var activePage = pages.find(function (p) {
      return p.id === selectedPageId;
    }) || pages[0];
    selectedPageId = activePage.id;
    var layout = window.LayoutLibrary.getLayoutForRole(activePage.id, getPreviewRole());

    renderLayoutSummary(activePage, layout);
    renderLayoutCanvas(activePage.id, layout);
  }

  function wireAddPage() {
    var btn = document.getElementById("add-page-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var newIndex = window.LayoutLibrary.getPages().length + 1;
      var page = window.LayoutLibrary.addPage({
        name: "Custom Page " + newIndex,
        route: "/portal/custom-" + newIndex,
        status: "Draft"
      });
      selectedPageId = page.id;
      renderPageList();
      renderLayoutEditor();
    });
  }

  function wirePageSelect() {
    if (!layoutPageSelect) return;
    layoutPageSelect.addEventListener("change", function (event) {
      selectedPageId = event.target.value;
      renderLayoutEditor();
    });
  }

  function renderWidgetVisibilityControls() {
    if (!widgetVisibilityEl) return;
    var widgets = window.LayoutLibrary.getWidgetLibrary();
    var visibility = window.LayoutLibrary.getWidgetVisibility();
    widgetVisibilityEl.innerHTML = "";

    widgets.forEach(function (widget) {
      var row = document.createElement("div");
      row.className = "list-row";

      var main = document.createElement("div");
      main.className = "list-row__main";
      var title = document.createElement("div");
      title.className = "list-row__title";
      title.textContent = widget.name;
      var meta = document.createElement("div");
      meta.className = "list-row__meta";
      meta.textContent = widget.description;
      main.appendChild(title);
      main.appendChild(meta);

      var actions = document.createElement("div");
      actions.className = "list-row__actions";
      roles.forEach(function (role) {
        var label = document.createElement("label");
        label.className = "checkbox";
        var input = document.createElement("input");
        input.type = "checkbox";
        input.value = role.id;
        input.checked = (visibility[widget.id] || []).indexOf(role.id) > -1;
        input.addEventListener("change", function () {
          var current = new Set(visibility[widget.id] || []);
          if (input.checked) {
            current.add(role.id);
          } else {
            current.delete(role.id);
          }
          var updated = Array.from(current);
          window.LayoutLibrary.setWidgetVisibility(widget.id, updated);
          visibility = window.LayoutLibrary.getWidgetVisibility();
          renderLayoutEditor();
        });
        var text = document.createElement("span");
        text.textContent = role.label;
        label.appendChild(input);
        label.appendChild(text);
        actions.appendChild(label);
      });

      row.appendChild(main);
      row.appendChild(actions);
      widgetVisibilityEl.appendChild(row);
    });
  }

  function renderTicketRoleOverrides() {
    if (!ticketOverridesEl) return;
    var presets = window.LayoutLibrary.getTicketPresets();
    var presetList = Object.keys(presets).map(function (key) { return presets[key]; });
    ticketOverridesEl.innerHTML = "";

    roles.forEach(function (role) {
      var row = document.createElement("div");
      row.className = "list-row";

      var main = document.createElement("div");
      main.className = "list-row__main";
      var title = document.createElement("div");
      title.className = "list-row__title";
      title.textContent = role.label;
      var meta = document.createElement("div");
      meta.className = "list-row__meta";
      meta.textContent = role.description;
      main.appendChild(title);
      main.appendChild(meta);

      var actions = document.createElement("div");
      actions.className = "list-row__actions";
      var select = document.createElement("select");
      presetList.forEach(function (preset) {
        var opt = document.createElement("option");
        opt.value = preset.id;
        opt.textContent = preset.label;
        if (preset.id === window.LayoutLibrary.getTicketViewForRole(role.id).id) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });
      select.addEventListener("change", function (event) {
        window.LayoutLibrary.setTicketPresetForRole(role.id, event.target.value);
        renderLayoutEditor();
      });
      var helper = document.createElement("div");
      helper.className = "helper-text";
      helper.textContent = presets[select.value].description;
      select.addEventListener("change", function (event) {
        helper.textContent = presets[event.target.value].description;
      });

      actions.appendChild(select);
      actions.appendChild(helper);

      row.appendChild(main);
      row.appendChild(actions);
      ticketOverridesEl.appendChild(row);
    });
  }

  function renderRoleCatalog() {
    if (!roleCatalogEl) return;
    roleCatalogEl.innerHTML = "";
    var preview = getPreviewRole();

    roles.forEach(function (role) {
      var row = document.createElement("div");
      row.className = "list-row";
      var main = document.createElement("div");
      main.className = "list-row__main";
      var title = document.createElement("div");
      title.className = "list-row__title";
      title.textContent = role.label;
      var meta = document.createElement("div");
      meta.className = "list-row__meta";
      meta.textContent = role.description;
      main.appendChild(title);
      main.appendChild(meta);

      var pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = preview === role.id ? "Active" : "Preview";

      row.appendChild(main);
      row.appendChild(pill);
      roleCatalogEl.appendChild(row);
    });
  }

  function cacheElements() {
    navListEl = document.getElementById("nav-manager-list");
    pageListEl = document.getElementById("page-list");
    layoutPageSelect = document.getElementById("layout-page-select");
    layoutSummaryEl = document.getElementById("layout-summary");
    layoutCanvasEl = document.getElementById("layout-canvas");
    widgetVisibilityEl = document.getElementById("widget-visibility-table");
    ticketOverridesEl = document.getElementById("ticket-role-overrides");
    roleCatalogEl = document.getElementById("role-catalog");
  }

  function initAdminConsole() {
    if (!window.LayoutLibrary) return;
    widgetLibrary = window.LayoutLibrary.getWidgetLibrary();
    roles = window.LayoutLibrary.getRoles();
    cacheElements();
    renderNavManager();
    renderPageList();
    renderLayoutEditor();
    renderWidgetVisibilityControls();
    renderTicketRoleOverrides();
    renderRoleCatalog();
    wireAddPage();
    wirePageSelect();
  }

  window.AdminConsole = {
    init: initAdminConsole,
    refreshForRole: function () {
      renderNavManager();
      renderPageList();
      renderLayoutEditor();
      renderRoleCatalog();
    }
  };
})();
