# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Background

Color Identifier is a web tool for identifying colors in an uploaded image. The user uploads or drops an image, clicks a spot on it, and the app shows the nearest named color from a selectable color list, plus the color's value in HEX, RGB, HSL, HSV, CMYK and OKLCH, each copyable. Everything runs in the browser; the only network calls fetch named-color lists.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`).

- `pnpm dev` — Vite dev server
- `pnpm build` — type-check (`tsc -b`) then production build to `dist/`
- `pnpm lint` — ESLint over the repo
- `pnpm preview` — serve the built `dist/`

There is no test suite or test runner configured. `pnpm build` is the type-check gate.

## Architecture

Client-only React 19 + TypeScript SPA built with Vite. The React Compiler is enabled (`babel-plugin-react-compiler` in `vite.config.ts`), so manual `useMemo`/`useCallback` is mostly unnecessary in components. Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config`; theme lives in `src/index.css`). Import alias `@/*` → `src/*`.

### Data flow

1. **Picking** — `ImageUpload` draws the uploaded/dropped image onto a `<canvas>` at native resolution. On click it maps client coordinates to canvas pixels (accounting for CSS scaling), reads the pixel via `getImageData`, converts RGB to every display format with helpers in `src/lib/helpers.ts`, and calls `setColor` with everything *except* the name.
2. **Naming** — `ColorProvider` (`src/Providers/ColorProvider.tsx`) is the single source of state. It holds the picked color (`PickedColor = Omit<Color, 'name'>`) and the active named-color list, and *derives* the `name` by running the matcher. Consumers read the fully-named `color` via `useColor()`. Changing the list re-names the current pick automatically.
3. **Color lists** — `App.tsx` fetches available list names/descriptions from `https://api.color.pizza/v1/lists`, and fetches the selected list from `https://api.color.pizza/v1/?list=<name>`, trimming each entry to `{ name, hex }`. The `'basic'` list is special-cased to the local `DEFAULT_COLORS` in `src/constants/colors.ts` (no network call).

### Nearest-color matching

`createColorMatcher` in `src/lib/helpers.ts` is an in-house replacement for a former third-party dependency. It precomputes OKLab coordinates for the whole list into a `Float32Array` once (memoized on `colorList` in the provider), then each lookup is a linear scan by squared Euclidean distance in OKLab. Keep lists as `NamedColor` (`{ name, hex }`) to keep this cheap — some API lists are large.

### Adding a color format

Formats are listed in `COLOR_FORMATS` in `ColorDetailsTable.tsx` and must match keys of the `Color` type (`src/types/colors.ts`). Adding one means: add a converter in `helpers.ts`, add the key to `Color`, populate it in `ImageUpload.handleCanvasClick`, and add it to `COLOR_FORMATS`.

### UI

`src/components/ui/` are shadcn components (new-york style, `components.json`) restyled with a neobrutalism theme: custom tokens like `bg-main`, `bg-secondary-background`, `shadow-shadow`, `rounded-base`, `border-border`, and `translate-x-boxShadowX` are defined in `src/index.css`. Use these tokens rather than stock shadcn/Tailwind colors to stay consistent. Toasts use `sonner` (`<Toaster />` is mounted in `MainLayout`).

## Style

Tabs for indentation and single quotes in app code (shadcn-generated files under `ui/` use double quotes; leave them as generated). No Prettier config exists.
