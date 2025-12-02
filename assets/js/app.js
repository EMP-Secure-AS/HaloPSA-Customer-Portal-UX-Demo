// Core app wiring for portal + admin pages
(function () {
  var THEME_KEY = "portal-theme";

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
    root.setAttribute("data-theme", theme);
    if (!opts || !opts.skipSave) {
      try {
        window.localStorage.setItem(THEME_KEY, theme);
      } catch (e) {
        // ignore write errors
      }
    }
    updateToggleLabels(theme);
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

  function wireThemeButton(id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.setAttribute("data-role", "theme-toggle");
    btn.addEventListener("click", toggleTheme);
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

  function initPortal() {
    applyStoredTheme();
    wireThemeButton("theme-toggle");
    // Phase 1 keeps logic light; later phases will hydrate widgets/layouts here.
  }

  function initAdmin() {
    applyStoredTheme();
    wireThemeButton("admin-theme-toggle");
    wireAdminNavigation();
  }

  window.initPortal = initPortal;
  window.initAdmin = initAdmin;
})();
