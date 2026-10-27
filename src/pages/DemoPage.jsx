import { useNotification } from '../hooks/useNotification.js'
import './DemoPage.css'

const DEMO_BUTTONS = [
  {
    id: 'btn-success',
    label: 'Show Success',
    description: 'Triggers a success notification',
    variant: 'success',
    action: (n) => n.showSuccess('Changes saved successfully.'),
  },
  {
    id: 'btn-error',
    label: 'Show Error',
    description: 'Triggers an error notification',
    variant: 'error',
    action: (n) => n.showError('Something went wrong. Please try again.'),
  },
  {
    id: 'btn-warning',
    label: 'Show Warning',
    description: 'Triggers a warning notification',
    variant: 'warning',
    action: (n) => n.showWarning('Your session will expire in 5 minutes.'),
  },
  {
    id: 'btn-multiple',
    label: 'Trigger Multiple',
    description: 'Fires 4 notifications in rapid succession',
    variant: 'default',
    action: (n) => {
      n.showSuccess('File uploaded successfully.')
      setTimeout(() => n.showError('Authentication token expired.'), 120)
      setTimeout(() => n.showWarning('Disk usage is above 80%.'), 240)
      setTimeout(() => n.showSuccess('Background sync completed.'), 360)
    },
  },
  {
    id: 'btn-custom-duration',
    label: 'Custom Duration (10s)',
    description: 'Stays visible for 10 seconds instead of the default 4s',
    variant: 'default',
    action: (n) =>
      n.showSuccess('This notification lasts 10 seconds.', { duration: 10000 }),
  },
  {
    id: 'btn-persistent',
    label: 'Show Persistent',
    description: 'Stays until you manually dismiss it — no auto-dismiss',
    variant: 'warning',
    action: (n) =>
      n.showWarning('Action required: review the pending changes before proceeding.', {
        persistent: true,
      }),
  },
  {
    id: 'btn-long-message',
    label: 'Long Message',
    description: 'Tests layout with a very long notification message',
    variant: 'error',
    action: (n) =>
      n.showError(
        'An unexpected error occurred while processing your request. The server responded with status 503 Service Unavailable. Please check your network connection and retry. If the problem persists, contact support with reference ID: ERR-20241027-0042.',
      ),
  },
  {
    id: 'btn-dismiss-all',
    label: 'Dismiss All',
    description: 'Removes all active notifications at once',
    variant: 'ghost',
    action: (n) => n.dismissAll(),
  },
]

const LEGEND_ITEMS = [
  {
    term: 'Default duration',
    def: '4 seconds — all standard notifications auto-dismiss after 4s.',
  },
  {
    term: 'Custom duration',
    def: 'Pass duration: <ms> in the options object (e.g. 10000 for 10s).',
  },
  {
    term: 'Persistent',
    def: 'Pass persistent: true — the notification stays until manually dismissed.',
  },
  {
    term: 'Manual dismissal',
    def: 'Click the × button on any notification to remove it independently.',
  },
]

function DemoPage() {
  const notification = useNotification()

  return (
    <div className="demo">
      <header className="demo__header">
        <div className="demo__header-inner">
          <div className="demo__badge">Technical Assessment</div>
          <h1 className="demo__title">Notification System</h1>
          <p className="demo__subtitle">
            A reusable, accessible toast notification system built with React Context, custom hooks,
            and zero external dependencies.
          </p>
        </div>
      </header>

      <main className="demo__main">
        {/* ── Controls ── */}
        <section className="demo__section" aria-labelledby="controls-heading">
          <h2 className="demo__section-title" id="controls-heading">
            Trigger Notifications
          </h2>
          <p className="demo__section-desc">
            Each button calls the notification API via the{' '}
            <code className="demo__code">useNotification()</code> hook. No notification logic
            lives in this component.
          </p>

          <div className="demo__grid">
            {DEMO_BUTTONS.map(({ id, label, description, variant, action }) => (
              <button
                key={id}
                id={id}
                type="button"
                className={`demo__btn demo__btn--${variant}`}
                onClick={() => action(notification)}
                title={description}
              >
                <span className="demo__btn-label">{label}</span>
                <span className="demo__btn-desc">{description}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Architecture callout ── */}
        <section className="demo__section" aria-labelledby="arch-heading">
          <h2 className="demo__section-title" id="arch-heading">
            API Reference
          </h2>

          <div className="demo__code-block">
            <pre>{`// 1. Wrap your app
<NotificationProvider>
  <App />
</NotificationProvider>

// 2. Call from any component
const {
  showSuccess,
  showError,
  showWarning,
  dismissNotification,
  dismissAll,
} = useNotification()

// 3. Examples
showSuccess('Saved successfully.')
showError('Upload failed.', { duration: 6000 })
showWarning('Requires attention', { persistent: true })
dismissNotification(id)
dismissAll()`}</pre>
          </div>
        </section>

        {/* ── Behaviour legend ── */}
        <section className="demo__section" aria-labelledby="legend-heading">
          <h2 className="demo__section-title" id="legend-heading">
            Behaviour Reference
          </h2>

          <dl className="demo__legend">
            {LEGEND_ITEMS.map(({ term, def }) => (
              <div key={term} className="demo__legend-item">
                <dt className="demo__legend-term">{term}</dt>
                <dd className="demo__legend-def">{def}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Feature checklist ── */}
        <section className="demo__section" aria-labelledby="features-heading">
          <h2 className="demo__section-title" id="features-heading">
            Implementation Highlights
          </h2>

          <ul className="demo__checklist" role="list">
            {[
              'React Context + useReducer for global state — no prop drilling',
              'Custom useNotification() hook — any component can trigger toasts',
              'Portal-based rendering — z-index immune to parent overflow/transforms',
              'Per-notification auto-dismiss timers with proper cleanup on unmount',
              'requestAnimationFrame-triggered enter animation — no flash',
              'Three-phase animation state machine: entering → visible → exiting',
              'Persistent mode — no timer, manual dismiss only',
              'Unique IDs via timestamp + monotonic counter',
              'ARIA live regions, semantic HTML, keyboard-accessible close buttons',
              'Non-color type differentiation: icon + label + accent bar',
              'Responsive — adapts to full viewport width on mobile',
            ].map((item) => (
              <li key={item} className="demo__checklist-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="16"
                  height="16"
                  aria-hidden="true"
                  className="demo__check-icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="demo__footer">
        <p>React Notification System · Built with React 18 + Vite · Zero external dependencies</p>
      </footer>
    </div>
  )
}

export default DemoPage
