# Project Instructions: Chemo Tracker PWA

## Tech Stack

- **Framework:** Svelte 5 (using Runes: `$state`, `$derived`, `$effect`)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Fully Responsive, Mobile-First Design)
- **Package Manager:** Yarn

## Core Business Logic & Rules

1. **Cycle Tracking:** The cycle lasts exactly 28 days (1 to 28).
2. **Cycle Phases:** Calculate the phase dynamically based on the current day:
   - **Phase 1:** Days 1–4
   - **Phase 2:** Days 5–10
   - **Phase 3:** Days 11–17
   - **Phase 4:** Days 18–28
3. **Daily Tracking Features:**
   - **Water Intake:** Track the amount of water drunk each day (in ml or cups).
   - **Bowel Movement:** A simple toggle/log to record days with bowel movements.
   - **Hospital Appointments:** A list/calendar view to manage hospital appointments.
4. **Data Persistence:** Store all user data locally using `localStorage` (No external backend required).

## UI/UX Guidelines

- **Style:** Simple, clean, minimalist, and elegant. Use a calming and professional color palette (e.g., soft slates, muted greens, or gentle blues). Avoid bright neon colors.
- **Responsiveness:** Fully responsive and optimized primarily for mobile devices (Mobile-First), as it will be used as a PWA, but must look polished on desktop.

## Clean Code & Architecture Best Practices

- **Single Responsibility Principle (SRP):** Keep components small and focused. Separate business logic, state management, and local storage persistence from the UI presentation layer where possible (e.g., use custom state modules or helper functions).
- **Don't Repeat Yourself (DRY):** Abstract repetitive logic, UI patterns, or Tailwind utility classes into reusable Svelte components or TypeScript utility functions.
- **Meaningful Names:** Use clear, intention-revealing, and pronounceable names for variables, functions, components, and types (e.g., `isBowelMovementRecorded` instead of `bmToggle`).
- **Keep it Simple (KISS):** Write simple, readable code over clever or overly complex solutions. Avoid deeply nested conditionals; use guard clauses where applicable.

## Internationalisation (I18N)

- The project must support multiple languages via an I18N solution (e.g., `svelte-i18n` or a custom lightweight store).
- All user-facing strings must be externalised into locale files — no hardcoded Italian or English text in components.
- Italian (`it`) is the default locale. English (`en`) must be supported as a second locale at minimum.
- Locale files must be placed in `src/lib/locales/` (e.g., `it.json`, `en.json`).
- The active locale must be persisted in `localStorage` so the user's choice survives a page reload.

## Developer & AI Agent Guidelines

- When writing components, strictly use the new **Svelte 5 Runes syntax** (`$state`, `$derived`, etc.).
- Always use **Yarn** for managing packages or running scripts (e.g., `yarn dev`, `yarn add`). Do not use npm or pnpm.
- Ensure all TypeScript interfaces for the tracking data (Log, Appointment, Day) are strictly typed and placed in dedicated type definition files.
