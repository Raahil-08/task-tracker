---
name: Task Tracker
version: alpha
colors:
  primary: "#2563eb"
  on-primary: "#ffffff"
  secondary: "#6b7280"
  on-secondary: "#ffffff"
  tertiary: "#bc4b00"
  on-tertiary: "#ffffff"
  neutral: "#757681"
  background: "#f9fafb"
  surface: "#ffffff"
  surface-dim: "#f3f4f6"
  on-surface: "#111827"
  on-surface-variant: "#6b7280"
  outline: "#e5e7eb"
  error: "#dc2626"
  error-container: "#fee2e2"
  on-error-container: "#b91c1c"
  scrim: "rgba(0, 0, 0, 0.4)"
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
  title-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "600"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.title-md}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  card-base:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  card-hero:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  badge-high-priority:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.on-error-container}"
    rounded: "{rounded.md}"
    padding: 8px 12px
---

## Overview

The Task Tracker design system is built to provide clarity, focus, and a sense of calm productivity. It uses a modern, "utility-first" aesthetic with a card-based layout on a soft off-white background, ensuring that tasks and data are the focal point.

## Colors

The palette uses a crisp, professional set of colors to drive user attention and signify state.

- **Primary Blue (#2563eb):** Used for main actions, active navigation states, and the hero "Productivity Pulse" card.
- **Secondary Gray (#6b7280):** Used for metadata, inactive states, and secondary actions.
- **Tertiary Orange (#bc4b00):** Used for specific accent actions like editing.
- **Background & Surfaces:** A soft off-white background (`#f9fafb`) supports pure white (`#ffffff`) surface cards, creating a subtle contrast that groups information without relying on heavy lines.
- **Semantic Red:** Used for overdue tasks and high-priority indicators, utilizing a tinted container (`#fee2e2`) with dark text (`#b91c1c`) for high legibility without being overly aggressive.

## Typography

The system utilizes **Inter** for its geometric clarity and exceptional legibility on digital screens.

- **Headlines:** Bold weights (700) are used for main screen titles ("Hello, User!") and major sections.
- **Body & Metadata:** Regular weights are used for descriptions and timestamps, colored in secondary gray to establish hierarchy.
- **Labels:** Medium to Semi-bold weights are used for small badges and button text.

## Layout & Spacing

A predictable rhythm is maintained through a strictly applied spacing scale.

- **Standard Margins:** 16px (`lg`) horizontal margins frame the app content.
- **Internal Gaps:** 12px (`md`) or 16px (`lg`) gaps separate items within lists and cards.
- **Cards:** The dashboard uses a CSS grid-like structure for the productivity metrics, keeping the layout balanced and scannable.

## Elevation & Depth

Depth is achieved primarily through tonal shifts between the background and surface colors, supplemented by very light borders.

- **Surfaces:** Pure white cards sit on an off-white background.
- **Borders:** A 1px light gray (`#e5e7eb`) outline defines input fields and task list items.
- **Overlays:** A semi-transparent dark scrim isolates modals (like "Add Task"), focusing the user's attention.

## Shapes

The shape language is geometric with generous border radii to feel modern and approachable.

- **Actionable Items:** Buttons and inputs use an 8px (`md`) radius.
- **Content Containers:** Task cards use a 12px (`lg`) radius.
- **Hero Cards:** The "Productivity Pulse" card uses a larger 16px (`xl`) radius to signify its importance.
- **Icons & Badges:** Circular or pill shapes (`full`) are used for user avatars, checkboxes, and status indicators.

## Components

The design system focuses on reusable, modular components.

- **Cards:** Used extensively for dashboard metrics, grouping data clearly.
- **Badges:** The priority badges (e.g., High Priority) use soft background tints with bold, matching text colors to quickly convey status without visual noise.
- **Task List Items:** Feature a clean layout with left-aligned checkboxes, bold titles, and right-aligned action menus.
- **Bottom Navigation:** Uses a pill-shaped indicator for the active tab, highlighting the current context with the primary blue.
