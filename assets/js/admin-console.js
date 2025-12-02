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
  var dnsConfigEl;
  var portalTitleInput;
  var portalHeadlineInput;
  var portalMessageInput;
  var portalBannerInput;
  var logoTextInput;
  var logoUrlInput;
  var primaryColorInput;
  var accentColorInput;
  var headerColorInput;
  var authSettingsEl;
  var navTogglePanelEl;
  var customNavPanelEl;
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
          renderDnsConfigPanel();
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

  function renderDnsConfigPanel() {
    if (!dnsConfigEl) return;
    var config = window.LayoutLibrary.getWidgetConfig("dns-manager");
    var visibility = window.LayoutLibrary.getWidgetVisibility();
    var dnsRoles = visibility["dns-manager"] || [];
    dnsConfigEl.innerHTML = "";

    function createTextField(labelText, value, placeholder, onChange) {
      var field = document.createElement("label");
      field.className = "stack";
      field.style.gap = "0.25rem";
      var title = document.createElement("div");
      title.className = "list-row__title";
      title.textContent = labelText;
      var input = document.createElement("input");
      input.type = "text";
      input.className = "text-input";
      input.value = value || "";
      if (placeholder) input.placeholder = placeholder;
      input.addEventListener("input", function (event) {
        onChange(event.target.value);
      });
      field.appendChild(title);
      field.appendChild(input);
      return field;
    }

    dnsConfigEl.appendChild(
      createTextField("Provider name", config.providerName, "e.g. Acme DNS Cloud", function (value) {
        window.LayoutLibrary.updateWidgetConfig("dns-manager", { providerName: value });
      })
    );

    dnsConfigEl.appendChild(
      createTextField("API base URL", config.apiBaseUrl, "https://api.dns.example.com", function (value) {
        window.LayoutLibrary.updateWidgetConfig("dns-manager", { apiBaseUrl: value });
      })
    );

    dnsConfigEl.appendChild(
      createTextField("Default domain filter", config.defaultDomain, "acme.com", function (value) {
        window.LayoutLibrary.updateWidgetConfig("dns-manager", { defaultDomain: value });
      })
    );

    var rolesWrapper = document.createElement("div");
    rolesWrapper.className = "stack";
    rolesWrapper.style.gap = "0.25rem";
    var rolesLabel = document.createElement("div");
    rolesLabel.className = "list-row__title";
    rolesLabel.textContent = "Role access";
    var helper = document.createElement("div");
    helper.className = "helper-text";
    helper.textContent = "Only selected roles will see the DNS Manager widget.";
    rolesWrapper.appendChild(rolesLabel);
    rolesWrapper.appendChild(helper);

    var roleList = document.createElement("div");
    roleList.className = "inline";
    roleList.style.flexWrap = "wrap";
    roleList.style.gap = "0.5rem";

    roles.forEach(function (role) {
      var label = document.createElement("label");
      label.className = "checkbox";
      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = role.id;
      input.checked = dnsRoles.indexOf(role.id) > -1;
      input.addEventListener("change", function () {
        var currentRoles = new Set(dnsRoles);
        if (input.checked) {
          currentRoles.add(role.id);
        } else {
          currentRoles.delete(role.id);
        }
        var updatedRoles = Array.from(currentRoles);
        window.LayoutLibrary.setWidgetVisibility("dns-manager", updatedRoles);
        dnsRoles = updatedRoles;
        renderWidgetVisibilityControls();
      });
      var text = document.createElement("span");
      text.textContent = role.label;
      label.appendChild(input);
      label.appendChild(text);
      roleList.appendChild(label);
    });

    rolesWrapper.appendChild(roleList);
    dnsConfigEl.appendChild(rolesWrapper);

    var summary = document.createElement("div");
    summary.className = "helper-text";
    summary.textContent =
      "Configurable mock widget; settings are stored client-side for demo purposes.";
    dnsConfigEl.appendChild(summary);
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
    dnsConfigEl = document.getElementById("dns-config");
    portalTitleInput = document.getElementById("portal-title-input");
    portalHeadlineInput = document.getElementById("portal-headline-input");
    portalMessageInput = document.getElementById("portal-message-input");
    portalBannerInput = document.getElementById("portal-banner-input");
    logoTextInput = document.getElementById("logo-text-input");
    logoUrlInput = document.getElementById("logo-url-input");
    primaryColorInput = document.getElementById("primary-color-input");
    accentColorInput = document.getElementById("accent-color-input");
    headerColorInput = document.getElementById("header-color-input");
    authSettingsEl = document.getElementById("auth-settings");
    navTogglePanelEl = document.getElementById("nav-toggle-panel");
    customNavPanelEl = document.getElementById("custom-nav-panel");
  }

  function updatePortalSettings(partial) {
    window.LayoutLibrary.updatePortalSettings(partial);
    if (window.AppState && window.AppState.applyBranding) {
      window.AppState.applyBranding();
    }
  }

  function attachInputHandler(input, getValue, mapper) {
    if (!input || input.dataset.bound) return;
    input.addEventListener("input", function () {
      var value = getValue();
      mapper(value);
    });
    input.dataset.bound = "true";
  }

  function renderPortalBasics() {
    if (!portalTitleInput) return;
    var settings = window.LayoutLibrary.getPortalSettings();
    portalTitleInput.value = settings.portalTitle || "";
    portalHeadlineInput.value = settings.welcomeHeadline || "";
    portalMessageInput.value = settings.welcomeMessage || "";
    portalBannerInput.value = settings.bannerText || "";

    attachInputHandler(portalTitleInput, function () { return portalTitleInput.value; }, function (val) {
      updatePortalSettings({ portalTitle: val });
    });
    attachInputHandler(portalHeadlineInput, function () { return portalHeadlineInput.value; }, function (val) {
      updatePortalSettings({ welcomeHeadline: val });
    });
    attachInputHandler(portalMessageInput, function () { return portalMessageInput.value; }, function (val) {
      updatePortalSettings({ welcomeMessage: val });
    });
    attachInputHandler(portalBannerInput, function () { return portalBannerInput.value; }, function (val) {
      updatePortalSettings({ bannerText: val });
    });
  }

  function renderBrandingForm() {
    if (!logoTextInput) return;
    var settings = window.LayoutLibrary.getPortalSettings();
    logoTextInput.value = settings.logoText || "";
    logoUrlInput.value = settings.logoUrl || "";
    primaryColorInput.value = settings.primaryColor || "#1363df";
    accentColorInput.value = settings.accentColor || "#12c4ad";
    headerColorInput.value = settings.headerColor || "#0b1f3b";

    attachInputHandler(logoTextInput, function () { return logoTextInput.value; }, function (val) {
      updatePortalSettings({ logoText: val });
    });
    attachInputHandler(logoUrlInput, function () { return logoUrlInput.value; }, function (val) {
      updatePortalSettings({ logoUrl: val });
    });
    attachInputHandler(primaryColorInput, function () { return primaryColorInput.value; }, function (val) {
      updatePortalSettings({ primaryColor: val });
    });
    attachInputHandler(accentColorInput, function () { return accentColorInput.value; }, function (val) {
      updatePortalSettings({ accentColor: val });
    });
    attachInputHandler(headerColorInput, function () { return headerColorInput.value; }, function (val) {
      updatePortalSettings({ headerColor: val });
    });
  }

  function createToggleRow(labelText, flag, helperText, options) {
    var row = document.createElement("label");
    row.className = "list-row";
    var main = document.createElement("div");
    main.className = "list-row__main";
    var title = document.createElement("div");
    title.className = "list-row__title";
    title.textContent = labelText;
    var helper = document.createElement("div");
    helper.className = "helper-text";
    helper.textContent = helperText;
    main.appendChild(title);
    main.appendChild(helper);

    var actions = document.createElement("div");
    actions.className = "list-row__actions";
    var input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!flag.value;
    input.addEventListener("change", function () {
      flag.onChange(input.checked);
    });
    if (options && options.disabled) {
      input.disabled = true;
    }
    actions.appendChild(input);

    row.appendChild(main);
    row.appendChild(actions);
    return row;
  }

  function renderAuthSettings() {
    if (!authSettingsEl) return;
    var flags = window.LayoutLibrary.getBehaviourFlags();
    authSettingsEl.innerHTML = "";

    var authRows = [
      {
        label: "Allow portal login",
        key: "allowLogin",
        helper: "Controls whether the self-service portal accepts logins.",
        documentedOnly: true,
      },
      {
        label: "Anonymous browsing",
        key: "allowAnonymous",
        helper: "Allow public/guest visibility for knowledge or request pages.",
        documentedOnly: true,
      },
      {
        label: "Allow incident submission",
        key: "allowTicketSubmission",
        helper: "If disabled, the Report Issue menu item and widget are hidden.",
      },
      {
        label: "Allow service requests",
        key: "allowServiceRequests",
        helper: "Gates the Send Request page and catalog widget.",
      },
      {
        label: "Allow knowledge base",
        key: "allowKnowledge",
        helper: "Hides knowledge pages and widgets when off.",
      },
      {
        label: "Allow dashboards",
        key: "allowDashboards",
        helper: "Controls dashboard nav visibility for eligible roles.",
      },
      {
        label: "Show legacy / feedback",
        key: "showLegacy",
        helper: "Toggle the legacy tickets page and widget.",
      },
      {
        label: "Show ticket details page",
        key: "showTicketDetails",
        helper: "Hide the ticket drilldown navigation when toggled off.",
      },
    ];

    authRows.forEach(function (row) {
      var toggle = createToggleRow(
        row.label,
        {
          value: flags[row.key],
          onChange: function (val) {
            window.LayoutLibrary.setBehaviourFlag(row.key, val);
            renderNavManager();
            renderPageList();
            renderLayoutEditor();
            renderNavToggles();
          },
        },
        row.helper,
        { disabled: !!row.documentedOnly }
      );
      authSettingsEl.appendChild(toggle);
    });
  }

  function isPageFeatureDisabled(pageId) {
    var flags = window.LayoutLibrary.getBehaviourFlags();
    if (pageId === "report-issue") return !flags.allowTicketSubmission;
    if (pageId === "service-catalog") return !flags.allowServiceRequests;
    if (pageId === "knowledge") return !flags.allowKnowledge;
    if (pageId === "dashboards") return !flags.allowDashboards;
    if (pageId === "legacy") return !flags.showLegacy;
    if (pageId === "ticket-details") return !flags.showTicketDetails;
    return false;
  }

  function renderNavToggles() {
    if (!navTogglePanelEl) return;
    var navCatalog = window.LayoutLibrary.getNavCatalog();
    var toggles = window.LayoutLibrary.getNavToggles();
    navTogglePanelEl.innerHTML = "";

    navCatalog.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "list-row";
      var main = document.createElement("div");
      main.className = "list-row__main";
      var title = document.createElement("div");
      title.className = "list-row__title";
      title.textContent = item.label;
      var meta = document.createElement("div");
      meta.className = "list-row__meta";
      meta.textContent = item.route;
      main.appendChild(title);
      main.appendChild(meta);
      if (isPageFeatureDisabled(item.pageId)) {
        var helper = document.createElement("div");
        helper.className = "helper-text";
        helper.textContent = "Hidden because related behaviour is disabled.";
        main.appendChild(helper);
      }

      var actions = document.createElement("div");
      actions.className = "list-row__actions";
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = toggles[item.id] !== false;
      if (isPageFeatureDisabled(item.pageId)) {
        checkbox.disabled = true;
      }
      checkbox.addEventListener("change", function () {
        window.LayoutLibrary.setNavToggle(item.id, checkbox.checked);
        renderNavManager();
      });
      actions.appendChild(checkbox);
      row.appendChild(main);
      row.appendChild(actions);
      navTogglePanelEl.appendChild(row);
    });
  }

  function renderCustomButtonsPanel() {
    if (!customNavPanelEl) return;
    var buttons = window.LayoutLibrary.getCustomButtons();
    customNavPanelEl.innerHTML = "";

    var header = document.createElement("div");
    header.className = "inline";
    header.style.justifyContent = "space-between";
    header.innerHTML = '<div class="list-row__title">Custom buttons</div>';
    var addBtn = document.createElement("button");
    addBtn.className = "btn btn-primary btn-compact";
    addBtn.textContent = "Add button";
    addBtn.addEventListener("click", function () {
      window.LayoutLibrary.addCustomNavButton();
      renderCustomButtonsPanel();
      renderNavManager();
    });
    header.appendChild(addBtn);
    customNavPanelEl.appendChild(header);

    if (!buttons.length) {
      var empty = document.createElement("div");
      empty.className = "helper-text";
      empty.textContent = "No custom buttons configured.";
      customNavPanelEl.appendChild(empty);
      return;
    }

    buttons.forEach(function (btn) {
      var row = document.createElement("div");
      row.className = "list-row";

      var main = document.createElement("div");
      main.className = "list-row__main";
      var labelField = document.createElement("input");
      labelField.type = "text";
      labelField.className = "text-input";
      labelField.value = btn.label;
      labelField.addEventListener("input", function () {
        window.LayoutLibrary.updateCustomNavButton(btn.id, { label: labelField.value });
        renderNavManager();
      });
      var urlField = document.createElement("input");
      urlField.type = "text";
      urlField.className = "text-input";
      urlField.value = btn.url;
      urlField.placeholder = "https://example.com";
      urlField.addEventListener("input", function () {
        window.LayoutLibrary.updateCustomNavButton(btn.id, { url: urlField.value });
      });
      main.appendChild(labelField);
      main.appendChild(urlField);

      var actions = document.createElement("div");
      actions.className = "list-row__actions";
      var toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.checked = btn.enabled !== false;
      toggle.addEventListener("change", function () {
        window.LayoutLibrary.updateCustomNavButton(btn.id, { enabled: toggle.checked });
        renderNavManager();
      });
      var remove = document.createElement("button");
      remove.className = "btn btn-ghost btn-icon";
      remove.textContent = "✕";
      remove.setAttribute("aria-label", "Remove custom button");
      remove.addEventListener("click", function () {
        window.LayoutLibrary.removeCustomNavButton(btn.id);
        renderCustomButtonsPanel();
        renderNavManager();
      });
      actions.appendChild(toggle);
      actions.appendChild(remove);

      row.appendChild(main);
      row.appendChild(actions);
      customNavPanelEl.appendChild(row);
    });
  }

  function initAdminConsole() {
    if (!window.LayoutLibrary) return;
    widgetLibrary = window.LayoutLibrary.getWidgetLibrary();
    roles = window.LayoutLibrary.getRoles();
    cacheElements();
    renderPortalBasics();
    renderBrandingForm();
    renderAuthSettings();
    renderNavManager();
    renderNavToggles();
    renderCustomButtonsPanel();
    renderPageList();
    renderLayoutEditor();
    renderWidgetVisibilityControls();
    renderDnsConfigPanel();
    renderTicketRoleOverrides();
    renderRoleCatalog();
    wireAddPage();
    wirePageSelect();

    if (window.WidgetSystem && window.WidgetSystem.loadWidgetRegistry) {
      window.WidgetSystem.loadWidgetRegistry().then(function (registryData) {
        if (registryData && registryData.customManifests && window.LayoutLibrary.registerCustomWidgets) {
          window.LayoutLibrary.registerCustomWidgets(registryData.customManifests);
          widgetLibrary = window.LayoutLibrary.getWidgetLibrary();
          renderWidgetVisibilityControls();
          renderDnsConfigPanel();
        }
      });
    }
  }

  window.AdminConsole = {
    init: initAdminConsole,
    refreshForRole: function () {
      renderPortalBasics();
      renderBrandingForm();
      renderAuthSettings();
      renderNavManager();
      renderNavToggles();
      renderCustomButtonsPanel();
      renderPageList();
      renderLayoutEditor();
      renderWidgetVisibilityControls();
      renderDnsConfigPanel();
      renderRoleCatalog();
    }
  };
})();
