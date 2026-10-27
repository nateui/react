import { useSyncExternalStore } from 'react'

const touchPrimaryQuery = '(pointer: coarse) and (hover: none)'

const getSnapshot = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(touchPrimaryQuery).matches

const getServerSnapshot = () => false

const subscribe = (onStoreChange: () => void) => {
    if (
        typeof window === 'undefined' ||
        typeof window.matchMedia !== 'function'
    ) {
        return () => {}
    }

    const mediaQuery = window.matchMedia(touchPrimaryQuery)
    const handleChange = () => onStoreChange()

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
    } else {
        mediaQuery.addListener(handleChange)
    }

    return () => {
        if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', handleChange)
        } else {
            mediaQuery.removeListener(handleChange)
        }
    }
}

const useTouchPrimary = () =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export default useTouchPrimary
