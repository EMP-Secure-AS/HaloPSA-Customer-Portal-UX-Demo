(function () {
  var domains = [
    {
      name: "acme.com",
      status: "Operational",
      records: [
        { type: "A", host: "@", value: "203.0.113.10", ttl: "300" },
        { type: "A", host: "www", value: "203.0.113.10", ttl: "300" },
        { type: "MX", host: "@", value: "10 mail.acme.com", ttl: "600" },
        { type: "TXT", host: "_spf", value: "v=spf1 include:_spf.acme.com ~all", ttl: "1800" }
      ]
    },
    {
      name: "acme.dev",
      status: "Operational",
      records: [
        { type: "A", host: "@", value: "203.0.113.42", ttl: "300" },
        { type: "CNAME", host: "staging", value: "app.dev.acme.com", ttl: "600" },
        { type: "TXT", host: "_acme-challenge", value: "token-xyz-123", ttl: "120" }
      ]
    },
    {
      name: "acme.support",
      status: "Operational",
      records: [
        { type: "A", host: "@", value: "198.51.100.88", ttl: "300" },
        { type: "CNAME", host: "help", value: "support.acme.com", ttl: "300" },
        { type: "TXT", host: "google-site-verification", value: "abc123", ttl: "86400" }
      ]
    }
  ];

  function renderRecordRow(record) {
    var row = document.createElement("div");
    row.className = "dns-record";

    [record.type, record.host, record.value, record.ttl + "s"].forEach(function (value) {
      var cell = document.createElement("div");
      cell.className = "dns-record__cell";
      cell.textContent = value;
      row.appendChild(cell);
    });

    return row;
  }

  function renderDomainDetails(domain) {
    var detail = document.createElement("div");
    detail.className = "dns-detail";

    var header = document.createElement("div");
    header.className = "dns-detail__header";
    var title = document.createElement("h3");
    title.textContent = domain.name;
    title.style.margin = "0";
    var status = document.createElement("span");
    status.className = "pill";
    status.textContent = domain.status;
    header.appendChild(title);
    header.appendChild(status);

    var helper = document.createElement("p");
    helper.className = "helper-text";
    helper.textContent = "Showing current DNS records for this zone.";

    var table = document.createElement("div");
    table.className = "dns-records";
    var headerRow = document.createElement("div");
    headerRow.className = "dns-record dns-record--head";
    ["Type", "Host", "Value", "TTL"].forEach(function (heading) {
      var cell = document.createElement("div");
      cell.className = "dns-record__cell";
      cell.textContent = heading;
      headerRow.appendChild(cell);
    });
    table.appendChild(headerRow);

    domain.records.forEach(function (record) {
      table.appendChild(renderRecordRow(record));
    });

    detail.appendChild(header);
    detail.appendChild(helper);
    detail.appendChild(table);

    return detail;
  }

  function renderDnsManager(container, context) {
    var config = (context && context.config) || {};
    var role = (context && context.role) || "end_user";
    var providerName = config.providerName || "DNS Provider";
    var defaultDomain = config.defaultDomain || domains[0].name;

    var wrapper = document.createElement("div");
    wrapper.className = "dns-manager";

    var header = document.createElement("div");
    header.className = "widget-header";
    var title = document.createElement("h3");
    title.textContent = providerName + " DNS";
    title.style.margin = "0";
    var helper = document.createElement("div");
    helper.className = "helper-text";
    helper.textContent = (context && context.apiBaseUrl) || config.apiBaseUrl || "Mock API";
    header.appendChild(title);
    header.appendChild(helper);

    var badge = document.createElement("span");
    badge.className = "pill";
    badge.textContent = "Role: " + role.replace("_", " ");
    header.appendChild(badge);

    var layout = document.createElement("div");
    layout.className = "dns-layout";

    var domainList = document.createElement("div");
    domainList.className = "dns-domains";

    var domainTitle = document.createElement("div");
    domainTitle.className = "dns-domains__header";
    domainTitle.textContent = "Domains";
    domainList.appendChild(domainTitle);

    var list = document.createElement("div");
    list.className = "dns-domain-list";

    var activeDomain = domains.find(function (d) { return d.name === defaultDomain; }) || domains[0];

    domains.forEach(function (domain) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "dns-domain" + (activeDomain.name === domain.name ? " dns-domain--active" : "");
      item.textContent = domain.name;
      item.addEventListener("click", function () {
        activeDomain = domain;
        Array.from(list.children).forEach(function (child) {
          child.classList.toggle("dns-domain--active", child.textContent === domain.name);
        });
        detailArea.innerHTML = "";
        detailArea.appendChild(renderDomainDetails(domain));
      });
      list.appendChild(item);
    });

    domainList.appendChild(list);

    var detailArea = document.createElement("div");
    detailArea.className = "dns-detail__wrapper";
    detailArea.appendChild(renderDomainDetails(activeDomain));

    layout.appendChild(domainList);
    layout.appendChild(detailArea);

    wrapper.appendChild(header);
    wrapper.appendChild(layout);
    container.innerHTML = "";
    container.appendChild(wrapper);
  }

  window.CustomWidgetComponents = window.CustomWidgetComponents || {};
  window.CustomWidgetComponents["dns-manager"] = renderDnsManager;
})();
