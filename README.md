# Netflix Clone - Fullstack TypeScript Application

**A Netflix-inspired streaming platform** built with React, TypeScript, Bun, and Express. Designed for scalability and a seamless user experience, this application showcases modern fullstack development practices.

---

## 🚀 **Key Features**

### **Frontend Highlights**
🎬 **Immersive Video Experience**
- Auto-playing trailers as dynamic backgrounds with graceful fallback to posters
- Responsive design optimized for both desktop and mobile
- Smooth transitions and loading states

🔍 **Intelligent Search & Discovery**
- Real-time movie filtering with debounced search
- Attractive media cards with hover effects and key metadata

🎭 **Detailed Media Pages**
- Comprehensive movie/TV show details (ratings, release dates, overviews)
- Clean, Netflix-style UI with gradient overlays

🔒 **Secure Authentication**
- JWT-based login/logout flow
- Protected routes with `PrivateRoute` components

### **Backend Highlights**
⚡ **Bun-Powered API**
- Ultra-fast runtime performance
- SQLite database for user management

🛡️ **Robust Error Handling**
- Sentry integration for error tracking
- Custom error boundaries and fallback UIs

---

## 🛠️ **Tech Stack**

**Frontend**
- React 19 (with hooks)
- TypeScript
- React Router v7
- TanStack Query v5 (React Query)
- Tailwind CSS
- Material UI

**Backend**
- Bun runtime
- Express
- SQLite
- TMDB API integration

**Tooling**
- Vite
- ESLint
- Prettier

---

## ⚙️ **Setup & Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/netflix-clone.git
   cd netflix-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Run the application**
   ```bash
   bun run dev  # Starts both frontend and backend
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5001`

---

## 📌 **Why This Stands Out**

✅ **TypeScript Everywhere** – Full type safety across frontend and backend
✅ **Optimized Performance** – Bun backend + Vite frontend for blazing-fast dev experience
✅ **Production-Grade UI** – Polished Netflix-like interface with smooth animations
✅ **Interview-Ready** – Demonstrates modern React patterns, state management, and API design

---

**Perfect for interviews** – This project demonstrates:
✔ Clean architecture
✔ TypeScript best practices
✔ Responsive UI design
✔ Secure authentication
✔ Efficient data fetching
✔ Error handling & monitoring

🚀 **Deployable & Scalable** – Ready to extend with user profiles, watchlists, and more!
