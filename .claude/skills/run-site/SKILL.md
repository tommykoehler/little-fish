---
name: run-site
description: Start the Little Fish splash page locally and open it. Use whenever the user asks to run, start, launch, preview, serve, or open the website/site/page.
---

# Run the Little Fish site

`npm run dev` compiles `scss/` to `css/main.css`, watches SCSS for changes, and serves the site with Browsersync on port 3000. Browsersync injects CSS changes and reloads the page when HTML, JS, or assets change. Never edit `css/main.css` by hand.

1. Check whether it's already running:
   ```sh
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/browser-sync/browser-sync-client.js
   ```
   `200` means the dev server is up: go to step 3. If port 3000 answers but that path doesn't, something else (e.g. an old `python3 -m http.server`) holds the port: stop it with `lsof -ti tcp:3000 | xargs kill`.

2. Start it with the Bash tool using `run_in_background: true` and `timeout: 7200000` (the 2-hour max; the default stops it after 30 minutes):
   ```sh
   cd /Users/tommykoehler/Documents/little-fish && npm run dev
   ```
   Repeat the curl check from step 1 until it returns `200`. If `node_modules` is missing, run `npm install` first.

3. Open it in the user's default browser:
   ```sh
   open http://localhost:3000
   ```

4. Tell the user the site is live at http://localhost:3000 and updates automatically when files are saved.

## Stopping

```sh
lsof -ti tcp:3000 | xargs kill
pkill -f "sass --watch"
pkill -f "browser-sync start"
```

## Notes
- Dev dependencies are pinned for this machine's Node 19: sass 1.77.8, concurrently 8.2.2, browser-sync 3.0.4. Newer sass/concurrently fail on Node < 20.
