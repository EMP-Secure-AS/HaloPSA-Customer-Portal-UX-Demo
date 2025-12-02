// Core app wiring for portal + admin pages
(function () {
  var THEME_KEY = "portal-theme";
  var ROLE_KEY = "portal-role";
  var currentRole = null;

  function updateToggleLabels(theme) {
    var buttons = document.querySelectorAll('[data-role="theme-toggle"]');
    buttons.forEach(function (btn) {
      var wantsDark = theme === "light";
      btn.textContent = wantsDark ? "Dark mode" : "Light mode";
      btn.setAttribute("aria-pressed", wantsDark ? "false" : "true");
      btn.setAttribute("aria-label", wantsDark ? "Switch to dark mode" : "Switch to light mode");
    });
  }

  function setTheme(theme, opts) {
    var root = document.documentElement;
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", theme);
    if (!opts || !opts.skipSave) {
      try {
        window.localStorage.setItem(THEME_KEY, theme);
      } catch (e) {
        // ignore write errors
      }
    }
    updateToggleLabels(theme);
    setTimeout(function () {
      root.classList.remove("theme-transition");
    }, 260);
  }

  function applyStoredTheme() {
    var stored = null;
    try {
      stored = window.localStorage && window.localStorage.getItem(THEME_KEY);
    } catch (e) {
      stored = null;
    }
    var theme = stored || "light";
    setTheme(theme, { skipSave: true });
    return theme;
  }

  function toggleTheme() {
    var root = document.documentElement;
    var current = root.getAttribute("data-theme") || "light";
    var next = current === "light" ? "dark" : "light";
    setTheme(next);
  }

  function getAvailableRoles() {
    if (window.LayoutLibrary && window.LayoutLibrary.getRoles) {
      return window.LayoutLibrary.getRoles();
    }
    return [];
  }

  function updateRolePickers(role) {
    var pickers = document.querySelectorAll('[data-role="role-picker"]');
    pickers.forEach(function (picker) {
      if (!picker.dataset.populated) {
        var roles = getAvailableRoles();
        roles.forEach(function (r) {
          var opt = document.createElement("option");
          opt.value = r.id;
          opt.textContent = r.label;
          picker.appendChild(opt);
        });
        picker.dataset.populated = "true";
      }
      picker.value = role;
    });
  }

  function persistRole(role) {
    try {
      window.localStorage.setItem(ROLE_KEY, role);
    } catch (e) {
      // ignore
    }
  }

  function setRole(role) {
    currentRole = role;
    persistRole(role);
    updateRolePickers(role);
    renderPortal(role);
    if (window.AdminConsole && window.AdminConsole.refreshForRole) {
      window.AdminConsole.refreshForRole(role);
    }
  }

  function applyStoredRole() {
    var stored = null;
    try {
      stored = window.localStorage && window.localStorage.getItem(ROLE_KEY);
    } catch (e) {
      stored = null;
    }
    var fallback = window.LayoutLibrary && window.LayoutLibrary.getDefaultRole
      ? window.LayoutLibrary.getDefaultRole()
      : "end_user";
    var role = stored || fallback;
    currentRole = role;
    updateRolePickers(role);
    return role;
  }

  function wireRolePicker(id) {
    var select = document.getElementById(id);
    if (!select) return;
    select.setAttribute("data-role", "role-picker");
    select.addEventListener("change", function (event) {
      setRole(event.target.value);
    });
  }

  function wireThemeButton(id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.setAttribute("data-role", "theme-toggle");
    btn.addEventListener("click", toggleTheme);
  }

  function wirePortalNavToggle() {
    var toggle = document.getElementById("portal-menu-toggle");
    var nav = document.getElementById("portal-nav");
    if (!toggle || !nav) return;

    var updateState = function (isOpen) {
      document.body.classList.toggle("portal-nav-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    toggle.addEventListener("click", function () {
      var next = !document.body.classList.contains("portal-nav-open");
      updateState(next);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A" && document.body.classList.contains("portal-nav-open")) {
        updateState(false);
      }
    });
  }

  function wireAdminSidebar() {
    var toggle = document.getElementById("sidebar-toggle");
    var sidebar = document.getElementById("admin-sidebar");
    var backdrop = document.getElementById("admin-backdrop");
    if (!toggle || !sidebar) return;

    var mq = window.matchMedia ? window.matchMedia("(min-width: 1081px)") : null;

    var setOpen = function (isOpen) {
      sidebar.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("admin-sidebar-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    toggle.addEventListener("click", function () {
      setOpen(!sidebar.classList.contains("is-open"));
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
      });
    }

    if (mq && mq.addEventListener) {
      mq.addEventListener("change", function (event) {
        setOpen(event.matches);
      });
      setOpen(mq.matches);
    } else {
      setOpen(true);
    }
  }

  function wireAdminNavigation() {
    var buttons = document.querySelectorAll(".admin-nav-item");
    var sections = document.querySelectorAll(".admin-section");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sectionId = btn.getAttribute("data-section");
        buttons.forEach(function (b) {
          b.classList.toggle("admin-nav-item--active", b === btn);
        });
        sections.forEach(function (sec) {
          sec.classList.toggle(
            "admin-section--active",
            sec.id === "admin-section-" + sectionId
          );
        });
      });
    });
  }

  function renderNav(role) {
    var nav = document.getElementById("portal-nav");
    if (!nav || !window.LayoutLibrary) return;
    var items = window.LayoutLibrary.getNavItemsForRole(role);
    nav.innerHTML = "";
    items.forEach(function (item, index) {
      var link = document.createElement("a");
      link.href = item.route;
      link.className = "nav-link" + (index === 0 ? " nav-link--active" : "");
      link.textContent = item.label;
      nav.appendChild(link);
    });
  }

  function createWidgetContainer(widget) {
    var wrapper = document.createElement("article");
    var classes = ["widget"];
    var isHero = widget.id === "hero-search";
    if (isHero) {
      classes.push("hero");
    } else {
      classes.push("card");
    }
    wrapper.className = classes.join(" ");
    wrapper.setAttribute("data-widget-id", widget.id);
    wrapper.setAttribute("data-widget-variant", widget.variant || "");
    return wrapper;
  }

  function renderPortalLayout(role) {
    var content = document.getElementById("portal-content");
    if (!content || !window.LayoutLibrary || !window.WidgetSystem) return;

    var renderWidgets = function () {
      var layout = window.LayoutLibrary.getLayoutForRole("home", role);
      content.innerHTML = "";

      layout.rows.forEach(function (row) {
        var section = document.createElement("section");
        section.className = "page-section";
        var columns = document.createElement("div");
        columns.className = "portal-row";

        row.columns.forEach(function (col) {
          var colEl = document.createElement("div");
          colEl.className = "portal-col";
          colEl.style.flexBasis = (col.width / 12) * 100 + "%";
          colEl.style.flexGrow = col.width;

          col.widgets.forEach(function (widget) {
            var widgetContainer = createWidgetContainer(widget);
            colEl.appendChild(widgetContainer);

            var options = {
              role: role,
              variant: widget.variant,
              ticketView: window.LayoutLibrary.getTicketViewForRole(role),
              config: window.LayoutLibrary.getWidgetConfig(widget.id)
            };
            window.WidgetSystem.renderWidget(widget.id, widgetContainer, options);
          });

          if (colEl.children.length) {
            columns.appendChild(colEl);
          }
        });

        if (columns.children.length) {
          content.appendChild(section);
          section.appendChild(columns);
        }
      });
    };

    window.WidgetSystem
      .loadWidgetRegistry()
      .then(function (registryData) {
        if (registryData && registryData.customManifests && window.LayoutLibrary.registerCustomWidgets) {
          window.LayoutLibrary.registerCustomWidgets(registryData.customManifests);
        }
        renderWidgets();
      })
      .catch(renderWidgets);
  }

  function renderPortal(role) {
    renderNav(role);
    renderPortalLayout(role);
  }

  function initPortal() {
    applyStoredTheme();
    wireThemeButton("theme-toggle");
    applyStoredRole();
    wireRolePicker("role-select");
    wirePortalNavToggle();
    renderPortal(currentRole);
  }

  function initAdmin() {
    applyStoredTheme();
    wireThemeButton("admin-theme-toggle");
    applyStoredRole();
    wireRolePicker("admin-role-select");
    wireAdminSidebar();
    wireAdminNavigation();
    if (window.AdminConsole && window.AdminConsole.init) {
      window.AdminConsole.init();
    }
  }

  window.AppState = {
    getCurrentRole: function () {
      var firstRole = getAvailableRoles()[0];
      return currentRole || (firstRole ? firstRole.id : "end_user");
    },
    setRole: setRole,
    getRoles: getAvailableRoles
  };

  window.initPortal = initPortal;
  window.initAdmin = initAdmin;
})();
