import { createContext, useCallback, useMemo, useReducer, useRef, useState } from 'react'
import NotificationContainer from './NotificationContainer.jsx'

export const NotificationContext = createContext(null)

const DEFAULT_DURATION = 4000

let nextId = 1
function generateId() {
  return `notification-${Date.now()}-${nextId++}`
}

function notificationReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload]
    case 'REMOVE':
      return state.filter((n) => n.id !== action.payload)
    case 'REMOVE_ALL':
      return []
    default:
      return state
  }
}

export function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(notificationReducer, [])

  const dismissNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: id })
  }, [])

  // dismissAll signals all current items to animate out.
  // Each item's own triggerExit then removes itself after 320ms.
  // A plain counter in state ensures React re-renders and propagates the new
  // prop value to every NotificationItem so they can respond to the signal.
  const [dismissAllSignal, setDismissAllSignal] = useState(0)

  const dismissAll = useCallback(() => {
    setDismissAllSignal((prev) => prev + 1)
  }, [])

  const showNotification = useCallback(
    (type, message, options = {}) => {
      // Silently ignore empty messages to avoid meaningless toasts
      if (!message || typeof message !== 'string' || !message.trim()) return

      const { duration, persistent = false } = options
      const id = generateId()

      const notification = {
        id,
        type,
        message: message.trim(),
        // Persistent notifications never auto-dismiss; duration only applies otherwise
        duration: persistent ? null : (duration ?? DEFAULT_DURATION),
        persistent,
      }

      dispatch({ type: 'ADD', payload: notification })
      return id
    },
    [],
  )

  const showSuccess = useCallback(
    (message, options) => showNotification('success', message, options),
    [showNotification],
  )

  const showError = useCallback(
    (message, options) => showNotification('error', message, options),
    [showNotification],
  )

  const showWarning = useCallback(
    (message, options) => showNotification('warning', message, options),
    [showNotification],
  )

  // Memoize so the context object reference is stable between renders.
  // Without this, every component that calls useNotification() would re-render
  // whenever any other piece of state in the tree causes NotificationProvider to re-render.
  const contextValue = useMemo(
    () => ({
      showNotification,
      showSuccess,
      showError,
      showWarning,
      dismissNotification,
      dismissAll,
    }),
    [showNotification, showSuccess, showError, showWarning, dismissNotification, dismissAll],
  )

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
        dismissAllSignal={dismissAllSignal}
      />
    </NotificationContext.Provider>
  )
}
