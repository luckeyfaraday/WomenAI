# Reddit Repurposing: WomenAI Tech Overhaul

## Draft for r/SaaS
**Title:** How we solved the Web-to-Mobile "Auth Gap" for our AI Health SaaS

**Body:**
A lot of AI startups struggle when moving from a browser tab to a native mobile app. We hit a major wall with Google OAuth and cookie-based sessions failing in our Android APK.

**The Fix:**
- **Hybrid Auth:** We implemented a system that uses HttpOnly cookies for web and JWT/Token Exchange for mobile.
- **Deep Link Tokens:** Built a custom redirect URI handler to capture the auth token from the browser and pass it back to the app securely. 
- **Mobile-First UX:** Swapped the traditional sidebar for a strict bottom-tab nav to improve the "one-handed" experience.

We’re using a Node.js/Express backend with Neon DB and Vercel for the frontend. 

Curious to hear how other founders are handling hybrid auth without forcing users to re-login every time they switch devices.

---

## Draft for r/reactjs
**Title:** Showcasing a Mobile-First Refactor: Sidebar vs. Bottom Tabs in React

**Body:**
Working on an AI health companion (WomenAI) and realized our responsive sidebar was killing the mobile experience.

**The Refactor:**
- **Navigation:** Implemented a `BottomNav` component that handles all primary routes on mobile, while retaining a hidden sidebar for desktop users.
- **State Management:** Merged our Chat History and Cycle Tracking context to reduce re-renders and simplify the data flow.
- **Aesthetic:** Shifted to a Soft Coral theme to differentiate from the typical "Blue/White" tech vibe.

**The Tech:** React 18, Vite, React Router, and Framer Motion for the tab transitions.

Check out the full architecture breakdown here: [Link to Blog/Website]
