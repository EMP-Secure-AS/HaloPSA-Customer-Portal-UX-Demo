// Simple widget registry for the portal
(function () {
  var registry = {};
  var registryUrl = "../widgets/registry.json";

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

    registry["recent-tickets"] = function (container) {
      var tickets = [
        { id: "INC-1042", summary: "VPN disconnecting frequently", status: "Open", updated: "Just now" },
        { id: "SR-2028", summary: "Request new headset", status: "In Progress", updated: "12m ago" },
        { id: "INC-1037", summary: "Email sync delayed", status: "Awaiting User", updated: "1h ago" }
      ];

      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = "Recent tickets";
      title.style.margin = "0";
      header.appendChild(title);
      var action = document.createElement("button");
      action.className = "btn btn-secondary";
      action.textContent = "View all";
      header.appendChild(action);
      container.appendChild(header);

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

      container.appendChild(list);
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
    var renderer = registry[widgetId];
    if (!renderer) {
      container.innerHTML =
        '<div class="muted small-text">Widget "' + widgetId + '" is not registered.</div>';
      return;
    }
    renderer(container, options || {});
  }

  function loadWidgetRegistry() {
    return fetch(registryUrl)
      .then(function (resp) {
        if (!resp.ok) throw new Error("Failed to load widget registry");
        return resp.json();
      })
      .catch(function () {
        return { core: [], custom: [] };
      });
  }

  window.WidgetSystem = {
    registerCoreWidgets: registerCoreWidgets,
    renderWidget: renderWidget,
    loadWidgetRegistry: loadWidgetRegistry,
  };
})();
