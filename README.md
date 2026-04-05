## Finance Dashboard UI

A simple, responsive finance dashboard built with React + Vite + TypeScript, Tailwind CSS, Zustand, and Chart.js. Uses mock data and localStorage for persistence. No backend required.

### Features
- Summary cards: Total Balance, Income, Expenses
- Charts: Time-based balance trend (line) and categorical spending breakdown (doughnut)
- Transactions table: search, filter (type/category), sort (date/amount), empty states
- Role-based UI: Viewer (read-only) vs Admin (add/edit/delete). Switch via dropdown
- Insights: Highest spending category, monthly expense comparison
- Responsive design, dark mode toggle, localStorage persistence

### Getting Started
1. Install
   - `npm install`
2. Run
   - `npm run dev`
3. Build
   - `npm run build` and `npm run preview`

### Project Structure
- `src/state/store.ts`: App state (transactions, filters, role) via Zustand, with localStorage persistence
- `src/components/Dashboard.tsx`: Summary cards and charts
- `src/components/Transactions.tsx`: Table with search/filter/sort and admin actions
- `src/components/Insights.tsx`: Simple insights
- `src/components/RoleSwitcher.tsx`: Role toggle

### Assumptions
- Transactions amounts are positive; sign is determined by `type` (income/expense)
- Mock seed data is provided; users can edit/add via Admin role
- No backend; data persists locally in browser via localStorage

### Notes
- Styling is Tailwind-first with a few small utility classes
- Charts use `react-chartjs-2` and `chart.js`
- State and filters are intentionally simple for clarity

