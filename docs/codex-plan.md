# Codex Implementation Plan

This document is written **for Codex (or another AI coding assistant)**.

It defines the phases and tasks needed to turn this repo into a fully working
frontend demo of a modular HaloPSA‑style customer portal and admin console.

Humans can read this too; it describes the intended architecture.

---

## IMPORTANT RULES FOR CODEX

1. **Always read this file _and_ `codex-progress.md` at the start of each session.**
2. **Do not attempt to complete all phases in one go.**
3. Prefer many small, focused commits over one huge change set.
4. After finishing a task or a logical group of tasks:
   - Update `docs/codex-progress.md` (under the correct phase)
   - Mark tasks as DONE
   - Add any notes or follow‑ups needed for later sessions.
5. Respect the existing file/folder layout unless a task explicitly says to change it.
6. Use simple, dependency‑free HTML/CSS/JS unless otherwise instructed.
7. Keep the codebase readable and extensible – this is a UX demo, not a minified bundle.

---

## PHASE OVERVIEW

- **Phase 0 – Housekeeping & review**
- **Phase 1 – Basic static portal & admin skeleton**
- **Phase 2 – Theme system (light/dark + brand colors)**
- **Phase 3 – Widget system (registry + basic widgets)**
- **Phase 4 – Admin console: navigation, page builder UI**
- **Phase 5 – Role‑aware behaviour (visibility, data scope)**
- **Phase 6 – Custom widgets & DNS Manager example**
- **Phase 7 – Polish, responsiveness & documentation**

Each phase has tasks. Work through them in order, but you may interleave
phases where it makes sense, as long as you keep `codex-progress.md` updated.

---

## Phase 0 – Housekeeping & Codebase Review

**Goals:**

- Understand the current repo structure.
- Ensure a clean starting point.

**Tasks:**

0.1 Open and read:
   - `README.md`
   - `docs/vision.md`
   - `docs/codex-plan.md`
   - `docs/codex-progress.md`

0.2 Confirm that the folder structure is as expected:
   - `portal/`, `admin/`, `assets/`, `widgets/`, `docs/`.

0.3 If anything is missing or obviously broken, add notes in
    `docs/codex-progress.md` under "Phase 0" and create minimal fixes.

0.4 Ensure that `portal/index.html` and `admin/index.html` are reachable and
    render some placeholder content in a browser (even if very basic).

---

## Phase 1 – Basic Static Portal & Admin Skeleton

**Goals:**

- Create a clean, simple base layout for:
  - Customer portal
  - Admin console

- Use shared CSS from `assets/css/base.css`.

**Tasks:**

1.1 Create `assets/css/base.css`:
   - Define CSS variables for colors, typography, spacing.
   - Add basic layout styles:
     - Page background
     - Container widths
     - Header, sidebar, main content area
   - Include simple button and card styles.

1.2 Create `assets/js/app.js`:
   - Export a simple `initPortal()` function that can be called from
     `portal/index.html` (even if initially does very little).
   - Export a simple `initAdmin()` function for `admin/index.html`.

1.3 Implement `portal/index.html`:
   - Top navigation bar with:
     - Brand/logo placeholder
     - Links: Home, My Tickets, Knowledge Base, Dashboards
   - Main area with:
     - A hero section: "How can we help you today?"
     - A search bar (non‑functional for now)
     - Three cards for quick actions (Report an issue, Request a service, My tickets).
   - Include `base.css` and `app.js`, and call `initPortal()` on load.

1.4 Implement `admin/index.html`:
   - Layout with:
     - Left sidebar navigation for admin sections:
       - General
       - Branding & Themes
       - Navigation
       - Pages
       - Widgets
       - Roles
       - Developer Tools
     - Main content area with a welcome message and short explanation.
   - Include `base.css` and `app.js`, and call `initAdmin()` on load.

1.5 Add a very small favicon or placeholder if useful (optional).

1.6 Update `docs/codex-progress.md` with what was implemented.

---

## Phase 2 – Theme System (Light/Dark + Brand Colors)

**Goals:**

- Implement a simple but extensible theme system using CSS variables.
- Allow runtime switching between light and dark themes.

**Tasks:**

2.1 Extend `assets/css/base.css`:
   - Define core CSS variables in `:root` for:
     - `--color-bg`, `--color-surface`, `--color-border-subtle`
     - `--color-text-main`, `--color-text-muted`
     - `--color-primary`, `--color-accent`
     - `--radius-card`, `--shadow-soft`, etc.

2.2 Create two theme modifier classes or attributes, e.g.:
   - `[data-theme="light"]` and `[data-theme="dark"]`
   - Override a subset of variables for dark mode.

2.3 In `app.js`, implement:
   - A simple theme toggle:
     - Read current theme from `localStorage` if present.
     - Toggle between light/dark when a button is clicked.
     - Store preference in `localStorage`.
     - Apply via `document.documentElement.setAttribute("data-theme", theme)`.

2.4 Add theme toggle button to:
   - `portal/index.html` (e.g. in the header).
   - `admin/index.html` (e.g. in the top right of the admin layout).

2.5 Update `docs/codex-progress.md` with details of implementation.

---

## Phase 3 – Widget System (Registry + Basic Widgets)

**Goals:**

- Introduce a simple widget abstraction.
- Define a registry of available widgets.
- Render widgets dynamically on the portal homepage using the registry.

**Tasks:**

3.1 Create `widgets/registry.json` with entries for at least:
   - `hero-search`
   - `quick-actions`
   - `recent-tickets` (mock)
   - `news`
   - `service-status`
   - `top-articles`

3.2 Create `assets/js/widgets.js`:
   - Export a function `registerCoreWidgets()` that:
     - Registers simple renderers for the core widgets.
   - Export a function `renderWidget(widgetId, container, options)` that:
     - Looks up the widget renderer.
     - Calls it with the container element and options.

3.3 Adjust `portal/index.html`:
   - Replace the hard‑coded cards/sections with generic containers that have
     `data-widget-id` attributes.
   - On `initPortal()`, find those containers and render the correct widgets
     using `renderWidget`.

3.4 For now, use mock data inside the widget renderers (no real API calls).

3.5 Update `docs/codex-progress.md`.

---

## Phase 4 – Admin Console: Navigation & Page Builder UI

**Goals:**

- Build the basic admin UI to manage:
  - Navigation items
  - Pages
  - Page layouts (visually, with drag‑and‑drop in a simple way)

**Tasks:**

4.1 In `admin/index.html`:
   - Create separate views (sections) for:
     - General
     - Branding & Themes
     - Navigation
     - Pages
     - Widgets
     - Roles
     - Developer Tools
   - Use simple tabs or show/hide panels based on sidebar selection.

4.2 Implement a basic **Navigation Manager** UI:
   - A list of nav items (mock data in JS).
   - Each nav item has:
     - Label
     - Route
     - Icon (string)
     - Visibility (all roles vs selected roles).
   - Allow reordering via up/down buttons (drag‑and‑drop can come later).

4.3 Implement a **Page list** UI:
   - Show existing pages (Home, My Tickets, KB, Dashboards, Custom Page example).
   - "Add page" button to create a new custom page (in mock data only).

4.4 Implement a **Page layout editor** (Phase 4 can be a simple version):
   - For a selected page, show:
     - A visual representation of rows/columns (even if minimal).
     - A list of widgets placed on that page.
   - Widgets can be added/removed from the page using the registry.
   - Actual drag‑and‑drop is optional here; can be done later or simulated.

4.5 Store the page layout model in a JSON structure in JS, for example:
   - In `assets/js/layouts.js` or similar.
   - The model should be close to what the portal uses to render its layout.

4.6 Update `docs/codex-progress.md`.

---

## Phase 5 – Role‑Aware Behaviour

**Goals:**

- Implement role‑based visibility for pages and widgets.
- Support different data scopes and column sets for different roles in the
  ticket list widget.

**Tasks:**

5.1 Create a simple role model in JS:
   - Predefined roles: `end_user`, `manager`, `local_it`, `company_it`, `group_it`.
   - Possibly `custom_role_x` for demonstration.
   - Provide a way to "preview as role" in both portal and admin
     (e.g. a dropdown in the header).

5.2 Extend page and widget layout models to include visibility rules, e.g.:
   - `visibleForRoles: ["end_user", "manager", "local_it"]`
   - Or a similar structure.

5.3 In the portal renderer:
   - When rendering pages and widgets, skip those that are not visible for
     the current role.

5.4 Implement role‑aware config for **My Tickets** widget:
   - Columns and filters configured differently per role.
   - For now, still mock data, but the UI should reflect:
     - Simple view for `end_user`
     - Richer view for IT roles with more columns and filters.

5.5 Add UI in the admin console (Widgets / Roles sections) to configure
     role visibility and role‑specific overrides for My Tickets.

5.6 Update `docs/codex-progress.md`.

---

## Phase 6 – Custom Widgets & DNS Manager Example

**Goals:**

- Implement a custom widget mechanism that lives alongside core widgets.
- Provide a concrete example: a DNS Manager widget (using mock data).

**Tasks:**

6.1 Define a **widget manifest format**:
   - For example, each widget folder can contain:
     - `manifest.json` – id, name, icon, description, config schema, roles.
     - `component.js` – with a `render(container, context)` function.
   - Implement this for at least one custom widget.

6.2 Implement a simple loader that:
   - Loads the widget registry (core + custom).
   - Exposes custom widgets in:
     - The portal widget renderer.
     - The admin widget library.

6.3 Create a `widgets/custom/dns-manager/manifest.json` and `component.js`:
   - DNS Manager widget should:
     - Show a list of domains (mock array).
     - On click, show DNS records (mock table).
   - The UI should be clean and consistent with the rest of the portal.

6.4 In the admin console, allow configuring the DNS Manager widget:
   - Provider name (string)
   - API base URL (string)
   - Default domain filter (string)
   - Roles that can see it

6.5 Ensure that role visibility is respected in the portal.

6.6 Update `docs/codex-progress.md`.

---

## Phase 7 – Polish, Responsiveness & Documentation

**Goals:**

- Make the demo feel like a coherent, modern app.
- Document how everything fits together.

**Tasks:**

7.1 Improve responsiveness:
   - Portal and admin should be usable on tablet and smaller screens.
   - Main navigation should adapt (e.g. collapsible sidebar on mobile).

7.2 Add subtle animations:
   - Card hover elevation
   - Fade‑in transitions for widgets
   - Non‑distracting theme toggle animation

7.3 Add sample screenshots or GIFs to `docs/` if appropriate.

7.4 Update `README.md` with:
   - How to run/view the demo
   - Short description of:
     - Widget system
     - Role system
     - Admin console features

7.5 Do a final pass in `docs/codex-progress.md` and mark the
     phases/tasks that are complete.

---

## Adding New Phases or Tasks

If Codex (or a human) discovers new features to add:

- Append new phases or tasks under the correct headings in this file.
- Reference those tasks in `docs/codex-progress.md`.

Always keep the plan & progress in sync so future sessions can continue smoothly.
