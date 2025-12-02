// Simple widget registry for the portal
(function () {
  var registry = {};
  var registryUrl = "../widgets/registry.json";
  var widgetBasePath = registryUrl.replace("registry.json", "");
  var registryPromise = null;
  var customManifests = [];
  var coreRegistered = false;
  var knowledgeArticles = [
    {
      id: "kb-reset-password",
      title: "Reset your Windows password",
      category: "Accounts & Access",
      readTime: "2 min read",
      body: "Use the self-service password reset portal to unlock or reset your credentials without waiting for IT.",
    },
    {
      id: "kb-vpn-issues",
      title: "VPN troubleshooting guide",
      category: "Networking",
      readTime: "4 min read",
      body: "Check connectivity, restart the VPN client, and confirm your token is in sync before raising a ticket.",
    },
    {
      id: "kb-hardware-request",
      title: "Ordering new hardware",
      category: "Requests",
      readTime: "3 min read",
      body: "Browse the service catalog for laptops, monitors, and accessories. Standard approvals apply for managers.",
    },
  ];
  var kbState = { selectedArticleId: knowledgeArticles[0].id };
  var serviceCatalogItems = [
    { id: "svc-laptop", name: "Request a laptop", group: "Hardware", sla: "5 business days", approver: "Manager" },
    { id: "svc-software", name: "Request software", group: "Software", sla: "2 business days", approver: "Team Lead" },
    { id: "svc-vpn", name: "VPN access", group: "Access", sla: "Same day", approver: "Security" },
    { id: "svc-access-card", name: "Building access card", group: "Facilities", sla: "1 business day", approver: "Facilities" },
  ];
  var dashboardMetrics = {
    ticketsToday: 48,
    avgHandle: "22m",
    csat: 4.7,
    hotspots: ["Email", "VPN", "Laptops"],
  };
  var legacyTickets = [
    { id: "INC-992", summary: "Wi-Fi drops in meeting rooms", closed: "2w ago", score: null },
    { id: "SR-1844", summary: "Request monitor upgrade", closed: "5d ago", score: null },
    { id: "INC-987", summary: "MFA app token reset", closed: "1d ago", score: null },
  ];

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

  function setSelectedArticle(articleId) {
    kbState.selectedArticleId = articleId;
    document.dispatchEvent(new CustomEvent("kb:articleChange", { detail: { id: articleId } }));
  }

  function getSelectedArticle() {
    return knowledgeArticles.find(function (article) {
      return article.id === kbState.selectedArticleId;
    }) || knowledgeArticles[0];
  }

  function registerCoreWidgets() {
    coreRegistered = true;
    registry["hero-search"] = function (container, options) {
      var portalSettings = (options && options.portalSettings) || {};
      var headline = portalSettings.welcomeHeadline || "How can we help you today?";
      var message =
        portalSettings.welcomeMessage ||
        "Quickly raise issues, request services, and find answers in our knowledge base.";
      var badge = portalSettings.bannerText || "Portal Demo";

      container.classList.add("hero", "stack");
      container.innerHTML =
        '<div class="inline">' +
        '  <div class="badge">' + badge + "</div>" +
        '  <span class="muted small-text">Widget-driven layout</span>' +
        "</div>" +
        "<h1>" + headline + "</h1>" +
        "<p>" + message + "</p>" +
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

    registry["quick-actions"] = function (container, options) {
      var navigate = options && options.navigate;
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

      var buttons = container.querySelectorAll("button");
      if (navigate && buttons.length >= 4) {
        buttons[0].addEventListener("click", function () {
          navigate("service-catalog");
        });
        buttons[1].addEventListener("click", function () {
          navigate("report-issue");
        });
        buttons[2].addEventListener("click", function () {
          navigate("service-catalog");
        });
        buttons[3].addEventListener("click", function () {
          navigate("tickets");
        });
      }
    };

    registry["recent-tickets"] = function (container, options) {
      var role = (options && options.role) || "end_user";
      var ticketView = (options && options.ticketView) || { id: "summary", columns: [] };
      var variant = options && options.variant ? options.variant : ticketView.id;
      var navigate = options && options.navigate;
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
      if (navigate) {
        action.addEventListener("click", function () {
          navigate("tickets");
        });
      }
      header.appendChild(action);
      container.appendChild(header);

      if (variant === "operations") {
        var filters = document.createElement("div");
        filters.className = "inline pill-group";
        ["Open", "Awaiting user", "High priority", "Past SLA"].forEach(function (chip) {
          var pill = document.createElement("button");
          pill.className = "pill pill--ghost";
          pill.textContent = chip;
          pill.type = "button";
          filters.appendChild(pill);
        });
        container.appendChild(filters);

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

        var filtersHelper = document.createElement("div");
        filtersHelper.className = "helper-text";
        filtersHelper.textContent = "Filters: " + (ticketView.filters || "All queues");
        container.appendChild(filtersHelper);
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

    registry["ticket-details"] = function (container, options) {
      var ticket = {
        id: "INC-1042",
        status: "Open",
        priority: "P2",
        impact: "Team",
        service: "Remote access",
        requester: "Jordan Diaz",
        updated: "Just now",
        summary: "VPN disconnecting frequently",
        timeline: [
          { label: "Comment added", actor: "Jordan Diaz", time: "Just now", detail: "Provided logs and screenshots." },
          { label: "Status changed", actor: "Service Desk", time: "1h ago", detail: "Set to In Progress." },
          { label: "Ticket created", actor: "Jordan Diaz", time: "2h ago", detail: "Reported VPN drops when travelling." }
        ]
      };

      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = ticket.summary;
      title.style.margin = "0";
      header.appendChild(title);
      header.appendChild(renderStatusPill(ticket.status, "info"));
      var meta = document.createElement("div");
      meta.className = "inline";
      [ticket.id, ticket.priority, ticket.service].forEach(function (item) {
        var pill = document.createElement("span");
        pill.className = "pill pill--ghost";
        pill.textContent = item;
        meta.appendChild(pill);
      });
      header.appendChild(meta);
      container.appendChild(header);

      var grid = document.createElement("div");
      grid.className = "stack";
      grid.style.gap = "0.5rem";
      var requester = document.createElement("div");
      requester.className = "helper-text";
      requester.textContent = "Requester: " + ticket.requester + " • Impact: " + ticket.impact;
      grid.appendChild(requester);

      var timeline = document.createElement("div");
      timeline.className = "timeline";
      ticket.timeline.forEach(function (event) {
        var row = document.createElement("div");
        row.className = "timeline__row";
        var badge = document.createElement("div");
        badge.className = "pill";
        badge.textContent = event.label;
        var details = document.createElement("div");
        details.className = "timeline__body";
        details.innerHTML =
          '<div class="timeline__title">' + event.actor + " • " + event.time + "</div>" +
          '<div class="muted small-text">' + event.detail + "</div>";
        row.appendChild(badge);
        row.appendChild(details);
        timeline.appendChild(row);
      });

      grid.appendChild(timeline);
      container.appendChild(grid);
    };

    registry["issue-form"] = function (container, options) {
      var navigate = options && options.navigate;
      container.innerHTML = "";
      var form = document.createElement("div");
      form.className = "stack";
      form.style.gap = "0.5rem";

      var summaryLabel = document.createElement("label");
      summaryLabel.className = "stack";
      summaryLabel.style.gap = "0.25rem";
      summaryLabel.innerHTML = '<span class="list-row__title">Summary</span>';
      var summaryInput = document.createElement("input");
      summaryInput.className = "text-input";
      summaryInput.placeholder = "Describe the issue";
      summaryLabel.appendChild(summaryInput);
      form.appendChild(summaryLabel);

      var categoryLabel = document.createElement("label");
      categoryLabel.className = "stack";
      categoryLabel.style.gap = "0.25rem";
      categoryLabel.innerHTML = '<span class="list-row__title">Category</span>';
      var categorySelect = document.createElement("select");
      ["Networking", "Accounts", "Hardware", "Software"].forEach(function (cat) {
        var opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
      });
      categoryLabel.appendChild(categorySelect);
      form.appendChild(categoryLabel);

      var severityLabel = document.createElement("div");
      severityLabel.className = "stack";
      severityLabel.style.gap = "0.25rem";
      severityLabel.innerHTML = '<span class="list-row__title">Impact</span>';
      var severityRow = document.createElement("div");
      severityRow.className = "inline pill-group";
      ["Just me", "My team", "Whole site"].forEach(function (sev, index) {
        var btn = document.createElement("button");
        btn.className = "pill pill--ghost" + (index === 0 ? " pill--active" : "");
        btn.type = "button";
        btn.textContent = sev;
        btn.addEventListener("click", function () {
          var pills = severityRow.querySelectorAll(".pill");
          pills.forEach(function (pill) { pill.classList.remove("pill--active"); });
          btn.classList.add("pill--active");
        });
        severityRow.appendChild(btn);
      });
      severityLabel.appendChild(severityRow);
      form.appendChild(severityLabel);

      var detailsLabel = document.createElement("label");
      detailsLabel.className = "stack";
      detailsLabel.style.gap = "0.25rem";
      detailsLabel.innerHTML = '<span class="list-row__title">Details</span>';
      var detailsInput = document.createElement("textarea");
      detailsInput.className = "text-input";
      detailsInput.rows = 3;
      detailsInput.placeholder = "Add steps to reproduce, error messages, or screenshots";
      detailsLabel.appendChild(detailsInput);
      form.appendChild(detailsLabel);

      var submit = document.createElement("button");
      submit.className = "btn btn-primary";
      submit.textContent = "Submit issue (mock)";
      var helper = document.createElement("div");
      helper.className = "helper-text";
      helper.textContent = "No backend calls are made; this is a mocked form.";
      submit.addEventListener("click", function () {
        helper.textContent = "Submitted! You'll see the ticket in My Tickets.";
        if (navigate) {
          navigate("tickets");
        }
      });

      form.appendChild(submit);
      form.appendChild(helper);
      container.appendChild(form);
    };

    registry["service-catalog"] = function (container, options) {
      var navigate = options && options.navigate;
      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = "Service catalog";
      title.style.margin = "0";
      header.appendChild(title);
      var search = document.createElement("input");
      search.type = "search";
      search.placeholder = "Search services";
      search.className = "text-input";
      search.style.maxWidth = "260px";
      header.appendChild(search);
      container.appendChild(header);

      var filters = document.createElement("div");
      filters.className = "inline pill-group";
      ["All", "Hardware", "Software", "Access", "Facilities"].forEach(function (group, index) {
        var chip = document.createElement("button");
        chip.className = "pill pill--ghost" + (index === 0 ? " pill--active" : "");
        chip.type = "button";
        chip.textContent = group;
        chip.addEventListener("click", function () {
          Array.from(filters.children).forEach(function (el) { el.classList.remove("pill--active"); });
          chip.classList.add("pill--active");
          renderCards(group === "All" ? null : group);
        });
        filters.appendChild(chip);
      });
      container.appendChild(filters);

      var cards = document.createElement("div");
      cards.className = "card-grid";
      cards.style.marginTop = "12px";
      container.appendChild(cards);

      function renderCards(group) {
        cards.innerHTML = "";
        serviceCatalogItems
          .filter(function (item) { return !group || item.group === group; })
          .forEach(function (item) {
            var card = document.createElement("article");
            card.className = "card";
            var name = document.createElement("div");
            name.className = "action-title";
            name.textContent = item.name;
            var meta = document.createElement("div");
            meta.className = "helper-text";
            meta.textContent = item.group + " • SLA " + item.sla;
            var approver = document.createElement("div");
            approver.className = "muted";
            approver.textContent = "Approver: " + item.approver;
            var btn = document.createElement("button");
            btn.className = "btn btn-primary";
            btn.textContent = "Request";
            btn.addEventListener("click", function () {
              if (navigate) navigate("service-catalog");
              meta.textContent = "Request started (mock) • " + item.sla;
            });

            card.appendChild(name);
            card.appendChild(meta);
            card.appendChild(approver);
            card.appendChild(btn);
            cards.appendChild(card);
          });
      }

      renderCards();
    };

    registry["kb-categories"] = function (container) {
      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = "Knowledge categories";
      title.style.margin = "0";
      header.appendChild(title);
      container.appendChild(header);

      var categories = knowledgeArticles.reduce(function (map, article) {
        map[article.category] = map[article.category] || { count: 0 };
        map[article.category].count += 1;
        map[article.category].first = map[article.category].first || article.id;
        return map;
      }, {});

      var list = document.createElement("div");
      list.className = "card-grid";
      Object.keys(categories).forEach(function (category) {
        var card = document.createElement("article");
        card.className = "card";
        var name = document.createElement("div");
        name.className = "action-title";
        name.textContent = category;
        var count = document.createElement("div");
        count.className = "muted";
        count.textContent = categories[category].count + " article(s)";
        var btn = document.createElement("button");
        btn.className = "btn btn-secondary btn-compact";
        btn.textContent = "View";
        btn.addEventListener("click", function () {
          setSelectedArticle(categories[category].first);
        });
        card.appendChild(name);
        card.appendChild(count);
        card.appendChild(btn);
        list.appendChild(card);
      });
      container.appendChild(list);
    };

    registry["kb-article"] = function (container) {
      container.innerHTML = "";
      var article = getSelectedArticle();
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = article.title;
      title.style.margin = "0";
      header.appendChild(title);
      header.appendChild(renderStatusPill(article.readTime, "info"));
      container.appendChild(header);

      var body = document.createElement("p");
      body.textContent = article.body;
      container.appendChild(body);

      var helper = document.createElement("div");
      helper.className = "helper-text";
      helper.textContent = "Select a category to change the article.";
      container.appendChild(helper);

      if (container._kbListener) {
        document.removeEventListener("kb:articleChange", container._kbListener);
      }
      var handler = function () {
        registry["kb-article"](container);
      };
      container._kbListener = handler;
      document.addEventListener("kb:articleChange", handler);
    };

    registry["insights-dashboard"] = function (container) {
      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = "Operations dashboard";
      title.style.margin = "0";
      header.appendChild(title);

      var controls = document.createElement("div");
      controls.className = "inline pill-group";
      ["Today", "This week", "This month"].forEach(function (range, index) {
        var btn = document.createElement("button");
        btn.className = "pill pill--ghost" + (index === 1 ? " pill--active" : "");
        btn.type = "button";
        btn.textContent = range;
        btn.addEventListener("click", function () {
          Array.from(controls.children).forEach(function (el) { el.classList.remove("pill--active"); });
          btn.classList.add("pill--active");
        });
        controls.appendChild(btn);
      });
      header.appendChild(controls);
      container.appendChild(header);

      var grid = document.createElement("div");
      grid.className = "card-grid";
      [
        { label: "Tickets today", value: dashboardMetrics.ticketsToday },
        { label: "Avg handle time", value: dashboardMetrics.avgHandle },
        { label: "CSAT", value: dashboardMetrics.csat + "/5" },
      ].forEach(function (metric) {
        var card = document.createElement("article");
        card.className = "card";
        var name = document.createElement("div");
        name.className = "helper-text";
        name.textContent = metric.label;
        var value = document.createElement("div");
        value.className = "action-title";
        value.textContent = metric.value;
        card.appendChild(name);
        card.appendChild(value);
        grid.appendChild(card);
      });

      var hotspots = document.createElement("div");
      hotspots.className = "stack";
      hotspots.style.gap = "0.5rem";
      var hotTitle = document.createElement("div");
      hotTitle.className = "list-row__title";
      hotTitle.textContent = "Top drivers";
      hotspots.appendChild(hotTitle);
      var chips = document.createElement("div");
      chips.className = "inline pill-group";
      dashboardMetrics.hotspots.forEach(function (hot) {
        var pill = document.createElement("span");
        pill.className = "pill";
        pill.textContent = hot;
        chips.appendChild(pill);
      });
      hotspots.appendChild(chips);

      container.appendChild(grid);
      container.appendChild(hotspots);
    };

    registry["legacy-feedback"] = function (container) {
      container.innerHTML = "";
      var header = document.createElement("div");
      header.className = "widget-header";
      var title = document.createElement("h3");
      title.textContent = "Closed tickets";
      title.style.margin = "0";
      header.appendChild(title);
      container.appendChild(header);

      var list = document.createElement("div");
      list.className = "list-stack";
      legacyTickets.forEach(function (item) {
        var row = document.createElement("div");
        row.className = "list-row";
        var main = document.createElement("div");
        main.className = "list-row__main";
        var name = document.createElement("div");
        name.className = "list-row__title";
        name.textContent = item.id + " – " + item.summary;
        var meta = document.createElement("div");
        meta.className = "list-row__meta";
        meta.textContent = "Closed " + item.closed;
        main.appendChild(name);
        main.appendChild(meta);

        var actions = document.createElement("div");
        actions.className = "inline";
        actions.style.gap = "0.25rem";
        ["😊", "😐", "😞"].forEach(function (face) {
          var btn = document.createElement("button");
          btn.className = "pill pill--ghost";
          btn.textContent = face;
          btn.type = "button";
          btn.addEventListener("click", function () {
            actions.querySelectorAll(".pill").forEach(function (pill) { pill.classList.remove("pill--active"); });
            btn.classList.add("pill--active");
          });
          actions.appendChild(btn);
        });

        row.appendChild(main);
        row.appendChild(actions);
        list.appendChild(row);
      });

      var helper = document.createElement("div");
      helper.className = "helper-text";
      helper.textContent = "Select an emoji to leave quick feedback on historic tickets.";
      container.appendChild(list);
      container.appendChild(helper);
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
