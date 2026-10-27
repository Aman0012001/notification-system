import { useContext } from 'react'
import { NotificationContext } from '../components/Notification/NotificationProvider.jsx'

/**
 * Access the global notification API from any component inside NotificationProvider.
 *
 * Usage:
 *   const { showSuccess, showError, showWarning } = useNotification()
 */
export function useNotification() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotification must be used inside a <NotificationProvider>.')
  }

  return context
}
