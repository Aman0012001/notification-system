import { createPortal } from 'react-dom'
import NotificationItem from './NotificationItem.jsx'
import './notification.css'

// Always rendered into a portal so the container stays in the accessibility tree.
// Renders into <body> directly so z-index is never affected by parent overflow or transform CSS.
function NotificationContainer({ notifications, onDismiss, dismissAllSignal }) {
  return createPortal(
    <div
      className="notification-container"
      aria-label="Notifications"
      role="region"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          dismissAllSignal={dismissAllSignal}
        />
      ))}
    </div>,
    document.body,
  )
}

export default NotificationContainer
