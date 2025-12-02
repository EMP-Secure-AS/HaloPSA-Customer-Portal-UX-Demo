# Halo Self Service Portal Settings Map

This file maps the official Halo Self Service Portal settings (per https://usehalo.com/halopsa/guides/1862) to the demo admin console. Each setting lists its category, the admin section/control where it belongs, and its demo coverage level:

- **Fully implemented in the demo** – wired to mock behaviour or visuals.
- **Partially represented (visual only)** – surfaced as UI but not backed by logic.
- **Documented only** – listed for completeness; not yet present in the UI.

## Branding & Identity

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Portal title | General → Portal basics | Text input | Fully implemented in the demo |
| Welcome message / hero text | General → Portal basics | Textarea | Fully implemented in the demo |
| Logo | Branding & Themes | URL or initials input | Fully implemented in the demo |
| Favicon | Branding & Themes | File picker (placeholder) | Documented only |
| Primary/secondary colours | Branding & Themes | Color pickers | Fully implemented in the demo |
| Background/heading colours | Branding & Themes | Color pickers | Partially represented (visual only) |
| Custom CSS | Developer Tools | Textarea | Documented only |
| Custom JavaScript | Developer Tools | Textarea | Documented only |
| Footer text/links | General → Portal basics | Textarea/list | Documented only |

## Authentication & Access

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Allow portal login | General → Authentication | Toggle | Partially represented (visual only) |
| Enforce SSO / OAuth | General → Authentication | Selector | Documented only |
| Local account password rules | General → Authentication | Selector | Documented only |
| Multi-factor authentication prompt | General → Authentication | Toggle | Documented only |
| Anonymous user access | Roles | Toggle with helper copy | Partially represented (visual only) |
| Guest ticket submission | Roles | Toggle | Documented only |
| External portal URL / redirect | General → Authentication | Text input | Documented only |

## Navigation & Menu Buttons

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Enable/disable Home | Navigation | Visibility toggles per role | Fully implemented in the demo |
| Enable/disable My Tickets | Navigation | Visibility toggles per role | Fully implemented in the demo |
| Enable/disable Report Issue | Navigation | Visibility toggles per role | Fully implemented in the demo |
| Enable/disable Send Request | Navigation | Visibility toggles per role | Fully implemented in the demo |
| Enable/disable Knowledge Base | Navigation | Visibility toggles per role | Fully implemented in the demo |
| Enable/disable Dashboards | Navigation | Visibility toggles per role | Fully implemented in the demo |
| Enable/disable Feedback/Old Tickets | Navigation | Visibility toggles per role | Fully implemented in the demo |
| Custom menu buttons (URL / action) | Navigation | Row with label + URL inputs | Fully implemented in the demo |
| Menu order | Navigation | Up/Down reorder buttons | Fully implemented in the demo |
| Role-based menu visibility | Navigation | Per-role checkboxes | Fully implemented in the demo |

## Pages & Content

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Default landing page | Pages | Dropdown | Partially represented (visual only) |
| Enable ticket details view | Pages | Toggle | Fully implemented in the demo |
| Enable report issue page | Pages | Toggle | Fully implemented in the demo (wires nav/widgets) |
| Enable service catalog | Pages | Toggle | Fully implemented in the demo (wires nav/widgets) |
| Enable knowledge base | Pages | Toggle | Fully implemented in the demo (wires nav/widgets) |
| Enable dashboards | Pages | Toggle | Fully implemented in the demo (wires nav/widgets) |
| Enable legacy/feedback page | Pages | Toggle | Fully implemented in the demo |
| Page layout builder | Pages | Layout editor (rows/columns/widgets) | Fully implemented in the demo |
| Page-level role visibility | Pages | Role checkboxes | Fully implemented in the demo |

## Widgets & Catalogue

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Widget catalogue (core) | Widgets | Library list | Fully implemented in the demo |
| Widget visibility per role | Widgets | Checkboxes | Fully implemented in the demo |
| Custom widgets registry | Widgets | Manifest loader summary | Fully implemented in the demo |
| My Tickets column presets by role | Widgets → My Tickets overrides | Dropdown per role | Fully implemented in the demo |
| DNS Manager widget settings | Widgets → DNS Manager | Text inputs & role toggles | Fully implemented in the demo |
| Knowledge base widget settings | Widgets | Text inputs for featured categories | Partially represented (visual only) |
| Dashboard widgets | Widgets | Toggle list | Partially represented (visual only) |

## Requests & Approvals

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Allow incident submission | Pages → Report Issue | Toggle | Fully implemented in the demo |
| Require approval for catalog items | Pages → Send Request | Toggle | Partially represented (visual only) |
| Request categories / groups | Pages → Send Request | Multi-select | Partially represented (visual only) |
| Default assignment team | Widgets / Pages | Dropdown | Documented only |
| Approval workflows (manager/finance) | Pages → Send Request | Selector | Documented only |

## Tickets & Visibility

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Ticket list filters | Widgets → My Tickets overrides | Dropdown per role | Fully implemented in the demo |
| Ticket column visibility | Widgets → My Tickets overrides | Dropdown per role | Fully implemented in the demo |
| Show closed tickets | Navigation → Legacy/Feedback | Toggle | Fully implemented in the demo |
| Allow feedback on closed tickets | Navigation → Legacy/Feedback | Toggle | Partially represented (visual only) |
| Ticket details visibility by role | Pages → Ticket details | Role checkboxes | Fully implemented in the demo |

## Knowledge Base

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Enable knowledge base | Navigation / Pages | Toggle | Fully implemented in the demo |
| Featured categories | Pages → Knowledge Base | Multi-select | Partially represented (visual only) |
| Allow anonymous article browsing | Roles | Toggle | Documented only |
| Article feedback/rating | Pages → Knowledge Base | Toggle | Documented only |
| Show related articles on tickets | Widgets → Ticket details | Toggle | Partially represented (visual only) |

## Dashboards & Reporting

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Enable dashboards page | Navigation / Pages | Toggle | Fully implemented in the demo |
| Default dashboard view | Pages → Dashboards | Dropdown | Partially represented (visual only) |
| Time range presets | Pages → Dashboards | Dropdown | Partially represented (visual only) |
| Drill-down permissions | Roles | Toggle | Documented only |
| External BI embed URL | Pages → Dashboards | Text input | Documented only |

## Notifications & Messaging

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Banner announcements | General → Portal basics | Textarea | Partially represented (visual only) |
| Email notifications on ticket updates | General → Notifications | Toggle | Documented only |
| In-app alerts | General → Notifications | Toggle | Documented only |
| Chat / live support | General → Notifications | Toggle | Documented only |

## Localization & Time

| Setting | Admin location | Control type | Coverage |
| --- | --- | --- | --- |
| Language selection | General → Localization | Dropdown | Documented only |
| Date/time format | General → Localization | Dropdown | Documented only |
| Time zone | General → Localization | Dropdown | Documented only |

---

### Notes for implementers

- All new controls should reuse the existing admin console styling (cards, checkboxes, pill labels).
- Behaviour-affecting settings should tie back into the shared layout/navigation model so the portal reflects changes without backend dependencies.
- "Documented only" items serve as placeholders for future work to keep parity with the Halo guide.
