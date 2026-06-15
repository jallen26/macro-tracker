# Macro Tracker

A simple, no-build macro tracking website. Set your daily calorie/protein/carb/fat targets, log foods, and track progress with live progress bars. Data is saved in your browser via `localStorage`, so it persists between visits on the same device/browser.

## Files
- `index.html` — page structure
- `style.css` — styling
- `script.js` — logic and storage

## Run it locally
Just open `index.html` in any browser. No build step, no dependencies.

## Put it on GitHub (and host it free with GitHub Pages)

1. Create a new repository on GitHub (e.g. `macro-tracker`).
2. Upload these three files (`index.html`, `style.css`, `script.js`) to the repo — either drag-and-drop them on the GitHub web UI ("Add file" → "Upload files"), or via git:
   ```bash
   git init
   git add .
   git commit -m "Initial macro tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/macro-tracker.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
5. After a minute, your site will be live at:
   `https://YOUR_USERNAME.github.io/macro-tracker/`

## Notes
- Your daily goals and food log are stored only in your browser (localStorage) — no server, no account, no data leaves your device.
- "Reset day" clears today's logged foods (goals are kept).
- Each calendar day starts a fresh log automatically.
