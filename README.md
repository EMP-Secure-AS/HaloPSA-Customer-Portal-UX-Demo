# HaloPSA Customer Portal – UX Demo

This repository is a **frontend-only UX / configuration concept** for a next‑generation
HaloPSA Self Service Portal.

It is intended as:
- A **UI/UX demo** (hostable on GitHub Pages)
- A **playground for Codex** to implement a modular page & widget system
- A **proposal** that HaloPSA (or any MSP) could realistically implement

> ⚠️ This is **not** an official HaloPSA project.  
> It is a personal concept / prototype.

## High‑level goals

- Modern, modular **customer portal UI**
- Real **page & widget editor**, not a fixed layout
- Proper **portal settings console** (branding, navigation, pages, widgets, roles)
- Support for **custom widgets & integrations** (e.g. DNS manager, backup jobs)
- Light/dark themes and per‑client branding
- Role‑aware views (end user vs local IT vs enterprise IT)

## Structure

At first upload, the repo is intentionally very light on code. Most of the work
will be done by **Codex**, following the instructions in:

- `docs/codex-plan.md` – master plan & task list
- `docs/codex-progress.md` – running log of what has been implemented

Folders:

- `docs/` – design notes and Codex instructions
- `portal/` – public customer portal demo (homepage, tickets, KB, etc.)
- `admin/` – portal admin console demo (settings, page builder, widget library)
- `widgets/` – widget registry + example custom widget stubs
- `assets/` – shared CSS, JS, and images (used by both portal and admin)

You can open the raw HTML files locally or host on GitHub Pages as a static site.

## For humans

If you are a human developer or product person:

- Start with `docs/vision.md` for the conceptual overview.
- Then read `docs/codex-plan.md` to see how the implementation is broken into phases.
- You can ignore Codex‑specific instructions if you are not using it.

## For Codex

If you are Codex (or any other AI coding assistant):

- **Always read `docs/codex-plan.md` and `docs/codex-progress.md` first.**
- Do **not** try to implement everything in one session.
- Follow the phases and tasks one by one.
- After each task or group of tasks is completed, update `docs/codex-progress.md`
  so future sessions know what is already done.

This repo is meant to be grown iteratively, not in one giant commit.
