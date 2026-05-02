# PRD: theprawngame

## Overview
A web-based social card game ("The Prawn Game") inspired by WNRS (We're Not Really Strangers). Players flip through a shuffled deck of question cards across six categories designed to deepen connections. Features two themes, keyboard navigation, and category filtering. Deployed to Vercel.

## Goals
- Provide a digital card deck with 6 configurable categories
- Shuffle and present one card at a time with flip animation
- Allow forward/backward navigation through the deck
- Support two visual themes (classic light, midnight dark)
- Keyboard shortcuts for navigation

## Non-Goals
- Multiplayer networking or rooms
- Score tracking
- User accounts or card saving
- Custom question entry by users
- Mobile app (web only)

## User Stories
- As a group of friends, we want to play a card game that prompts meaningful conversation.
- As a player, I want to navigate back if I accidentally skipped a card.
- As a user who prefers dark mode, I want a midnight theme.
- As a player at a desk, I want to use keyboard arrows to flip through cards.

## Tech Stack
- **Language**: TypeScript / React
- **Build**: Vite
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS v4 with custom WNRS brand colors
- **Deployment**: Vercel

## Architecture
```
theprawngame/
├── App.tsx              # Main app — state, views, game logic
├── index.tsx            # React entry point
├── index.css            # Tailwind + theme vars
├── constants.ts         # QUESTIONS array (all card content)
├── types.ts             # TypeScript types (Question, ViewState, Theme, etc.)
└── components/
    ├── Button.tsx        # Reusable button with icon/full-width variants
    └── GameCard.tsx      # Flip card with AnimatePresence animation
```

**State (in App.tsx):**
- `view: 'splash' | 'game'` — current screen
- `theme: 'classic' | 'midnight'` — visual theme
- `cardSets: CardSetOption[]` — toggle array for 6 categories
- `deck: Question[]` — remaining cards (shuffled stack)
- `history: Question[]` — played cards (for back navigation)
- `currentCard: Question | null` — card being shown
- `isFlipped: boolean` — card flip state

## Features (detailed)

### Card Categories
| ID | Name | Description |
|---|---|---|
| `Wildcard` | Wildcards | Action prompts & dares |
| `Reflection` | Reflection | Self-discovery questions |
| `Perception` | Perception | How others see you |
| `Connection` | Connection | Relationship & bonding |
| `Family` | Family | Family-related questions |
| `Self-Love` | Self-Love | Self-care & compassion |

Each enabled category populates the deck; disabled categories are excluded. Changing category toggles while in game reinitializes the deck.

### Game Flow
1. **Splash view**: toggle card sets on/off, click "Start Game"
2. `initializeDeck()`: filter QUESTIONS by enabled categories, Fisher-Yates shuffle, pop first card
3. **Game view**: show `GameCard` with current card; click to flip
4. Next (→): push current to history, pop from deck
5. Prev (←): pop from history, push current back to deck
6. Deck empty: `currentCard = null` → deck finished state

### Card Flip Animation
- Framer Motion `AnimatePresence` with `mode="wait"`
- `isFlipped` toggles between question face and answer/detail face

### Keyboard Navigation
- `ArrowRight` → next card
- `ArrowLeft` → previous card
- `Space` / `Enter` → flip card
- Only active in game view

### Themes
- `classic`: white/off-white bg (`#F5F5F5`), `text-wnrs-red` (`#C31C23`) for title
- `midnight`: dark bg (`#0a0a0a`), white text
- Toggle via Moon/Sun icon top-right; applied via `.dark` class on `documentElement`

## Data / Config
| File | Description |
|------|-------------|
| `constants.ts` | `QUESTIONS: Question[]` — all card content with category |
| `types.ts` | `Question {id, text, category}`, `CardSetOption {id, name, description, enabled}` |

## Deployment / Run
```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
```
Deployed on Vercel (auto-deploy from main branch).

## Constraints & Notes
- **Content**: all questions hardcoded in `constants.ts` — no database or CMS
- **No persistence**: deck state is reset on page reload; no save/resume
- **Category toggle during game**: rebuilds deck from scratch (loses progress)
- **Tailwind v4**: uses `@theme` CSS vars for brand colors; `@custom-variant dark` for class-based dark mode
