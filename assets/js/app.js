// Minimal JS glue. Later phases will expand significantly.

(function () {
  function applyStoredTheme() {
    var root = document.documentElement;
    var stored = window.localStorage && window.localStorage.getItem("portal-theme");
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
      // ignore
    }
  }

  function wireThemeButton(id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", toggleTheme);
  }

  window.initPortal = function () {
    applyStoredTheme();
    wireThemeButton("theme-toggle");
    // Later phases will initialize widgets and layouts here.
  };

  window.initAdmin = function () {
    applyStoredTheme();
    wireThemeButton("admin-theme-toggle");

    // Basic admin sidebar section switching
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
  };
})();
