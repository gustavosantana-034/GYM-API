# Pulso · Design System

Pulso is a platform for finding gyms nearby and checking in. The interface answers one question first: **what is near me, and how far is it?** Every visual decision supports that.

The source of truth is code: `src/styles/tokens.css` holds the raw tokens and `src/styles/index.css` exposes them to Tailwind. This document explains the decisions.

## Principles

1. **Distance is the protagonist.** Cards open with the distance in large type ("850 m") before the gym name. The check-in screen shows how far you are from the 100 m range.
2. **One accent, used with intent.** Volt green marks actions and progress. Cyan is reserved for location data. Nothing else competes.
3. **Borders over effects.** Surfaces are separated by 1px borders and steps of gray, with no glassmorphism, no decorative gradients and no floating shadows. The only shadows are on overlays: popups and toasts.
4. **Square-ish geometry.** Small radii (4 / 8 / 12 px) give a technical, precise feel. Pills are only for toggleable chips.
5. **Motion explains, never decorates.** Animations show cause and effect (page entry, check-in confirmation, location search) and are disabled under `prefers-reduced-motion`.

## Visual motif: distance rings

Concentric rings radiating from a point, meaning *you and what is around you*. The motif appears in:

- the logo (a point inside a ring);
- the location permission prompt and the loading states (rings pulse while searching);
- the check-in radar, where the inner ring is the real 100 m range and the user's dot sits at their real distance;
- the empty states;
- the user marker on the map.

## Color

Dark is the primary theme. The light theme uses the same token names.

| Token | Dark | Light | Use |
|---|---|---|---|
| `bg` | `#0b0e10` | `#f4f5f1` | Page background |
| `surface-1/2/3` | `#12161a` / `#1a1f24` / `#232a30` | `#fff` / `#eceee8` / `#e1e4dc` | Cards, hovers, raised elements |
| `border` / `border-strong` | `#2a3238` / `#3a444b` | `#dadfd5` / `#bcc3b6` | Dividers, outlines |
| `text` | `#eef2f3` | `#0e1215` | Primary text |
| `muted` | `#9aa4aa` | `#4f585e` | Secondary text |
| `subtle` | `#858f95` | `#626b71` | Captions, metadata |
| `primary` | `#c6f432` | `#c6f432` | Volt: buttons, selection, streak |
| `primary-ink` | `#c6f432` | `#3f6600` | Volt as text/icon (darker in light mode for contrast) |
| `on-primary` | `#0b0e10` | `#0b0e10` | Text on volt |
| `geo` | `#3dd6c6` | `#087a6f` | Location, distance, user marker |
| `success` / `warning` / `danger` | `#5be08a` / `#f5b841` / `#ff6b5e` | `#17803d` / `#9a6200` / `#c4321f` | Feedback |

Each feedback color has a `*-soft` translucent variant for backgrounds.

**Contrast.** Every text token meets WCAG AA (≥ 4.5:1) on `bg`, `surface-1` and `surface-2` in both themes. Text on volt is 15:1.

**Map.** OpenStreetMap tiles get a CSS filter (`--map-filter`) that turns them graphite in dark mode, so the map belongs to the interface without a paid basemap.

## Typography

**Archivo Variable**, self-hosted through `@fontsource-variable`. Its width axis gives two voices from one family:

- **Expanded** (`font-expanded`, `font-stretch: 125%`): display text, titles and big numbers. Athletic, energetic.
- **Normal width:** body and interface text. Highly legible at small sizes.

| Token | Size / line height | Use |
|---|---|---|
| `text-display` | 56 / 1.0, -2% tracking | Hero titles (desktop), gym name |
| `text-h1` | 36 / 1.1 | Page titles, metric values |
| `text-h2` | 24 / 1.2 | Section titles, distances on cards |
| `text-h3` | 18 / 1.3 | Card titles |
| `text-body` | 16 / 1.55 | Paragraphs, inputs |
| `text-label` | 14 / 1.3 | Buttons, labels, secondary lines |
| `text-caption` | 12 / 1.35, +2% tracking | Metadata, eyebrows (uppercase) |

Numbers that change or are compared use `tabular` (tabular figures).

## Spacing

Tailwind's 4px scale, limited in practice to **4, 8, 12, 16, 24, 32, 48, 64, 96**:

- 4–12: inside components (icon to label, chip padding);
- 16–24: card padding, gaps between list items and fields;
- 32–48: between page sections;
- 64–96: hero and auth layouts on large screens.

## Layout and breakpoints

Mobile first.

| Breakpoint | Width | Layout |
|---|---|---|
| base | 0 | Single column, top bar and bottom navigation (Início · Explorar · Check-ins · Perfil) |
| `sm` | 640 | Wider grids (4 activities per row), inline actions |
| `lg` | 1024 | Fixed sidebar, Explore splits into list + sticky map, gym page shows a sticky check-in panel |
| `xl` | 1280 | Home shows nearby gyms and progress side by side |
| `wide` | 1440 | |
| `ultra` | 1920 | Content max width grows from 72rem to 80rem |

## Components

`src/components/ui` (generic):

| Component | Notes |
|---|---|
| `Button`, `ButtonLink` | `primary` / `secondary` / `ghost` / `danger`; `sm` / `md` / `lg`; loading state with `aria-busy` |
| `Input`, `Textarea`, `Select`, `Field` | Label, hint and error wired with `aria-describedby` / `aria-invalid` |
| `Chip` | Toggle filter with `aria-pressed` |
| `SegmentedControl` | Exclusive options (`role="radiogroup"`): Lista/Mapa, theme, filters |
| `Card`, `Badge`, `Avatar` | Avatar uses initials (the API stores no photos) |
| `Modal` | Native `<dialog>`: focus trap and Esc for free |
| `SearchBar` | `role="search"`, clear button |
| `Skeleton`, `LoadingState` | Skeletons mirror the real layout of each screen |
| `EmptyState`, `ErrorState` | Always say what happened and offer a next step |
| `ToastProvider` | `aria-live` feedback for actions |
| `DistanceRings`, `Logo` | The visual motif |

Domain components: `GymCard`, `GymList`, `ModalityBadge`, `ActivityCard`, `DistanceTag` (gym/), `GymMap`, `LocationPickerMap`, `MapSkeleton` (map/), `CheckInPanel`, `CheckInRadar`, `CheckInSuccess` (check-in/), `LocationPrompt` (location/), `ProgressStats` (progress/), and `AppShell`, `Sidebar`, `TopBar`, `BottomNav` (layout/).

## Accessibility checklist

- Skip link to the main content; semantic landmarks (`header`, `nav`, `main`, `aside`, `section` with headings).
- Visible focus ring (2px volt) on every interactive element.
- Icons are `aria-hidden`; icon-only buttons have `aria-label`.
- Async results and check-in steps are announced through `aria-live`.
- The map always has a list equivalent; markers are keyboard-focusable and titled.
- Location is never requested without an explanation first, and every failure (denied, unavailable, timeout) has its own message and a way forward.
