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
