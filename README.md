# KarmaCoin 🪙
### *Do Good. Earn Karma. Build Trust.*

> A decentralized, AI-powered community task platform where users post real-world challenges, volunteers complete them, and a hybrid AI + human scoring system rewards genuine effort with KarmaCoins (KC).

---

## 🌟 The Problem We're Solving

Community tasks like cleaning a park, distributing food, or helping a neighbour often go unrecognized and unrewarded. Traditional volunteer platforms rely on self-reporting with no accountability. **KarmaCoin changes that** — by introducing a trust economy where every completed task is verified by AI before a human approves it, making fraud hard and genuine effort valuable.

---

## 💡 Solution Overview

KarmaCoin is a **full-stack web application** built around a simple loop:

```
Post a Task → Volunteer Accepts → Submits Proof → AI Scores It → Owner Approves → KC Rewarded
```

### Core Pillars

| Pillar | What it does |
|---|---|
| 🧾 **Task Economy** | Anyone can post a task with a custom KC reward. Volunteers browse and accept open tasks. |
| 🤖 **AI Verification** | Groq's multimodal LLM (Llama 4 Scout) analyzes the submitted proof image + text, returning a confidence score (0–100). |
| 🤝 **Hybrid Scoring** | Final score = `AI Score × 0.4 + Human Rating × 0.4 + Trust Score × 0.2`. Combines machine intelligence with human judgment. |
| 🏆 **Trust Economy** | Every user has a Trust Score. Completing good work raises it. Higher trust unlocks higher-reward tasks and boosts your final score. |
| 👑 **Live Leaderboard** | A floating badge shows who holds the most KC in real-time — the reigning "King" of KarmaCoin. |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                 React Frontend                │
│  (Vite + React Router + Axios + Lucide)      │
│  Port: 5173                                   │
│                                               │
│  Pages: Feed · Create · My Tasks · Profile   │
│  Context: AuthContext (session + localStorage)│
└──────────────────┬──────────────────────────┘
                   │ /api/* (Vite Proxy)
                   ▼
┌─────────────────────────────────────────────┐
│            Node.js / Express Backend          │
│  Port: 5000                                   │
│                                               │
│  REST API → Controllers → Services → Models  │
│  AI Layer: Groq SDK (multimodal LLM)         │
└──────────────────┬──────────────────────────┘
                   │ Mongoose ODM
                   ▼
┌─────────────────────────────────────────────┐
│               MongoDB Atlas / Local           │
│  Collections: users · tasks · proofs         │
│               transactions                   │
└─────────────────────────────────────────────┘
```

---

## ✨ Feature Walkthrough

### 🔐 Authentication
- **Name-based login**: Enter your name → system finds or creates your account.
- No passwords. No email verification. Designed for fast onboarding.
- Session persisted in `localStorage` via `AuthContext`. Protected routes redirect unauthenticated users to `/login`.

### 📋 Task Feed (`/`)
- Live list of all `open` tasks fetched from MongoDB.
- Each card shows: title, description, reward (KC), min trust level required, and time posted.
- Click a card to go to detailed view.

### ➕ Create Task (`/create`)
- Post a new task with a title, description, KC reward, and optional minimum trust score requirement.
- Saved to MongoDB with your user ID as `owner`.

### 🔍 Task Details (`/tasks/:id`)
- Full task view with status tracking.
- **Accept** button (disabled if you own the task or it's already taken).
- **Submit Proof** form: attach an image from your device + written description.
  - Image is converted to a **Base64 Data URL** in the browser — no file uploads, no cloud storage needed.
  - Sent to the backend, which passes it directly to the Groq AI vision model.

### 🗂️ My Tasks Inbox (`/my-tasks`)
- Task creators see all their posted tasks with submissions grouped under each.
- Per proof card shows: submitter name, trust score, **AI Score bar** (colour-coded), proof text, and attached image.
- **Star rating (1–5)** + Approve / Reject buttons.
- Approval triggers the hybrid scoring formula and auto-rewards the volunteer.
- Filter by: All · Needs Review · Open · Completed.
- Amber badge on the navbar shows pending review count.

### 👤 Profile (`/profile`)
- Displays live KC balance and Trust Score fetched fresh from the database on every visit.
- Trust level progression bar: Beginner → Trusted Member → Core Contributor.
- List of all tasks you have been assigned.
- Logout button clears session.

### 👑 Live Leaderboard Badge
- Floating circular badge on the right side of every page.
- Shows the user with the highest KC balance in real-time.
- Hover to see full name, KC balance, and trust score.
- Refreshes every 30 seconds automatically.

---

## 🤖 AI Proof Verification

When a volunteer submits proof:

1. **Frontend** reads the local image file and converts it to a Base64 `data:image/...` string.
2. **Backend** receives the Base64 string (up to 10MB supported).
3. **Groq API** is called with the image data URL + the proof text + the original task description.
4. The LLM returns a **number from 0–100** representing confidence that the task was genuinely completed.
5. This `aiScore` is stored on the `Proof` document. The task owner then reviews it and gives a 1–5 star human rating.
6. **Final Score Formula:**

```
finalScore = (aiScore × 0.4) + (humanRating × 20 × 0.4) + (userTrustScore × 0.2)
```

7. If `finalScore ≥ 50` and `aiScore ≥ 20`, the reward is granted:
   - Base reward = the KC set by the task creator.
   - Bonus: +20% if final score > 80.
   - User's `trustScore` also increases by 5 points.

> ⚠️ If `GROQ_API_KEY` is not set, the server starts normally and defaults to a neutral AI score of 50 — so human approval still works.

---

## 🗄️ Database Schema

### `users`
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Unique, required |
| `email` | String | Optional |
| `coins` | Number | Default: 50 |
| `trustScore` | Number | Default: 50 |

### `tasks`
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | |
| `description` | String | |
| `owner` | ObjectId → User | Task creator |
| `assignedTo` | ObjectId → User | Volunteer |
| `reward` | Number | KC payout on approval |
| `minTrustScore` | Number | Eligibility gate |
| `status` | Enum | `open` · `in_progress` · `completed` · `cancelled` |

### `proofs`
| Field | Type | Notes |
|-------|------|-------|
| `task` | ObjectId → Task | |
| `user` | ObjectId → User | Submitter |
| `image` | String | Base64 Data URL |
| `text` | String | Written claim |
| `aiScore` | Number | 0–100 from Groq |
| `rating` | Number | 1–5 stars from owner |
| `status` | Enum | `pending` · `approved` · `rejected` |

### `transactions`
Logs every KC reward issued for history of each specific user.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MongoDB (local or Atlas)
- A [Groq API key](https://console.groq.com) *(optional — fallback score used if absent)*

### 1. Clone & Install
```bash
git clone https://github.com/kaushikbargaway/404-Limits-Not-Found.git
cd 404-Limits-Not-Found

# Backend
cd backend && npm install

# Frontend
cd ../karmachain && npm install
```

### 2. Configure Environment
Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/karmacoin
GROQ_API_KEY=your_groq_api_key_here   # optional
PORT=5000
```

### 3. Run
**Terminal 1 — Backend:**
```bash
cd backend
node server.js
# ✅ Server running on port 5000
# ✅ MongoDB Connected
```

**Terminal 2 — Frontend:**
```bash
cd karmachain
npm run dev
# ✅ http://localhost:5173
```

---

## 🛣️ API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/create` | Register new user |
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/:id` | Get user by ID |
| `GET` | `/api/users/by-name/:name` | Login lookup |
| `GET` | `/api/tasks` | List all tasks |
| `POST` | `/api/tasks/create` | Create a task |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `POST` | `/api/tasks/:id/accept` | Accept a task |
| `POST` | `/api/proofs/upload` | Submit proof (with AI scoring) |
| `POST` | `/api/proofs/verify/:id` | Owner approve/reject |
| `GET` | `/api/proofs/task/:taskId` | Proofs for a task |
| `GET` | `/api/proofs/my-tasks/:ownerId` | Owner inbox (tasks + proofs) |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Vanilla CSS + Tailwind CSS |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| AI | Groq SDK (Llama 4 Scout — multimodal) |
| Auth | Session stored in localStorage via Context API |

---

## 👥 Team

**404 — Limits Not Found**

> *We didn't find the limits. We built around them.*

---

## 📄 License

MIT License — Feel free to fork, build on top, and spread the karma. 🙏
