# Repzin

A mobile-first gym management demo built with React, TypeScript, Vite, Tailwind CSS, shadcn-style UI primitives, and Lucide icons.

## Run

- `npm install`
- `npm run dev`
- `npm run build` for the production bundle
- `npm run lint` for source checks

## Screens

- `/`: daily attendance, membership filters, member search, and quick actions
- `/members/:id`: member attendance calendar, four status filters, and payment history
- `/add`: shared action launcher
- `/gym`: metrics, published/draft packages, and team
- `/members/new`: member details, simulated biometric capture, and confirmation
- `/packages/new`: package creation with draft/published status
- `/payments/new`: member search, package selection, calculated membership dates, and payment recording

Member, package, payment, and theme changes persist in browser local storage using `repzin-` keys. Clear these keys to reset the demo. Historical attendance is illustrative; registration does not create a check-in. Biometric scanning is simulated. No API calls or authentication are implemented.

The app uses one shared route per action flow, regardless of entry point. Theme tokens in `src/index.css` cover light and dark mode. Shared Button primitives are in `src/components/ui`; `components.json` and the `@/` alias support adding further shadcn components.

Production hosting must serve `index.html` for application routes (SPA fallback).

Build and lint were checked. Visual testing was intentionally omitted.
