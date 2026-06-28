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

## Accessibility (A11Y) — WCAG 2.2 Level AAA

The app must conform to **WCAG 2.2 Level AAA** throughout. Key requirements:

- **Semantic HTML:** Use correct landmark elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`) and heading hierarchy (`h1` → `h2` → `h3`).
- **Keyboard navigation:** Every interactive element must be reachable and operable via keyboard alone. Focus order must be logical and visible.
- **Focus indicators:** Never suppress the default focus ring. Use `focus-visible` with sufficient contrast (at least 3:1 against adjacent colors).
- **Colour contrast:** Minimum 7:1 contrast ratio for normal text and 4.5:1 for large text (AAA thresholds). Do not convey information by colour alone.
- **ARIA labels:** Every icon-only button must have an `aria-label`. Use `aria-live="polite"` for dynamic content updates (e.g., water total, alerts).
- **Form inputs:** Every `<input>` must have an associated `<label>` (or `aria-label`). Use `aria-required`, `aria-invalid`, and `aria-describedby` where applicable.
- **Toggle controls:** Toggles (e.g., bowel movement) must use `role="switch"` with `aria-checked`.
- **Images and icons:** Decorative icons use `aria-hidden="true"`. Meaningful icons include descriptive `alt` or `aria-label`.
- **Motion:** Wrap animations/transitions in `@media (prefers-reduced-motion: reduce)` and disable or reduce them accordingly.
- **Target size:** Interactive targets must be at least 44×44 px (AAA requirement).
- **Language:** The `<html lang="...">` attribute must reflect the active locale at all times.
- **Error identification:** Form validation errors must be described in text (not only by colour or icon), associated with the relevant field via `aria-describedby`.

## Developer & AI Agent Guidelines

- When writing components, strictly use the new **Svelte 5 Runes syntax** (`$state`, `$derived`, etc.).
- Always use **Yarn** for managing packages or running scripts (e.g., `yarn dev`, `yarn add`). Do not use npm or pnpm.
- Ensure all TypeScript interfaces for the tracking data (Log, Appointment, Day) are strictly typed and placed in dedicated type definition files.
