// Mock navigation, page, and layout models for the admin console
(function () {
  var widgetLibrary = [
    { id: "hero-search", name: "Hero Search", description: "Search-focused hero with prompts" },
    { id: "quick-actions", name: "Quick Actions", description: "Common IT shortcuts" },
    { id: "recent-tickets", name: "Recent Tickets", description: "Latest support requests" },
    { id: "news", name: "News", description: "IT or company news feed" },
    { id: "service-status", name: "Service Status", description: "Health of core services" },
    { id: "top-articles", name: "Top Articles", description: "Frequently used KB content" }
  ];

  var navItems = [
    { id: "nav-home", label: "Home", route: "/portal", icon: "home", visibility: "All roles" },
    { id: "nav-tickets", label: "My Tickets", route: "/portal/tickets", icon: "ticket", visibility: "Signed-in users" },
    { id: "nav-kb", label: "Knowledge Base", route: "/portal/kb", icon: "book", visibility: "All roles" },
    { id: "nav-dash", label: "Dashboards", route: "/portal/dashboards", icon: "chart", visibility: "Managers" },
    { id: "nav-onboarding", label: "Onboarding Hub", route: "/portal/onboarding", icon: "sparkles", visibility: "Targeted roles" }
  ];

  var pages = [
    { id: "home", name: "Home", route: "/portal", type: "core", status: "Published" },
    { id: "tickets", name: "My Tickets", route: "/portal/tickets", type: "core", status: "Published" },
    { id: "knowledge", name: "Knowledge Base", route: "/portal/kb", type: "core", status: "Published" },
    { id: "dashboards", name: "Dashboards", route: "/portal/dashboards", type: "core", status: "Draft" },
    { id: "onboarding", name: "Onboarding Hub", route: "/portal/onboarding", type: "custom", status: "Published" }
  ];

  var pageLayouts = {
    home: {
      id: "home",
      title: "Home",
      rows: [
        {
          id: "row-hero",
          label: "Hero",
          columns: [{ width: 12, widgets: ["hero-search"] }]
        },
        {
          id: "row-actions",
          label: "Quick actions",
          columns: [{ width: 12, widgets: ["quick-actions"] }]
        },
        {
          id: "row-grid",
          label: "Highlights",
          columns: [
            { width: 4, widgets: ["service-status"] },
            { width: 4, widgets: ["news"] },
            { width: 4, widgets: ["top-articles"] }
          ]
        },
        {
          id: "row-tickets",
          label: "Recent tickets",
          columns: [{ width: 12, widgets: ["recent-tickets"] }]
        }
      ]
    },
    tickets: {
      id: "tickets",
      title: "My Tickets",
      rows: [
        {
          id: "row-ticket-summary",
          label: "Ticket summary",
          columns: [{ width: 12, widgets: ["recent-tickets", "news"] }]
        }
      ]
    },
    knowledge: {
      id: "knowledge",
      title: "Knowledge Base",
      rows: [
        {
          id: "row-top-articles",
          label: "Articles",
          columns: [{ width: 8, widgets: ["top-articles"] }, { width: 4, widgets: ["news"] }]
        }
      ]
    },
    dashboards: {
      id: "dashboards",
      title: "Dashboards",
      rows: [
        {
          id: "row-status",
          label: "Status & health",
          columns: [{ width: 6, widgets: ["service-status"] }, { width: 6, widgets: ["quick-actions"] }]
        },
        {
          id: "row-reports",
          label: "Reports",
          columns: [{ width: 12, widgets: ["news"] }]
        }
      ]
    },
    onboarding: {
      id: "onboarding",
      title: "Onboarding Hub",
      rows: [
        {
          id: "row-welcome",
          label: "Welcome",
          columns: [{ width: 12, widgets: ["hero-search"] }]
        },
        {
          id: "row-journey",
          label: "Your journey",
          columns: [{ width: 8, widgets: ["quick-actions", "top-articles"] }, { width: 4, widgets: ["service-status"] }]
        }
      ]
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getNavItems() {
    return clone(navItems);
  }

  function moveNavItem(itemId, delta) {
    var index = navItems.findIndex(function (item) {
      return item.id === itemId;
    });
    if (index === -1) return getNavItems();
    var target = index + delta;
    if (target < 0 || target >= navItems.length) return getNavItems();
    var item = navItems.splice(index, 1)[0];
    navItems.splice(target, 0, item);
    return getNavItems();
  }

  function getPages() {
    return clone(pages);
  }

  function defaultLayout(pageId) {
    return {
      id: pageId,
      title: "Custom page",
      rows: [
        {
          id: "row-" + pageId + "-1",
          label: "Single column",
          columns: [{ width: 12, widgets: ["hero-search"] }]
        }
      ]
    };
  }

  function addPage(pageConfig) {
    var id = pageConfig.id || "custom-" + (pages.length + 1);
    var page = {
      id: id,
      name: pageConfig.name || "Custom Page",
      route: pageConfig.route || "/portal/custom-" + (pages.length + 1),
      type: pageConfig.type || "custom",
      status: pageConfig.status || "Draft"
    };
    pages.push(page);
    pageLayouts[id] = pageConfig.layout || defaultLayout(id);
    return page;
  }

  function getPageLayout(pageId) {
    return clone(pageLayouts[pageId]);
  }

  function addWidgetToPage(pageId, rowId, columnIndex, widgetId) {
    var layout = pageLayouts[pageId];
    if (!layout) return;
    var row = layout.rows.find(function (r) {
      return r.id === rowId;
    });
    if (!row || !row.columns[columnIndex]) return;
    row.columns[columnIndex].widgets.push(widgetId);
  }

  function removeWidgetFromPage(pageId, rowId, columnIndex, widgetId) {
    var layout = pageLayouts[pageId];
    if (!layout) return;
    var row = layout.rows.find(function (r) {
      return r.id === rowId;
    });
    if (!row || !row.columns[columnIndex]) return;
    var widgets = row.columns[columnIndex].widgets;
    var idx = widgets.indexOf(widgetId);
    if (idx > -1) {
      widgets.splice(idx, 1);
    }
  }

  function getWidgetLibrary() {
    return clone(widgetLibrary);
  }

  window.LayoutLibrary = {
    getNavItems: getNavItems,
    moveNavItem: moveNavItem,
    getPages: getPages,
    addPage: addPage,
    getPageLayout: getPageLayout,
    addWidgetToPage: addWidgetToPage,
    removeWidgetFromPage: removeWidgetFromPage,
    getWidgetLibrary: getWidgetLibrary
  };
})();
