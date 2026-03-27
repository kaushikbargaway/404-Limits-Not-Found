# KarmaCoin: The Social Trust Protocol

## 🚀 Project Overview
**KarmaCoin** is a full-stack platform designed to incentivize social good and community contributions through a transparent, AI-verified task system. It transforms "good deeds" into a measurable "Trust Score" and rewards users with **KarmaCoins (KC)** for their contributions to society.

---

## 🛑 Problem Statement
In many communities, local volunteer work and small social tasks (like cleaning a park, helping a neighbor, or reporting a public issue) go unrecognized. 
1. **Lack of Incentives:** People are less motivated to do small good deeds without recognition.
2. **Verification Gap:** There is no easy way to prove a task was actually completed without a manual, slow review process.
3. **Trust Deficit:** It is difficult to know which community members are the most reliable and active.

---

## ✅ Solution Overview
KarmaCoin solves these issues by creating a "Proof of Good Deed" ecosystem:
*   **Proof of Work:** Users submit photos and descriptions as evidence of task completion.
*   **Hybrid Verification:** We use a unique **AI + Human** verification flow. The Groq AI (Llama 3 Vision) analyzes submitted proofs for authenticity, which is then finalized by the task creator.
*   **Gamified Trust:** Every successful task boosts a user's **Trust Score**, making the community safer and more reliable.
*   **Economy of Good:** Users earn **KarmaCoins** which can be used to post their own tasks or (in future versions) redeemed for community rewards.

---

## ✨ Key Features
*   **Live Task Feed:** Real-time browsing of available community tasks.
*   **AI Proof Analysis:** Integrated Groq AI to detect fake or inconsistent proof submissions using multimodal vision.
*   **Trust Score System:** Dynamic trust levels (Beginner → Trusted Member → Core Contributor) based on historical performance.
*   **Task Inbox:** Creators have a dedicated "My Tasks" section to review, rate (1-5 stars), and approve volunteer work.
*   **Seamless Auth:** Simplified name-based login with auto-account creation for instant onboarding.
*   **Modern Dashboard:** A premium, dark-mode/glassmorphism inspired UI for tracking coins, stats, and accepted tasks.

---

## 🛠 Tech Stack Used
### Frontend
*   **React.js** (Vite)
*   **Tailwind CSS** (Premium UI Design)
*   **Lucide React** (Iconography)
*   **Axios** (API Communication)
*   **React Router** (Navigation)

### Backend
*   **Node.js & Express**
*   **MongoDB & Mongoose** (Database)
*   **Groq SDK** (AI Multimodal Verification)
*   **dotenv** (Environment Management)

---

## 🏃 How to Run the Project

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas account or local MongoDB instance
*   Groq API Key (for AI verification)

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```
Start the server:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd karmachain
npm install
npm run dev
```

### 4. Access the App
Open `http://localhost:5173` in your browser. 
*   **Login:** Just enter a name (e.g., "Kaushik"). If it's a new name, an account is created instantly.
*   **API Proxy:** The frontend is pre-configured to proxy `/api` requests to the backend on port 5000.

---

## 🛡️ License
Distributed under the MIT License. Created for the **404: Limits Not Found** hackathon.
