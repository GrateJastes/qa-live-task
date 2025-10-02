# Live-coding QA task (Cypress + Playwright)

Quick start
1. Clone or unzip the repo.
2. `npm install`
3. `npm run dev` (Vite serves the app at http://localhost:5173)

## Option A: Cypress
- In another terminal run `npm run cy:open` (or `npx cypress open`).
- Edit `cypress/e2e/spec.cy.js` and re-run tests in the Cypress GUI.

## Option B: Playwright
- First time only: install browsers with `npx playwright install` (or `npm run test:pw` will prompt you).
- Run tests headless: `npm run test:pw`
- Run tests with UI: `npm run test:pw:ui`
- Debug a single test: `npm run test:pw:debug`
- Optional codegen to explore selectors: `npm run pw:codegen`

Playwright will auto-start the dev server using the config `playwright.config.ts`.
Playwright tests are located in `./playwright/`.
