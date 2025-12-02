// Mock navigation, page, and layout models for the admin console + portal
(function () {
  var roles = [
    { id: "end_user", label: "End user", description: "Standard employees using self-service" },
    { id: "manager", label: "Manager", description: "People managers with broader visibility" },
    { id: "local_it", label: "Local IT", description: "Site-level IT with ticket queues" },
    { id: "company_it", label: "Company IT", description: "Company-wide IT operations" },
    { id: "group_it", label: "Group IT", description: "Group / regional IT leadership" }
  ];

  var widgetLibrary = [
    { id: "hero-search", name: "Hero Search", description: "Search-focused hero with prompts" },
    { id: "quick-actions", name: "Quick Actions", description: "Common IT shortcuts" },
    { id: "recent-tickets", name: "My Tickets", description: "Latest support requests" },
    { id: "news", name: "News", description: "IT or company news feed" },
    { id: "service-status", name: "Service Status", description: "Health of core services" },
    { id: "top-articles", name: "Top Articles", description: "Frequently used KB content" }
  ];

  var widgetVisibility = {
    "hero-search": roles.map(function (r) { return r.id; }),
    "quick-actions": roles.map(function (r) { return r.id; }),
    "recent-tickets": roles.map(function (r) { return r.id; }),
    news: roles.map(function (r) { return r.id; }),
    "service-status": ["end_user", "manager", "local_it", "company_it", "group_it"],
    "top-articles": roles.map(function (r) { return r.id; })
  };

  var ticketPresets = {
    summary: {
      id: "summary",
      label: "Summary (end user)",
      columns: ["Ticket", "Summary", "Status", "Updated"],
      filters: "Open + awaiting user",
      description: "Minimal view for standard users"
    },
    operations: {
      id: "operations",
      label: "Operations (IT / manager)",
      columns: ["Ticket", "Summary", "Status", "Owner", "Priority", "Age", "Updated"],
      filters: "Queues + SLA + priority",
      description: "Richer queue-oriented view"
    }
  };

  var ticketPresetByRole = {
    end_user: "summary",
    manager: "operations",
    local_it: "operations",
    company_it: "operations",
    group_it: "operations"
  };

  var navItems = [
    { id: "nav-home", label: "Home", route: "/portal", icon: "home", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-tickets", label: "My Tickets", route: "/portal/tickets", icon: "ticket", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-kb", label: "Knowledge Base", route: "/portal/kb", icon: "book", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-dash", label: "Dashboards", route: "/portal/dashboards", icon: "chart", visibleForRoles: ["manager", "local_it", "company_it", "group_it"] },
    { id: "nav-onboarding", label: "Onboarding Hub", route: "/portal/onboarding", icon: "sparkles", visibleForRoles: ["end_user", "manager"] }
  ];

  var pages = [
    { id: "home", name: "Home", route: "/portal", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "tickets", name: "My Tickets", route: "/portal/tickets", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "knowledge", name: "Knowledge Base", route: "/portal/kb", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "dashboards", name: "Dashboards", route: "/portal/dashboards", type: "core", status: "Draft", visibleForRoles: ["manager", "local_it", "company_it", "group_it"] },
    { id: "onboarding", name: "Onboarding Hub", route: "/portal/onboarding", type: "custom", status: "Published", visibleForRoles: ["end_user", "manager"] }
  ];

  var pageLayouts = {
    home: {
      id: "home",
      title: "Home",
      rows: [
        {
          id: "row-hero",
          label: "Hero",
          columns: [
            {
              width: 12,
              widgets: [
                { id: "hero-search", visibleForRoles: widgetVisibility["hero-search"] }
              ]
            }
          ]
        },
        {
          id: "row-actions",
          label: "Quick actions",
          columns: [
            {
              width: 12,
              widgets: [
                { id: "quick-actions", visibleForRoles: widgetVisibility["quick-actions"] }
              ]
            }
          ]
        },
        {
          id: "row-grid",
          label: "Highlights",
          columns: [
            { width: 4, widgets: [{ id: "service-status", visibleForRoles: widgetVisibility["service-status"] }] },
            { width: 4, widgets: [{ id: "news", visibleForRoles: widgetVisibility.news }] },
            { width: 4, widgets: [{ id: "top-articles", visibleForRoles: widgetVisibility["top-articles"] }] }
          ]
        },
        {
          id: "row-tickets",
          label: "Recent tickets",
          columns: [
            {
              width: 12,
              widgets: [
                { id: "recent-tickets", variant: "summary", visibleForRoles: ["end_user"] },
                { id: "recent-tickets", variant: "operations", visibleForRoles: ["manager", "local_it", "company_it", "group_it"] }
              ]
            }
          ]
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
          columns: [
            {
              width: 12,
              widgets: [
                { id: "recent-tickets", variant: "operations", visibleForRoles: widgetVisibility["recent-tickets"] },
                { id: "news", visibleForRoles: widgetVisibility.news }
              ]
            }
          ]
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
          columns: [
            { width: 8, widgets: [{ id: "top-articles", visibleForRoles: widgetVisibility["top-articles"] }] },
            { width: 4, widgets: [{ id: "news", visibleForRoles: widgetVisibility.news }] }
          ]
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
          columns: [
            { width: 6, widgets: [{ id: "service-status", visibleForRoles: widgetVisibility["service-status"] }] },
            { width: 6, widgets: [{ id: "quick-actions", visibleForRoles: widgetVisibility["quick-actions"] }] }
          ]
        },
        {
          id: "row-reports",
          label: "Reports",
          columns: [
            { width: 12, widgets: [{ id: "news", visibleForRoles: widgetVisibility.news }] }
          ]
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
          columns: [
            { width: 12, widgets: [{ id: "hero-search", visibleForRoles: widgetVisibility["hero-search"] }] }
          ]
        },
        {
          id: "row-journey",
          label: "Your journey",
          columns: [
            {
              width: 8,
              widgets: [
                { id: "quick-actions", visibleForRoles: widgetVisibility["quick-actions"] },
                { id: "top-articles", visibleForRoles: widgetVisibility["top-articles"] }
              ]
            },
            { width: 4, widgets: [{ id: "service-status", visibleForRoles: widgetVisibility["service-status"] }] }
          ]
        }
      ]
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getDefaultRole() {
    return roles[0].id;
  }

  function filterByRole(items, role) {
    return items.filter(function (item) {
      if (!item.visibleForRoles) return true;
      return item.visibleForRoles.indexOf(role) > -1;
    });
  }

  function normalizeWidgetRef(widgetId) {
    return {
      id: widgetId,
      visibleForRoles: widgetVisibility[widgetId] || roles.map(function (r) { return r.id; })
    };
  }

  function getNavItems() {
    return clone(navItems);
  }

  function getNavItemsForRole(role) {
    return clone(filterByRole(navItems, role));
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

  function getPagesForRole(role) {
    return filterByRole(getPages(), role);
  }

  function defaultLayout(pageId) {
    return {
      id: pageId,
      title: "Custom page",
      rows: [
        {
          id: "row-" + pageId + "-1",
          label: "Single column",
          columns: [
            {
              width: 12,
              widgets: [normalizeWidgetRef("hero-search")]
            }
          ]
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
      status: pageConfig.status || "Draft",
      visibleForRoles: pageConfig.visibleForRoles || roles.map(function (r) { return r.id; })
    };
    pages.push(page);
    pageLayouts[id] = pageConfig.layout || defaultLayout(id);
    return page;
  }

  function getPageLayout(pageId) {
    return clone(pageLayouts[pageId]);
  }

  function getLayoutForRole(pageId, role) {
    var layout = getPageLayout(pageId) || defaultLayout(pageId);
    layout.rows = layout.rows
      .map(function (row) {
        var rowCopy = clone(row);
        rowCopy.columns = rowCopy.columns.map(function (col) {
          var colCopy = clone(col);
          colCopy.widgets = filterWidgetsForRole(colCopy.widgets, role);
          return colCopy;
        });
        return rowCopy;
      })
      .filter(function (row) {
        return row.columns.some(function (col) { return col.widgets.length; });
      });
    return layout;
  }

  function addWidgetToPage(pageId, rowId, columnIndex, widgetId) {
    var layout = pageLayouts[pageId];
    if (!layout) return;
    var row = layout.rows.find(function (r) {
      return r.id === rowId;
    });
    if (!row || !row.columns[columnIndex]) return;
    row.columns[columnIndex].widgets.push(normalizeWidgetRef(widgetId));
  }

  function removeWidgetFromPage(pageId, rowId, columnIndex, widgetId) {
    var layout = pageLayouts[pageId];
    if (!layout) return;
    var row = layout.rows.find(function (r) {
      return r.id === rowId;
    });
    if (!row || !row.columns[columnIndex]) return;
    var widgets = row.columns[columnIndex].widgets;
    var idx = widgets.findIndex(function (w) { return w.id === widgetId; });
    if (idx > -1) {
      widgets.splice(idx, 1);
    }
  }

  function getWidgetLibrary() {
    return clone(widgetLibrary);
  }

  function setWidgetVisibility(widgetId, roleIds) {
    widgetVisibility[widgetId] = roleIds.slice();
  }

  function getWidgetVisibility() {
    return clone(widgetVisibility);
  }

  function getTicketPresetForRole(role) {
    return ticketPresetByRole[role] || ticketPresets.summary.id;
  }

  function setTicketPresetForRole(role, presetId) {
    if (ticketPresets[presetId]) {
      ticketPresetByRole[role] = presetId;
    }
  }

  function getTicketViewForRole(role) {
    var presetId = getTicketPresetForRole(role);
    var preset = ticketPresets[presetId] || ticketPresets.summary;
    return clone(preset);
  }

  function getTicketPresets() {
    return clone(ticketPresets);
  }

  function filterWidgetsForRole(widgets, role) {
    return widgets
      .map(function (widget) {
        if (typeof widget === "string") {
          return normalizeWidgetRef(widget);
        }
        return widget;
      })
      .filter(function (widget) {
        var rolesForWidget = widget.visibleForRoles || roles.map(function (r) { return r.id; });
        var globalRoles = widgetVisibility[widget.id];
        if (globalRoles && globalRoles.length) {
          rolesForWidget = rolesForWidget.filter(function (roleId) {
            return globalRoles.indexOf(roleId) > -1;
          });
        }
        return rolesForWidget.indexOf(role) > -1;
      })
      .map(function (widget) {
        var cloneWidget = clone(widget);
        cloneWidget.visibleForRoles = widget.visibleForRoles || widgetVisibility[widget.id];
        return cloneWidget;
      });
  }

  function getRoles() {
    return clone(roles);
  }

  window.LayoutLibrary = {
    getNavItems: getNavItems,
    getNavItemsForRole: getNavItemsForRole,
    moveNavItem: moveNavItem,
    getPages: getPages,
    getPagesForRole: getPagesForRole,
    addPage: addPage,
    getPageLayout: getPageLayout,
    getLayoutForRole: getLayoutForRole,
    addWidgetToPage: addWidgetToPage,
    removeWidgetFromPage: removeWidgetFromPage,
    getWidgetLibrary: getWidgetLibrary,
    getRoles: getRoles,
    getDefaultRole: getDefaultRole,
    setWidgetVisibility: setWidgetVisibility,
    getWidgetVisibility: getWidgetVisibility,
    getTicketViewForRole: getTicketViewForRole,
    getTicketPresets: getTicketPresets,
    setTicketPresetForRole: setTicketPresetForRole
  };
})();
