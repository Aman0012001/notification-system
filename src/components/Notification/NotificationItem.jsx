import { useCallback, useEffect, useRef, useState } from 'react'
import './notification.css'

const ICONS = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  ),
}

const TYPE_LABELS = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
}

function NotificationItem({ notification, onDismiss, dismissAllSignal }) {
  const { id, type, message, duration, persistent } = notification

  // Three-phase animation: 'entering' → 'visible' → 'exiting'
  const [animState, setAnimState] = useState('entering')

  // Refs hold timer IDs so we can cancel them without adding them to effect deps
  const animFrameRef = useRef(null)
  const exitTimerRef = useRef(null)
  const autoDismissTimerRef = useRef(null)
  // isDismissing flag prevents double-firing when auto-dismiss and manual dismiss race
  const isDismissingRef = useRef(false)

  // Keep a stable ref to onDismiss so the auto-dismiss effect runs only once on mount
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  // Kick off enter animation on the next paint so the CSS transition fires correctly
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(() => setAnimState('visible'))
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      clearTimeout(exitTimerRef.current)
      clearTimeout(autoDismissTimerRef.current)
    }
  }, []) // intentionally empty — runs once on mount

  // Shared exit sequence: set exit CSS state, then call onDismiss after animation completes
  const triggerExit = useCallback(() => {
    if (isDismissingRef.current) return
    isDismissingRef.current = true
    clearTimeout(autoDismissTimerRef.current)
    setAnimState('exiting')
    exitTimerRef.current = setTimeout(() => onDismissRef.current(id), 320)
  }, [id])

  // Auto-dismiss timer — triggerExit is stable for the lifetime of this item
  // (memoised on [id], and id never changes), so this effect runs exactly once.
  useEffect(() => {
    if (persistent || !duration) return
    autoDismissTimerRef.current = setTimeout(triggerExit, duration)
    return () => clearTimeout(autoDismissTimerRef.current)
  }, [triggerExit, duration, persistent])

  // Respond to dismissAll signal: when the signal increments, trigger exit animation.
  // Each item animates out independently rather than being hard-removed from state.
  const dismissAllSignalRef = useRef(dismissAllSignal)
  useEffect(() => {
    if (dismissAllSignal !== dismissAllSignalRef.current) {
      dismissAllSignalRef.current = dismissAllSignal
      triggerExit()
    }
  }, [dismissAllSignal, triggerExit])

  return (
    // role="alert" already implies aria-live="assertive" and aria-atomic="true" —
    // keeping just role="alert" avoids redundant attributes.
    <div
      role="alert"
      className={`notification notification--${type} notification--${animState}`}
    >
      <span className={`notification__icon-wrap notification__icon-wrap--${type}`} aria-hidden="true">
        {ICONS[type]}
      </span>

      <div className="notification__body">
        <div className="notification__header">
          <span className="notification__label">{TYPE_LABELS[type]}</span>
          {persistent && <span className="notification__persistent-badge">Persistent</span>}
        </div>
        <p className="notification__message">{message}</p>
      </div>

      <button
        type="button"
        className="notification__close"
        onClick={triggerExit}
        aria-label={`Dismiss ${TYPE_LABELS[type]} notification`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true">
          <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
        </svg>
      </button>
    </div>
  )
}

export default NotificationItem
