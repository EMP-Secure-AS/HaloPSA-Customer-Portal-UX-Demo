// Simple widget registry for the portal
(function () {
  var registry = {};
  var registryUrl = "../widgets/registry.json";
  var widgetBasePath = registryUrl.replace("registry.json", "");
  var registryPromise = null;
  var customManifests = [];
  var coreRegistered = false;

  function renderStatusPill(label, tone) {
    var pill = document.createElement("span");
    pill.className = "status-pill" + (tone ? " status-pill--" + tone : "");
    var dot = document.createElement("span");
    dot.className = "status-pill__dot";
    pill.appendChild(dot);
    pill.appendChild(document.createTextNode(label));
    return pill;
  }

  function renderList(items) {
    var list = document.createElement("ul");
    list.className = "simple-list";
    items.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "simple-list__item";
      var title = document.createElement("div");
      title.className = "simple-list__title";
      title.textContent = item.title;
      li.appendChild(title);
      if (item.meta) {
        var meta = document.createElement("div");
        meta.className = "simple-list__meta";
        meta.textContent = item.meta;
        li.appendChild(meta);
      }
      if (item.tag) {
        var tag = document.createElement("span");
        tag.className = "pill";
        tag.textContent = item.tag;
        li.appendChild(tag);
      }
      list.appendChild(li);
    });
    return list;
  }

  function registerCoreWidgets() {
    coreRegistered = true;
    registry["hero-search"] = function (container) {
      container.classList.add("hero", "stack");
      container.innerHTML =
        '<div class="inline">' +
        '  <div class="badge">Portal Demo</div>' +
        '  <span class="muted small-text">Widget-driven layout</span>' +
        "</div>" +
        "<h1>How can we help you today?</h1>" +
        "<p>Quickly raise issues, request services, and find answers in our knowledge base.</p>" +
        '<div class="search-bar">' +
        '  <input type="search" placeholder="Search for help, articles, or services" aria-label="Search" />' +
        '  <button class="btn btn-primary">Search</button>' +
        "</div>" +
        '<div class="inline quick-prompts">' +
        '  <button class="btn btn-secondary">Reset password</button>' +
        '  <button class="btn btn-secondary">Request laptop</button>' +
        '  <button class="btn btn-secondary">Report an outage</button>' +
        "</div>";
    };

    registry["quick-actions"] = function (container) {
      container.classList.add("quick-actions");
      container.innerHTML =
        '<div class="inline" style="justify-content: space-between;">' +
        '  <div class="stack" style="gap: 4px;">' +
        '    <h2 style="margin: 0;">Get started</h2>' +
        '    <p class="muted" style="margin: 0;">Common actions and shortcuts.</p>' +
        "  </div>" +
        '  <button class="btn btn-secondary">View all services</button>' +
        "</div>" +
        '<div class="card-grid" style="margin-top: 12px;">' +
        '  <article class="card">' +
        '    <div class="action-title">Report an issue</div>' +
        '    <p class="muted">Log a new incident with IT support.</p>' +
        '    <button class="btn btn-primary" style="align-self: flex-start;">Start ticket</button>' +
        "  </article>" +
        '  <article class="card">' +
        '    <div class="action-title">Request a service</div>' +
        '    <p class="muted">Browse available services and submit a request.</p>' +
        '    <button class="btn btn-primary" style="align-self: flex-start;">Open catalog</button>' +
        "  </article>" +
        '  <article class="card">' +
        '    <div class="action-title">My tickets</div>' +
        '    <p class="muted">Check the status of your open requests.</p>' +
        '    <button class="btn btn-primary" style="align-self: flex-start;">View tickets</button>' +
        "  </article>" +
        "</div>";
    };

    registry["recent-tickets"] = function (container, options) {
      var role = (options && options.role) || "end_user";
      var ticketView = (options && options.ticketView) || { id: "summary", columns: [] };
      var variant = options && options.variant ? options.variant : ticketView.id;
      var tickets = [
        { id: "INC-1042", summary: "VPN disconnecting frequently", status: "Open", owner: "Service Desk", priority: "P2", age: "2h", updated: "Just now" },
        { id: "SR-2028", summary: "Request new headset", status: "In Progress", owner: "Hardware", priority: "P4", age: "1d", updated: "12m ago" },
        { id: "INC-1037", summary: "Email sync delayed", status: "Awaiting User", owner: "Messaging", priority: "P3", age: "5h", updated: "1h ago" }
      ];

      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = variant === "operations" ? "Queue overview" : "Recent tickets";
      title.style.margin = "0";
      header.appendChild(title);
      var badge = document.createElement("span");
      badge.className = "pill";
      badge.textContent = "Role: " + role.replace("_", " ");
      header.appendChild(badge);
      var action = document.createElement("button");
      action.className = "btn btn-secondary";
      action.textContent = "View all";
      header.appendChild(action);
      container.appendChild(header);

      if (variant === "operations") {
        var table = document.createElement("div");
        table.className = "ticket-table";

        var headerRow = document.createElement("div");
        headerRow.className = "ticket-table__row ticket-table__row--head";
        ticketView.columns.forEach(function (col) {
          var cell = document.createElement("div");
          cell.className = "ticket-table__cell";
          cell.textContent = col;
          headerRow.appendChild(cell);
        });
        table.appendChild(headerRow);

        tickets.forEach(function (ticket) {
          var row = document.createElement("div");
          row.className = "ticket-table__row";
          ticketView.columns.forEach(function (col) {
            var cell = document.createElement("div");
            cell.className = "ticket-table__cell";
            var value = ticket[col.toLowerCase()] || "—";
            if (col === "Status") {
              cell.appendChild(renderStatusPill(ticket.status, "info"));
            } else {
              cell.textContent = value;
            }
            row.appendChild(cell);
          });
          table.appendChild(row);
        });

        var filters = document.createElement("div");
        filters.className = "helper-text";
        filters.textContent = "Filters: " + (ticketView.filters || "All queues");
        container.appendChild(filters);
        container.appendChild(table);
      } else {
        var list = document.createElement("div");
        list.className = "ticket-list";
        tickets.forEach(function (ticket) {
          var row = document.createElement("div");
          row.className = "ticket-row";

          var main = document.createElement("div");
          main.className = "ticket-row__main";
          var id = document.createElement("div");
          id.className = "pill";
          id.textContent = ticket.id;
          var summary = document.createElement("div");
          summary.className = "ticket-row__summary";
          summary.textContent = ticket.summary;
          main.appendChild(id);
          main.appendChild(summary);
          row.appendChild(main);

          var meta = document.createElement("div");
          meta.className = "ticket-row__meta";
          var status = renderStatusPill(ticket.status, "info");
          meta.appendChild(status);
          var updated = document.createElement("span");
          updated.className = "muted small-text";
          updated.textContent = ticket.updated;
          meta.appendChild(updated);
          row.appendChild(meta);

          list.appendChild(row);
        });

        var helper = document.createElement("div");
        helper.className = "helper-text";
        helper.textContent = "Showing simplified view for " + role.replace("_", " ");
        container.appendChild(helper);
        container.appendChild(list);
      }
    };

    registry["news"] = function (container) {
      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = "News";
      title.style.margin = "0";
      header.appendChild(title);
      container.appendChild(header);

      var articles = [
        { title: "New self-service catalog", meta: "Explore 30+ ready-made services" },
        { title: "Planned maintenance", meta: "Saturday 11:00 PM – 1:00 AM UTC" },
        { title: "Security reminder", meta: "Please reset your VPN token by Friday" }
      ];

      container.appendChild(renderList(articles));
    };

    registry["service-status"] = function (container) {
      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = "Service status";
      title.style.margin = "0";
      header.appendChild(title);
      container.appendChild(header);

      var services = [
        { name: "Email & Calendar", state: "Operational", tone: "success" },
        { name: "VPN / Remote Access", state: "Minor incident", tone: "warn" },
        { name: "HR Portal", state: "Operational", tone: "success" }
      ];

      var list = document.createElement("div");
      list.className = "status-list";
      services.forEach(function (svc) {
        var row = document.createElement("div");
        row.className = "status-row";
        var name = document.createElement("div");
        name.textContent = svc.name;
        var badge = renderStatusPill(svc.state, svc.tone);
        row.appendChild(name);
        row.appendChild(badge);
        list.appendChild(row);
      });
      container.appendChild(list);
    };

    registry["top-articles"] = function (container) {
      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = "Top articles";
      title.style.margin = "0";
      header.appendChild(title);
      container.appendChild(header);

      var articles = [
        { title: "Reset your Windows password", meta: "2 min read", tag: "Popular" },
        { title: "Setup Outlook on mobile", meta: "5 min read", tag: "How-to" },
        { title: "Connect to Wi-Fi in the office", meta: "1 min read", tag: "Guide" }
      ];

      container.appendChild(renderList(articles));
    };
  }

  function renderWidget(widgetId, container, options) {
    ensureCore();
    var renderer = registry[widgetId];
    if (!renderer) {
      container.innerHTML =
        '<div class="muted small-text">Widget "' + widgetId + '" is not registered.</div>';
      return;
    }
    renderer(container, options || {});
  }

  function ensureCore() {
    if (!coreRegistered) {
      registerCoreWidgets();
    }
  }

  function loadManifest(manifestRef) {
    var path = typeof manifestRef === "string" ? manifestRef : manifestRef.path;
    if (!path) return Promise.resolve(null);
    var fullPath = widgetBasePath + path;
    var basePath = fullPath.substring(0, fullPath.lastIndexOf("/") + 1);
    return fetch(fullPath)
      .then(function (resp) {
        if (!resp.ok) throw new Error("Failed to load manifest");
        return resp.json();
      })
      .then(function (manifest) {
        manifest.__basePath = basePath;
        return manifest;
      })
      .catch(function () {
        return null;
      });
  }

  function loadCustomManifests(customRefs) {
    return Promise.all((customRefs || []).map(loadManifest)).then(function (loaded) {
      return loaded.filter(Boolean);
    });
  }

  function loadCustomComponent(manifest) {
    if (!manifest || !manifest.entry) return Promise.resolve(null);
    return new Promise(function (resolve) {
      var script = document.createElement("script");
      script.src = manifest.__basePath + manifest.entry;
      script.onload = function () {
        var renderer =
          (window.CustomWidgetComponents && window.CustomWidgetComponents[manifest.id]) || null;
        if (renderer) {
          registry[manifest.id] = renderer;
        }
        resolve(renderer);
      };
      script.onerror = function () {
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }

  function loadCustomComponents(manifests) {
    return Promise.all(manifests.map(loadCustomComponent));
  }

  function loadWidgetRegistry() {
    if (registryPromise) return registryPromise;

    registryPromise = fetch(registryUrl)
      .then(function (resp) {
        if (!resp.ok) throw new Error("Failed to load widget registry");
        return resp.json();
      })
      .then(function (data) {
        ensureCore();
        return loadCustomManifests(data.custom || []).then(function (manifests) {
          customManifests = manifests;
          return loadCustomComponents(manifests).then(function () {
            return {
              core: data.core || [],
              custom: data.custom || [],
              customManifests: manifests,
            };
          });
        });
      })
      .catch(function () {
        ensureCore();
        return { core: [], custom: [], customManifests: [] };
      });

    return registryPromise;
  }

  window.WidgetSystem = {
    registerCoreWidgets: registerCoreWidgets,
    renderWidget: renderWidget,
    loadWidgetRegistry: loadWidgetRegistry,
    getCustomManifests: function () {
      return customManifests.slice();
    },
  };
})();
