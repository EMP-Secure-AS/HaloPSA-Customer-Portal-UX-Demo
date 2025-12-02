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
    { id: "ticket-details", name: "Ticket Details", description: "Drill into an individual ticket" },
    { id: "issue-form", name: "Report Issue", description: "Raise an incident" },
    { id: "service-catalog", name: "Service Catalog", description: "Browse and request services" },
    { id: "kb-categories", name: "Knowledge Categories", description: "Browse knowledge base areas" },
    { id: "kb-article", name: "Knowledge Article", description: "Read a selected article" },
    { id: "insights-dashboard", name: "Dashboards", description: "Interactive analytics" },
    { id: "legacy-feedback", name: "Legacy & Feedback", description: "Old tickets and feedback" },
    { id: "news", name: "News", description: "IT or company news feed" },
    { id: "service-status", name: "Service Status", description: "Health of core services" },
    { id: "top-articles", name: "Top Articles", description: "Frequently used KB content" },
    { id: "dns-manager", name: "DNS Manager", description: "Manage DNS zones and records" }
  ];

  var widgetVisibility = {
    "hero-search": roles.map(function (r) { return r.id; }),
    "quick-actions": roles.map(function (r) { return r.id; }),
    "recent-tickets": roles.map(function (r) { return r.id; }),
    "ticket-details": roles.map(function (r) { return r.id; }),
    "issue-form": roles.map(function (r) { return r.id; }),
    "service-catalog": roles.map(function (r) { return r.id; }),
    "kb-categories": roles.map(function (r) { return r.id; }),
    "kb-article": roles.map(function (r) { return r.id; }),
    "insights-dashboard": ["manager", "local_it", "company_it", "group_it"],
    "legacy-feedback": roles.map(function (r) { return r.id; }),
    news: roles.map(function (r) { return r.id; }),
    "service-status": ["end_user", "manager", "local_it", "company_it", "group_it"],
    "top-articles": roles.map(function (r) { return r.id; }),
    "dns-manager": ["local_it", "company_it", "group_it"]
  };

  var widgetConfigs = {
    "dns-manager": {
      providerName: "Acme DNS Cloud",
      apiBaseUrl: "https://api.dns.example.com",
      defaultDomain: "acme.com"
    }
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
    { id: "nav-home", label: "Home", route: "/portal", pageId: "home", icon: "home", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-tickets", label: "My Tickets", route: "/portal/tickets", pageId: "tickets", icon: "ticket", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-ticket-details", label: "Ticket details", route: "/portal/tickets/view", pageId: "ticket-details", icon: "open_in_new", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-report", label: "Report issue", route: "/portal/report", pageId: "report-issue", icon: "alert", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-request", label: "Send request", route: "/portal/request", pageId: "service-catalog", icon: "plus", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-kb", label: "Knowledge Base", route: "/portal/kb", pageId: "knowledge", icon: "book", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-dash", label: "Dashboards", route: "/portal/dashboards", pageId: "dashboards", icon: "chart", visibleForRoles: ["manager", "local_it", "company_it", "group_it"] },
    { id: "nav-legacy", label: "Old tickets & feedback", route: "/portal/legacy", pageId: "legacy", icon: "archive", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "nav-onboarding", label: "Onboarding Hub", route: "/portal/onboarding", pageId: "onboarding", icon: "sparkles", visibleForRoles: ["end_user", "manager"] },
    { id: "nav-dns", label: "DNS Manager", route: "/portal/dns", pageId: "dns", icon: "globe", visibleForRoles: ["local_it", "company_it", "group_it"] }
  ];

  var pages = [
    { id: "home", name: "Home", route: "/portal", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "tickets", name: "My Tickets", route: "/portal/tickets", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "ticket-details", name: "Ticket details", route: "/portal/tickets/view", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "report-issue", name: "Report an issue", route: "/portal/report", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "service-catalog", name: "Send a request", route: "/portal/request", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "knowledge", name: "Knowledge Base", route: "/portal/kb", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "dashboards", name: "Dashboards", route: "/portal/dashboards", type: "core", status: "Published", visibleForRoles: ["manager", "local_it", "company_it", "group_it"] },
    { id: "legacy", name: "Old tickets & feedback", route: "/portal/legacy", type: "core", status: "Published", visibleForRoles: roles.map(function (r) { return r.id; }) },
    { id: "onboarding", name: "Onboarding Hub", route: "/portal/onboarding", type: "custom", status: "Published", visibleForRoles: ["end_user", "manager"] },
    { id: "dns", name: "DNS Manager", route: "/portal/dns", type: "custom", status: "Published", visibleForRoles: ["local_it", "company_it", "group_it"] }
  ];

  var pageLayouts = {
    home: {
      id: "home",
      title: "Home",
      description: "Landing space with quick access, tickets, and service health.",
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
          id: "row-dns",
          label: "DNS management",
          columns: [
            {
              width: 12,
              widgets: [
                {
                  id: "dns-manager",
                  visibleForRoles: widgetVisibility["dns-manager"],
                }
              ]
            }
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
      description: "Work your queue with filters and a condensed list view.",
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
    "ticket-details": {
      id: "ticket-details",
      title: "Ticket details",
      description: "Full view of a ticket with timeline and related knowledge.",
      rows: [
        {
          id: "row-ticket-body",
          label: "Ticket overview",
          columns: [
            { width: 8, widgets: [{ id: "ticket-details", visibleForRoles: widgetVisibility["ticket-details"] }] },
            {
              width: 4,
              widgets: [
                { id: "kb-article", visibleForRoles: widgetVisibility["kb-article"] },
                { id: "top-articles", visibleForRoles: widgetVisibility["top-articles"] }
              ]
            }
          ]
        }
      ]
    },
    "report-issue": {
      id: "report-issue",
      title: "Report an issue",
      description: "Log a new incident with a short, guided form.",
      rows: [
        {
          id: "row-issue",
          label: "Issue form",
          columns: [
            {
              width: 8,
              widgets: [{ id: "issue-form", visibleForRoles: widgetVisibility["issue-form"] }]
            },
            {
              width: 4,
              widgets: [
                { id: "kb-categories", visibleForRoles: widgetVisibility["kb-categories"] },
                { id: "service-status", visibleForRoles: widgetVisibility["service-status"] }
              ]
            }
          ]
        }
      ]
    },
    "service-catalog": {
      id: "service-catalog",
      title: "Send a request",
      description: "Browse services, approvals, and fulfilment SLAs.",
      rows: [
        {
          id: "row-catalog",
          label: "Service catalog",
          columns: [
            { width: 8, widgets: [{ id: "service-catalog", visibleForRoles: widgetVisibility["service-catalog"] }] },
            { width: 4, widgets: [{ id: "quick-actions", visibleForRoles: widgetVisibility["quick-actions"] }] }
          ]
        }
      ]
    },
    knowledge: {
      id: "knowledge",
      title: "Knowledge Base",
      description: "Browse categories and read articles without leaving the portal.",
      rows: [
        {
          id: "row-top-articles",
          label: "Articles",
          columns: [
            {
              width: 8,
              widgets: [
                { id: "kb-categories", visibleForRoles: widgetVisibility["kb-categories"] },
                { id: "kb-article", visibleForRoles: widgetVisibility["kb-article"] }
              ]
            },
            { width: 4, widgets: [{ id: "news", visibleForRoles: widgetVisibility.news }] }
          ]
        }
      ]
    },
    dashboards: {
      id: "dashboards",
      title: "Dashboards",
      description: "Lightweight interactive dashboard mock for IT leaders.",
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
            { width: 12, widgets: [{ id: "insights-dashboard", visibleForRoles: widgetVisibility["insights-dashboard"] }] }
          ]
        }
      ]
    },
    legacy: {
      id: "legacy",
      title: "Old tickets & feedback",
      description: "Review closed work and share a quick satisfaction score.",
      rows: [
        {
          id: "row-legacy",
          label: "Closed tickets",
          columns: [
            {
              width: 12,
              widgets: [
                { id: "legacy-feedback", visibleForRoles: widgetVisibility["legacy-feedback"] },
                { id: "recent-tickets", variant: "summary", visibleForRoles: widgetVisibility["recent-tickets"] }
              ]
            }
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
    },
    dns: {
      id: "dns",
      title: "DNS Manager",
      rows: [
        {
          id: "row-dns-overview",
          label: "DNS zones",
          columns: [
            {
              width: 12,
              widgets: [
                {
                  id: "dns-manager",
                  visibleForRoles: widgetVisibility["dns-manager"],
                }
              ]
            }
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

  function getPageById(id) {
    var page = pages.find(function (p) {
      return p.id === id;
    });
    return page ? clone(page) : null;
  }

  function defaultLayout(pageId) {
    return {
      id: pageId,
      title: "Custom page",
      description: "Autogenerated layout",
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

  function registerCustomWidgets(manifests) {
    (manifests || []).forEach(function (manifest) {
      var existing = widgetLibrary.find(function (w) {
        return w.id === manifest.id;
      });
      if (existing) {
        existing.name = manifest.name || existing.name;
        existing.description = manifest.description || existing.description;
      } else {
        widgetLibrary.push({
          id: manifest.id,
          name: manifest.name || manifest.id,
          description: manifest.description || "Custom widget",
        });
      }

      if (manifest.visibleForRoles && manifest.visibleForRoles.length) {
        widgetVisibility[manifest.id] = manifest.visibleForRoles.slice();
      } else if (!widgetVisibility[manifest.id]) {
        widgetVisibility[manifest.id] = roles.map(function (r) {
          return r.id;
        });
      }

      if (manifest.config) {
        widgetConfigs[manifest.id] = Object.assign({}, widgetConfigs[manifest.id] || {}, manifest.config);
      }
    });
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

  function getWidgetConfig(widgetId) {
    return clone(widgetConfigs[widgetId] || {});
  }

  function updateWidgetConfig(widgetId, updates) {
    var current = widgetConfigs[widgetId] || {};
    widgetConfigs[widgetId] = Object.assign({}, current, updates);
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
    getPageById: getPageById,
    addPage: addPage,
    getPageLayout: getPageLayout,
    getLayoutForRole: getLayoutForRole,
    addWidgetToPage: addWidgetToPage,
    removeWidgetFromPage: removeWidgetFromPage,
    getWidgetLibrary: getWidgetLibrary,
    registerCustomWidgets: registerCustomWidgets,
    getRoles: getRoles,
    getDefaultRole: getDefaultRole,
    setWidgetVisibility: setWidgetVisibility,
    getWidgetVisibility: getWidgetVisibility,
    getWidgetConfig: getWidgetConfig,
    updateWidgetConfig: updateWidgetConfig,
    getTicketViewForRole: getTicketViewForRole,
    getTicketPresets: getTicketPresets,
    setTicketPresetForRole: setTicketPresetForRole
  };
})();
