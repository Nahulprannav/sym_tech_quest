# Project Cipher

Responsive static site for the five-stage Tech Quest treasure hunt. No build step or framework required. GitHub Pages can serve the repository root directly.

## Publish with GitHub Pages

1. Put these files in the root of a GitHub repository. The included GitHub Actions workflow publishes on a push to `main` or `master`.
2. In repository **Settings → Pages**, set the source to **GitHub Actions** if it is not already selected.
3. Open `https://<username>.github.io/<repository>/organizer.html` after the first workflow finishes.
4. Paste the full site base URL, including `/<repository>` for a project site, then generate and print the five station QR codes.
5. Use `https://<username>.github.io/<repository>/` for Mission Control.

The QR generator uses QRCode.js from cdnjs; the organizer page needs an internet connection to generate codes. The five participant stations themselves do not use external services.

## Answer sheet (organizers only)

| Team | Key 01 | Key 02 | Key 03 | Key 04 | Final phrase |
|---|---|---|---|---|---|
| Alpha | AX7-K9 | A2-FOX | ARC-41 | NOVA-8 | TECHQUEST_CHAMPIONS |
| Beta | BT4-M2 | B7-OWL | BYTE-26 | ORBIT-3 | THE_ULTIMATE_GEEKS |
| Gamma | GM9-P5 | G3-HEX | GRID-58 | PULSE-6 | MASTERS_OF_CODE |
| Delta | DL2-R8 | D8-CPU | DATA-73 | FLUX-1 | CYBER_NINJAS |
| Epsilon | EP6-W3 | E5-ION | NODE-19 | QUARK-4 | KINGS_OF_IT |

Station 04 solution: `CIPHER` (decode `FLVKHU` by shifting every letter backward by three).

## Event-design notes

- Room 02 asks teams to use a browser developer console. Many mobile browsers do not provide one; use a coordinator device/lab computer or permit a shared team laptop there.
- Browser-only keys and validation are a puzzle mechanic, not robust anti-cheat. Use a backend with team-specific tokens if secrecy and auditability matter.
- The site records no team, result, or finish time. Coordinators should record completion manually, or add a server-backed event log before the event.

## Enable the shared Google Sheets completion table

1. Create a Google Sheet for the event. Copy the ID from its address: the text between `/d/` and `/edit`.
2. Open **Extensions → Apps Script** in that Sheet. Replace the editor contents with [`google-apps-script/Code.gs`](google-apps-script/Code.gs), replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with the Sheet ID, and save.
3. Select **Deploy → New deployment → Web app**. Set **Execute as** to your account and **Who has access** to **Anyone**, deploy, and approve the requested Google authorization. Copy the URL ending in `/exec`.
4. Give organizers access to the Sheet itself. Keep the Sheet private; participants only need the write-only Apps Script URL.
5. Open the live `organizer.html`, enter the public site base URL and the `/exec` URL, then regenerate and print the five QR codes. The codes carry the logging URL, so use the newly generated codes at the event.

The `Completions` tab is created automatically. It shows one row per team name and station, with completion time, assigned team, score out of three, station key, and final phrase. Repeated submissions update that event row instead of creating duplicates. The fifth station checkpoint and final mission completion appear as separate rows. The static site uses a no-cors POST, so participants do not see submission confirmation; organizers should confirm entries in the Sheet.

The Apps Script endpoint is publicly reachable so phones can submit without signing in. It only accepts writes and does not return Sheet contents; the Sheet stays private to people you share it with. Anyone with the endpoint could submit bogus rows, so use screenshots and coordinator checks as the event authority. This is suitable for an event activity log, not a secure competition audit system.

Google setup references: [Deploy a web app](https://developers.google.com/apps-script/guides/web) · [SpreadsheetApp](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app) · [Apps Script authorization](https://developers.google.com/apps-script/guides/services/authorization).
