<!-- Copilot instructions for AI coding agents working on NeoShiksha_Website -->
# Neo Shiksha — Copilot Instructions

Purpose: Help AI agents be immediately productive in this small static website repository.

Key facts (big picture)
- Single-page static website. Primary entrypoint: `index.html`.
- Client-side logic lives in `script.js`; site styling in `style.css`.
- Static assets (images, video, logos) are under `assets/` (e.g. `assets/hero-video.mp4`, `assets/logo.png`).
- No backend or build system in repo — forms are handled purely client-side and do not POST to a server.

What to look for first
- Open [index.html](index.html) to see the DOM structure: hero, modals (`parentModal`, `teacherModal`, `callbackModal`), forms (`#parentForm`, `#teacherForm`), and the gallery component.
- Open [script.js](script.js) to understand UI behavior: modal open/close, `zoneData` (city→zone mapping), gallery duplication for seamless scroll, and mobile nav logic (`.nav-links.active`, `body.menu-open`).
- Open [style.css](style.css) to inspect theme variables (`:root`) and reusable class names (`.btn-primary`, `.btn-secondary`, `.container`, section classes).

Important patterns and examples (project-specific)
- Modal & forms: Forms are purely client-side. See `openParentForm()`, `openTeacherForm()`, and form submit handlers in `script.js` that show/hide success screens rather than sending data.
  - Example: parent form submit hides `#parentForm` and shows `#parentSuccess` instead of making network requests.
- Zone selection pattern: `zoneData` in `script.js` maps cities to zones and populates `<select>` elements (`parentCitySelect` → `parentZoneSelect`, same for teacher). Modify `zoneData` to add regions.
- Gallery duplication: The about-section gallery uses JS to clone `.gallery-item` nodes to create a seamless vertical scroll animation — preserve this behaviour when editing gallery markup or CSS animations.
- Mobile nav: Toggling the hamburger adds `.nav-links.active`; scroll lock is implemented by adding `body.menu-open`. Tests or DOM changes should respect these classes.
- Video handling: `index.html` includes `assets/hero-video.mp4` inside `<video>`; CSS scales the video (see `.video-box video { transform: scale(...) }`) — be cautious when changing the transform or layout.

Developer workflows (how to preview, debug, and test)
- Quick preview (no build): open `index.html` in a browser or serve static files (preferred to avoid video/CORS issues):
  - PowerShell (Windows):
    ```powershell
    # if Node is available
    npx http-server -c-1 . -p 8080
    # or with Python 3
    python -m http.server 8000
    ```
  - Then open http://localhost:8080 (or :8000).
- Debugging: Use browser DevTools console to inspect runtime errors. Look for missing element IDs (script.js contains a comment "MISSING HERO BUTTONS SELECTION" — verify related elements exist in `index.html`).

Conventions and quick rules for edits
- Keep `index.html` as the single source of truth for DOM IDs referenced from `script.js` (avoid renaming `#parentModal`, `#teacherModal`, `#parentForm`, etc., without updating JS).
- Preserve CSS variables in `:root` if adding theme colors. Reuse `.btn-primary`/.`btn-secondary` for consistent CTA styling.
- When adding new content to the about/gallery section, update script duplication logic if the structure of `.gallery-item` changes.
- Avoid adding network-dependent features unless you also add a clear mock or local dev server; currently no API endpoints exist in repo.

External dependencies
- Fonts and icons are loaded via CDN in `index.html` (Google Fonts `Poppins`, Font Awesome). No package.json or Node-specific deps are present.

If you change behavior
- Update `script.js` comments and add small inline notes near changed logic (this repo uses readable, commented JS). Keep changes minimal and test in-browser.

When uncertain, ask the maintainer
- Confirm whether new features require a backend or persistence before adding network calls.
- Ask which devices/browsers to prioritize for responsive tweaks (the CSS has distinct desktop/mobile rules).

Next steps after changes
- Run a local static server and test the modals, zone selects, gallery animation, mobile nav, and all CTA buttons.

---
Please review and tell me if you want more examples, automated preview scripts, or a small `README.md` to accompany this file.
