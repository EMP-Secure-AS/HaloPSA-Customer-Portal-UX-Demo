# Vision – Next‑Gen HaloPSA Customer Portal

This document explains the **product vision** behind this UX demo.

## 1. Why this exists

HaloPSA's current Self Service Portal:

- Has a static layout
- Offers very limited configuration
- Mixes all portal settings into a single long, hard‑to‑scan page
- Does not fully leverage **roles** or **custom roles**
- Restricts dashboards to non‑interactive embeds
- Does not support **custom widgets or external integrations**

MSPs and their customers need:

- A portal that feels like a modern SaaS app
- A way to tailor the experience for:
  - End users
  - Managers
  - Local IT / site IT
  - Enterprise IT and custom roles
- A configuration experience that is as powerful as ServiceNow, but cleaner

This repo proposes a **modular, widget‑based portal** plus a **proper admin console**
to configure it.

## 2. Core ideas

1. **Everything is a page.**  
   - Home, My Tickets, Knowledge Base, Dashboards, custom pages, etc.

2. **Every page is made of widgets.**  
   - Rows, columns and widgets, defined by a simple JSON layout model.

3. **Widgets are first‑class objects.**  
   - Core widgets (hero search, tickets, news, KB, dashboards, etc.)
   - Custom widgets (DNS manager, RMM alerts, backup jobs, etc.)
   - Each widget has:
     - A manifest (metadata + config schema)
     - A render function
     - Role‑based visibility
     - Optional custom CSS

4. **Roles matter everywhere.**  
   - End users see a simple view.  
   - IT roles see powerful filters, extra columns, more dashboards.  
   - Visibility and data scope are configurable per role.

5. **Admin console is a real app, not a giant form.**  
   - Left‑hand navigation for:
     - General settings
     - Branding & themes
     - Navigation
     - Pages & layouts
     - Widget library
     - Role visibility
     - Developer tools (custom CSS/JS, integrations)

6. **Custom widgets & integrations are encouraged.**  
   - Example: a DNS manager widget for a domain provider API.
   - Developer tooling (in a real product) would include:
     - Safe backend proxy for external APIs
     - API keys stored server‑side
     - Widget SDK.

This repo will only implement **frontend UX and mock data**, but the structure
should be ready for a real backend in the future.

## 3. Demo scope

The goal is to build:

### Customer portal demo (`/portal`)

Pages (at minimum):

- Home
- My Tickets
- Knowledge Base
- Dashboards (embedded + interactive mock)
- A custom page example (e.g. "IT Policies" or "DNS")

Each page is assembled from widgets and supports light/dark theme.

### Admin console demo (`/admin`)

Sections:

- General settings
- Branding & themes
- Navigation manager
- Page builder (with drag‑and‑drop widget layout)
- Widget library (core + custom)
- Role‑based visibility configuration
- Developer tools (custom CSS / custom widgets overview)

### Widgets

At minimum:

- Hero search
- Quick actions
- My tickets
- Company tickets (for IT roles)
- News / announcements
- Knowledge base articles
- Service status
- Dashboard viewer (mock)
- Custom HTML/Markdown
- Example custom widget: **DNS Manager**

Each widget should ultimately be defined by:

- A manifest
- A render function
- A config UI definition for the admin console

The detailed implementation plan for Codex is in `codex-plan.md`.
