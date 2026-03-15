---
name: pokemon-card-catalog-react-vite
description: >
  Build and deploy a React + JavaScript (Vite) card gallery website
  to GitHub Pages. Use this skill when recreating this project or building a
  similar card-gallery UI with filter functionality, stat bars, and sprite images.
---

## 1. Project Overview

A Pokémon card gallery that displays hard-coded Pokémon as styled cards with HP/Attack stat bars, type-based colour theming, a 5-second battle loading screen, and a global + per-card sprite reveal/hide toggle. Users can filter cards by Pokémon type and click each card image individually to reveal or hide it.



### Repository Structure

```
pokemon-card-catalog/
├── index.html               # HTML shell — loads Google Font, mounts #root
├── vite.config.js           # Vite config — sets base for GitHub Pages
├── package.json             # Scripts: dev, build, deploy (gh-pages), lint
├── eslint.config.js         # ESLint flat config
├── public/
│   └── favicon.svg          # Tab icon
├── src/
│   ├── main.jsx             # React entry point — renders <App /> into #root
│   ├── index.css            # Global reset (box-sizing, body margin, font)
│   ├── App.jsx              # All components + all state — single source of truth
│   ├── App.css              # All styles — CSS custom properties + BEM-ish classes
│   └── assets/
│       ├── pokemon-logo.png          # Header + loading screen logo
│       ├── pokemon-ball.png          # Ball-closed image (hidden state)
│       ├── pokemon-ball-open.png     # Ball-open image (revealed state toggle icon)
│       └── loading-screen-battle.gif # Animated GIF shown during 5 s loading screen
```

---

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Language | JavaScript (JSX) — no TypeScript |
| Font | [Share Tech](https://fonts.google.com/specimen/Share+Tech) via Google Fonts (`<link>` in `index.html`) |
| Styling | Plain CSS file (`App.css`) with CSS custom properties — no CSS modules, no Tailwind |
| Sprites | PokéAPI raw sprite URLs (external, no download needed) |
| Deployment | `gh-pages` npm package → GitHub Pages |

---

## 3. Setup & Installation

### Scaffold from zero

```bash
npm create vite@latest pokemon-card-catalog -- --template react
cd pokemon-card-catalog
npm install
```

### Install the deploy dependency

```bash
npm install --save-dev gh-pages
```

### Add the deploy script to `package.json`

```json
"scripts": {
  "dev":     "vite",
  "build":   "vite build",
  "deploy":  "vite build && gh-pages -d dist",
  "lint":    "eslint .",
  "preview": "vite preview"
}
```

### Set the `base` in `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: 'pokemon-card-catalog',   // ← repo name, NO leading slash
  plugins: [react()],
})
```

> **Gotcha:** `base` must match the GitHub repository name exactly. Using a leading slash (`/pokemon-card-catalog/`) also works; omitting the field entirely causes all assets to 404 on GitHub Pages.

---

## 4. Key Data & Constants

### `pokemons` array (paste verbatim into `App.jsx`)

```js
const pokemons = [
  { id: 1,   name: "Bulbasaur",  type: "Grass",    hp: 45,  attack: 49  },
  { id: 4,   name: "Charmander", type: "Fire",     hp: 39,  attack: 52  },
  { id: 7,   name: "Squirtle",   type: "Water",    hp: 44,  attack: 48  },
  { id: 25,  name: "Pikachu",    type: "Electric", hp: 35,  attack: 55  },
  { id: 6,   name: "Charizard",  type: "Fire",     hp: 78,  attack: 84  },
  { id: 9,   name: "Blastoise",  type: "Water",    hp: 79,  attack: 83  },
  { id: 3,   name: "Venusaur",   type: "Grass",    hp: 80,  attack: 82  },
  { id: 150, name: "Mewtwo",     type: "Psychic",  hp: 106, attack: 110 },
  { id: 39,  name: "Jigglypuff", type: "Normal",   hp: 115, attack: 45  },
  { id: 143, name: "Snorlax",    type: "Normal",   hp: 160, attack: 110 },
  { id: 94,  name: "Gengar",     type: "Ghost",    hp: 60,  attack: 65  },
  { id: 131, name: "Lapras",     type: "Water",    hp: 130, attack: 85  },
  { id: 133, name: "Eevee",      type: "Normal",   hp: 55,  attack: 55  },
  { id: 149, name: "Dragonite",  type: "Dragon",   hp: 91,  attack: 134 },
  { id: 59,  name: "Arcanine",   type: "Fire",     hp: 90,  attack: 110 },
  { id: 65,  name: "Alakazam",   type: "Psychic",  hp: 55,  attack: 50  },
  { id: 68,  name: "Machamp",    type: "Fighting", hp: 90,  attack: 130 },
  { id: 76,  name: "Golem",      type: "Rock",     hp: 80,  attack: 120 },
  { id: 130, name: "Gyarados",   type: "Water",    hp: 95,  attack: 125 },
  { id: 148, name: "Dragonair",  type: "Dragon",   hp: 61,  attack: 84  },
]
```

### Type colour map

There is no `TYPE_COLORS` JS object. Colours live entirely in CSS custom properties in `App.css`:

```css
:root {
  --c-grass:    #78c850;
  --c-fire:     #f08030;
  --c-water:    #6890f0;
  --c-electric: #d8c813;
  --c-psychic:  #f85888;
  --c-normal:   #a8a878;
  --c-ghost:    #705898;
  --c-dragon:   #7038f8;
  --c-fighting: #c03028;
  --c-rock:     #b8a038;
}
```

They are consumed by selector patterns like `.type-fire .card-header { background: var(--c-fire); }`.

### Derived constants

```js
const MAX_HP     = Math.max(...pokemons.map(p => p.hp))     // 160 (Snorlax)
const MAX_ATTACK = Math.max(...pokemons.map(p => p.attack)) // 134 (Dragonite)
```

Computed once at module level (outside any component) so they never re-compute on render.

### Filter row constants

```js
const FILTER_ROW1 = ['Show All', 'Grass', 'Fire', 'Water', 'Electric', 'Psychic']
const FILTER_ROW2 = ['Normal', 'Ghost', 'Dragon', 'Fighting', 'Rock']
```

---

## 5. Component Architecture

### `StatBar`

| | |
|---|---|
| **Props** | `label` (string), `value` (number), `max` (number) |
| **Renders** | A label + numeric value row above a track div with a filled inner div |
| **State** | None |

### `PokemonCard`

| | |
|---|---|
| **Props** | `pokemon` (object), `revealed` (bool — global state), `flipped` (bool — is this card individually toggled), `onImageClick` (function) |
| **Renders** | Coloured header band, circular sprite/ball image, two `<StatBar>` components |
| **State** | None — fully controlled by parent |

Effective visibility: `const showSprite = flipped ? !revealed : revealed`
Clicking `.card-image-circle` calls `onImageClick` to toggle this card's ID in `flippedIds`.

### `LoadingScreen`

| | |
|---|---|
| **Props** | None |
| **Renders** | Centered Pokémon logo + battle GIF inside a card frame |
| **State** | None |

### `App`

| | |
|---|---|
| **Props** | None (root component) |
| **State** | `loading` (bool), `filter` (string), `revealed` (bool), `flippedIds` (Set\<number\>) |
| **Renders** | `<LoadingScreen />` for first 5 s, then sticky header + filter nav + card grid |

### Filter bar (inline in `App`)

Rendered directly inside `App`'s return. Two rows (`FILTER_ROW1`, `FILTER_ROW2`) mapped over. Each button sets `filter` state. Active button gets `.active` class.

---

## 6. Core Logic Patterns

### Type filter with `useState`

```js
const [filter, setFilter] = useState('Show All')

const visiblePokemons = pokemons.filter(p =>
  filter === 'Show All' ? true : p.type === filter
)
```

`visiblePokemons` is recomputed on every render — no `useMemo` needed for 20 items.

### Rendering the card grid with `.map()`

```jsx
<main className="card-grid">
  {visiblePokemons.map(pokemon => (
    <PokemonCard key={pokemon.id} pokemon={pokemon} ... />
  ))}
</main>
```

`key` uses `pokemon.id` (unique PokéDex number). A composite `${id}-${name}` key is not needed here because IDs are already unique.

### Stat bar width calculation

```js
const pct = Math.round((value / max) * 100)
// applied as:
<div className="stat-fill" style={{ width: `${pct}%` }} />
```

`max` is passed as a prop (`MAX_HP` or `MAX_ATTACK`) so bars are always relative to the highest value in the dataset.

### Hover effects

Hover is handled entirely in CSS — no `onMouseEnter`/`onMouseLeave` in this project:

```css
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.18);
}

.ball-toggle:hover {
  transform: scale(1.12) rotate(20deg);
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));
}
```

### PokéAPI sprite URL

```js
const spriteUrl =
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
```

This URL works for any valid PokéDex ID. No API key required. Images are hosted on GitHub's raw CDN.

### Per-card individual toggle (XOR pattern)

```js
// In App — tracks which card IDs are individually flipped from the global state
const [flippedIds, setFlippedIds] = useState(new Set())

// In PokemonCard — resolves effective visibility
const showSprite = flipped ? !revealed : revealed

// onImageClick handler passed to each card
onImageClick={() => setFlippedIds(prev => {
  const next = new Set(prev)
  next.has(pokemon.id) ? next.delete(pokemon.id) : next.add(pokemon.id)
  return next
})}

// Global ball click resets all individual flips
onClick={() => { setRevealed(r => !r); setFlippedIds(new Set()) }}
```

---

## 7. Styling Approach

### Per-type accent colours

The card's root element gets a class like `type-fire`, `type-water`, etc., derived from the Pokémon's type string:

```jsx
<div className={`card type-${pokemon.type.toLowerCase()}`}>
```

Descendant selectors then apply the correct CSS variable to header background, image circle background, and stat bar fill — all from one class on the root:

```css
.type-fire .card-header        { background: var(--c-fire); }
.type-fire .card-image-circle  { background: #fff0e0; }
.type-fire .stat-fill          { background: var(--c-fire); }
```

### Card layout

```css
.card {
  display: flex;
  flex-direction: column;   /* header → image → stats stack vertically */
  overflow: hidden;
  border-radius: 18px;
}
```

Circular image frame:

```css
.card-image-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;          /* clips the sprite to the circle */
}
```

### Responsive grid

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}
```

`auto-fill` + `minmax` handles all screen sizes with no media queries.

### Sticky header

```css
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(237, 234, 181, 0.75);
  backdrop-filter: blur(10px);
}
```

---

## 8. GitHub Pages Deployment

### Steps taken

1. Set `base` in `vite.config.js` to the repo name (no leading slash):
   ```js
   base: 'pokemon-card-catalog'
   ```

2. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deploy script to `package.json`:
   ```json
   "deploy": "vite build && gh-pages -d dist"
   ```

4. Run deploy:
   ```bash
   npm run deploy
   ```
   This builds to `dist/` and pushes the contents to the `gh-pages` branch of the remote.

5. In the GitHub repository settings → Pages → set source to `gh-pages` branch, root `/`.

### Final live URL

```
https://jonkingseestheworld.github.io/pokemon-card-catalog/
```

No GitHub Actions workflow — deployment is fully manual via `npm run deploy`.

---

## 9. Gotchas & Decisions

- **CSS-only type colours, not a JS map.** Colour logic lives entirely in `App.css` via CSS custom properties and descendant selectors. A JS `TYPE_COLORS` object was not needed because no colour value is computed at runtime.

- **`base` in vite.config.js has no leading slash.** The value `'pokemon-card-catalog'` (not `'/pokemon-card-catalog/'`) was used. Both forms work; omitting `base` entirely causes asset 404s on GitHub Pages because Vite defaults to `/`.

- **Sprites are fetched from PokéAPI's GitHub CDN.** No local sprite files are needed. The URL pattern `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` is stable and free. No CORS issues arise because the browser fetches `<img src>` directly, not via `fetch()`.

- **`image-rendering: pixelated`** is applied to sprite images to preserve the retro pixel-art look when the 96×96 source image is scaled up.

- **`key` prop uses `pokemon.id` only.** Each Pokémon has a unique PokéDex ID in the data array, so a composite key is unnecessary.

- **All components live in a single `App.jsx` file.** For a 20-card catalog this avoids import overhead without sacrificing readability.

- **Loading screen is a hardcoded 5-second `setTimeout`.** There is no real async data fetch — the timer just simulates the experience.

- **`flippedIds` uses a `Set`, not an array.** `Set.has()` is O(1) and `new Set(prev)` creates a shallow copy that triggers React re-render correctly without mutation.

---

## 10. How to Recreate This Project

1. `npm create vite@latest pokemon-card-catalog -- --template react`
2. `cd pokemon-card-catalog`
3. `npm install`
4. `npm install --save-dev gh-pages`
5. Add `"deploy": "vite build && gh-pages -d dist"` to `scripts` in `package.json`.
6. Add `base: 'pokemon-card-catalog'` to `vite.config.js`.
7. Add Google Fonts `<link>` tags for **Share Tech** to `index.html` (inside `<head>`).
8. Update `<title>` in `index.html` to `Pokémon Card Catalog`.
9. Delete the boilerplate contents of `src/App.jsx` and `src/App.css`.
10. Add asset files to `src/assets/`: `pokemon-logo.png`, `pokemon-ball.png`, `pokemon-ball-open.png`, `loading-screen-battle.gif`.
11. Replace `src/index.css` with the global reset (box-sizing, body margin, font).
12. Write `App.css` — paste CSS custom properties, global reset, all component class styles (see Section 7).
13. Write `App.jsx` — paste `pokemons` array, filter constants, `MAX_HP`/`MAX_ATTACK`, then define `StatBar`, `PokemonCard`, `LoadingScreen`, and `App` components (see Sections 4–6).
14. Run `npm run dev` and verify at `http://localhost:5173`.
15. Create a GitHub repository named exactly `pokemon-card-catalog`.
16. `git init && git remote add origin https://github.com/<username>/pokemon-card-catalog.git`
17. `git add . && git commit -m "Initial commit"`
18. `git push -u origin main`
19. `npm run deploy` — this builds and pushes to the `gh-pages` branch.
20. In GitHub → Settings → Pages → set source to `gh-pages` branch → Save.
21. Wait ~60 seconds, then visit `https://<username>.github.io/pokemon-card-catalog/`.