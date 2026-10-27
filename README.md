# 🔔 React Notification System

A reusable, accessible toast notification system built with **React 18**, **React Context**, **useReducer**, and **zero external dependencies**.

---

## ✨ Features

- **React Context + useReducer** — global notification state with no prop drilling
- **Custom `useNotification()` hook** — trigger toasts from any component with a single import
- **Portal-based rendering** — toasts live directly on `<body>`, immune to parent `overflow`/`transform` CSS
- **Three-phase animation** — `entering → visible → exiting` state machine powered by CSS transitions + `requestAnimationFrame`
- **Per-notification auto-dismiss timers** with correct `useEffect` cleanup to prevent memory leaks
- **Persistent mode** — set `persistent: true` and the notification stays until manually dismissed (no timer at all)
- **Race-condition safe** — `isDismissingRef` flag prevents double-removal when manual dismiss and auto-dismiss fire simultaneously
- **`dismissAll()`** — signals every active item to animate out independently
- **Unique IDs** — `Date.now()` + monotonic counter guarantees collision-free IDs
- **Fully accessible** — `role="alert"`, `aria-label`, keyboard-accessible close buttons, `focus-visible` outlines
- **Responsive** — full-width layout on mobile (≤ 480 px)
- **Long messages handled** — `word-break: break-word` prevents overflow
- **Empty messages silently ignored** — no meaningless empty toasts

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   └── Notification/
│       ├── NotificationProvider.jsx   # Context + useReducer state, exposes API
│       ├── NotificationContainer.jsx  # Portal wrapper, renders list of items
│       ├── NotificationItem.jsx       # Individual toast with animation logic
│       ├── notification.css           # Toast styles + animation states
│       └── index.js                   # Public barrel export
├── hooks/
│   └── useNotification.js             # Consumer hook — safe, throws if used outside Provider
├── pages/
│   ├── DemoPage.jsx                   # Interactive demo of all notification types
│   └── DemoPage.css
├── App.jsx                            # Wraps app in NotificationProvider
├── main.jsx                           # React DOM entry point (StrictMode)
└── index.css                          # Global reset + design tokens
```

---

## 🔌 API Reference

### 1. Wrap your app

```jsx
import { NotificationProvider } from './components/Notification'

function App() {
  return (
    <NotificationProvider>
      <YourApp />
    </NotificationProvider>
  )
}
```

### 2. Use the hook anywhere inside the tree

```js
import { useNotification } from './hooks/useNotification'

const { showSuccess, showError, showWarning, dismissNotification, dismissAll } = useNotification()
```

### 3. Trigger notifications

```js
// Default (auto-dismisses after 4 seconds)
showSuccess('Changes saved successfully.')
showError('Upload failed. Please try again.')
showWarning('Your session will expire in 5 minutes.')

// Custom duration (milliseconds)
showSuccess('This stays for 10 seconds.', { duration: 10000 })

// Persistent — stays until manually dismissed
showWarning('Action required: review pending changes.', { persistent: true })

// Dismiss a specific notification by its ID
const id = showError('Something went wrong.')
dismissNotification(id)

// Dismiss all active notifications at once
dismissAll()
```

---

## 🧠 Architecture Decisions

| Decision | Rationale |
|---|---|
| `useReducer` over `useState` | Scales cleanly as actions grow; state transitions are explicit and testable |
| `useMemo` on context value | Prevents every `useNotification()` consumer re-rendering on unrelated state changes |
| `useCallback` on all API functions | Stable references — consumers never re-render just because the provider re-renders |
| `useRef` for timer IDs | Avoids stale closure problems; timer handles aren't part of render output |
| `onDismissRef` pattern | Lets the auto-dismiss timer call the latest `onDismiss` without being in its deps array |
| `isDismissingRef` guard | Prevents double-removal race between auto-dismiss and manual dismiss |
| `requestAnimationFrame` for enter animation | Ensures the initial `entering` state is painted before toggling to `visible`, making CSS transitions fire reliably |
| Portal to `document.body` | Guarantees z-index is never clipped by parent `overflow: hidden` or CSS `transform` |

---

## ♿ Accessibility

- `role="alert"` on each toast (implies `aria-live="assertive"` + `aria-atomic="true"`)
- `aria-label` on the notification container (`role="region"`)
- Descriptive `aria-label` on every close button: `"Dismiss Error notification"`
- All interactive elements are keyboard accessible with `:focus-visible` outlines
- Non-color type differentiation: icon + label text + left accent bar

---

## 🛠 Tech Stack

| Tool | Version |
|---|---|
| React | 18.3.x |
| React DOM | 18.3.x |
| Vite | 6.x |
| @vitejs/plugin-react | 4.x |

**Zero runtime dependencies beyond React itself.**

---

## 📋 Review Report

### Issues Found & Fixed

| # | Severity | Issue | Fix |
|---|---|---|---|
| 1 | 🔴 **Bug** | `dismissAll()` used `useRef` to track signal — ref mutation doesn't trigger re-render, so `dismissAllSignal` prop never updated and "Dismiss All" was a no-op | Replaced with `useState` counter so incrementing causes a re-render and propagates the new prop |
| 2 | 🟡 **Dead code** | `.demo__section-title` had `font-size` and `letter-spacing` declared twice — first values were immediately overridden | Removed the first (dead) declarations |
| 3 | 🟡 **Lint risk** | Auto-dismiss `useEffect` had intentionally empty deps but `triggerExit` was used inside — would fail `react-hooks/exhaustive-deps` in a real project | Added `triggerExit`, `duration`, `persistent` to deps array (safe: all are stable for a notification's lifetime) |

### Final Status: ✅ PASS
