# Bounce Me

A web app demo for the BOLT case competition (Bolt x Bounce / 2026).
Built collaboratively by Coco and Nahian.

## Overview

Bounce - the social way to pay. https://bouncepay.ca
This demo showcases the core features we proposed in the case study.

### Problem Reframe

Money friction is emotional.
But payment tools only appear after the awkwardness. Bounce should appear before.
Our Solution
Move Bounce from "split tool' to "event + payment"
Expanding the mental surface area of the payment moment.

> Before:
> Open -> send -> close

- low emotional depth
- no memory
- no habit
- no identity

> Now:
> planning -> commitment -> participation -> payment -> shared memory -> recognition

now Bounce lives across the whole social arc

### Why Strong?

- network effect logic
  - events require multiple people
  - high density campus adoption
- habit formation (weekly)
  - taco tuesdays
  - study sundays
  - rent cycles
  - club gatherings
- soften the shitty speed concern

### The System

The demo replicates Bounce's original app layout (6-tab nav, visual style) and layers our proposed features on top:

| Feature (New) | Where it lives | Route |
|---|---|---|
| Event Creation | Groups tab → "+ New" | `/create` |
| Lightweight RSVP (Swipe) | Event detail page | `/event/:id` |
| Event Group | Groups tab (replaces plain groups) | `/groups` |
| Social + Progress + Badges | Profile tab (new section) | `/profile` |
| Seamless Post-Event Split | Event detail → "Start Split" | `/split/:id` |

Original Bounce screens preserved:
- Home (greeting, friends row, Request/Send triangles)
- Transactions (in-progress / completed payments)
- Accounts (Bounce Pay, linked banks)
- Profile (settings list, sign out)

Badges:
- "The Reliable One"
- "The Organizer"
- "The Social Connector"
- "The Budget Boss"
- "The Spontaneous Friend"

## Tech Stack

- Frontend: React 19 + Vite 7
- Styling: TailwindCSS v4 (custom `bounce` color theme)
- Routing: React Router v7
- State: Local component state + mock data (no backend yet)

## Project Structure

```
src/
├── data/mock.js          # Mock users, events, badges, transactions, notifications
├── components/
│   └── Avatar.jsx        # Reusable initials avatar (matches Bounce style)
├── pages/
│   ├── Home.jsx          # Greeting, friends row, Request/Send, upcoming events
│   ├── Transactions.jsx  # Payment history (in-progress / completed)
│   ├── Groups.jsx        # Event groups list with balance tracking
│   ├── Accounts.jsx      # Bounce Pay + linked bank accounts
│   ├── Notifications.jsx # Event, badge, and split alerts
│   ├── Profile.jsx       # Avatar, earned badges, all badges, settings
│   ├── CreateEvent.jsx   # Event creation form with friend invites
│   ├── EventDetail.jsx   # Event info, RSVP button, member list, split action
│   └── Split.jsx         # Bill splitting with per-person calc
├── App.jsx               # 6-tab bottom nav + routing shell
├── main.jsx              # Entry point
└── index.css             # Tailwind + Bounce brand colors
```

## Getting Started

```bash
git clone https://github.com/<your-username>/bounce-demo.git
cd bounce-demo
npm install
npm run dev
```

## Next Steps

- [ ] Wire up state management (Context or Zustand) so created events persist
- [ ] Add real swipe gesture for RSVP (touch events or library)
- [ ] Add transition animations between pages
- [ ] Integrate Bounce's actual brand assets (logo, exact color palette)
- [ ] Add Interac e-Transfer / payment mock flow
