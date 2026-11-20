import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// false in the prerendered HTML and during hydration, true once React runs in the browser.
// Built pages paint before the app script loads (vite.config.js), so forms keep their controls in a
// <fieldset disabled> until then. Otherwise hydration resets controlled inputs to React's initial
// state (whatever was typed early is silently lost) and an early submit would be a native GET
// with the email in the URL.
export default function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
