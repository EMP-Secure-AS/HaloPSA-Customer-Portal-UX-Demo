// Core app wiring for portal + admin pages
(function () {
  function applyStoredTheme() {
    var root = document.documentElement;
    var stored = null;
    try {
      stored = window.localStorage && window.localStorage.getItem("portal-theme");
    } catch (e) {
      stored = null;
    }
    var theme = stored || "light";
    root.setAttribute("data-theme", theme);
    return theme;
  }

  function toggleTheme() {
    var root = document.documentElement;
    var current = root.getAttribute("data-theme") || "light";
    var next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("portal-theme", next);
    } catch (e) {
      // ignore write errors
    }
  }

  function wireThemeButton(id) {
    var btn = document.getElementById(id);
    if (!btn) return;
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
