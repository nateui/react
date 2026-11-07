import { useEffect, useRef, useState } from 'react'
import { clamp } from './clamp'

export interface UseMovePosition {
    x: number
    y: number
}

export function clampUseMovePosition(position: UseMovePosition) {
    return {
        x: clamp(position.x, 0, 1),
        y: clamp(position.y, 0, 1),
    }
}

interface useMoveHandlers {
    onScrubStart?: () => void
    onScrubStop?: () => void
    onScrubEnd?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useMove<T extends HTMLElement = any>(
    onChange: (value: UseMovePosition) => void,
    handlers?: useMoveHandlers,
    dir: 'ltr' | 'rtl' = 'ltr',
    edgePadding = 0,
) {
    const ref = useRef<T>(null)
    const mounted = useRef<boolean>(false)
    const isSliding = useRef(false)
    const frame = useRef<number | null>(null)
    const pendingPosition = useRef<UseMovePosition | null>(null)
    const endTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const onChangeRef = useRef(onChange)
    const handlersRef = useRef(handlers)
    const [active, setActive] = useState(false)

    onChangeRef.current = onChange
    handlersRef.current = handlers

    useEffect(() => {
        mounted.current = true

        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        const node = ref.current

        const clearEndTimer = () => {
            if (endTimer.current !== null) {
                clearTimeout(endTimer.current)
                endTimer.current = null
            }
        }

        const applyPosition = (position: UseMovePosition) => {
            if (!mounted.current || !node) {
                return
            }

            node.style.userSelect = 'none'
            const rect = node.getBoundingClientRect()

            if (rect.width && rect.height) {
                const width = Math.max(rect.width - edgePadding * 2, 1)
                const _x = clamp(
                    (position.x - rect.left - edgePadding) / width,
                    0,
                    1,
                )
                onChangeRef.current({
                    x: dir === 'ltr' ? _x : 1 - _x,
                    y: clamp(
                        (position.y - rect.top) / rect.height,
                        0,
                        1,
                    ),
                })
            }
        }

        const flushPendingPosition = () => {
            const latestPosition = pendingPosition.current
            pendingPosition.current = null

            if (frame.current !== null) {
                cancelAnimationFrame(frame.current)
                frame.current = null
            }

            if (latestPosition) {
                applyPosition(latestPosition)
            }
        }

        const onScrub = (position: UseMovePosition) => {
            pendingPosition.current = position

            if (frame.current !== null) {
                return
            }

            const frameId = requestAnimationFrame(() => {
                if (frame.current !== frameId) {
                    return
                }

                frame.current = null
                const latestPosition = pendingPosition.current
                pendingPosition.current = null

                if (!latestPosition) {
                    return
                }

                applyPosition(latestPosition)
            })
            frame.current = frameId
        }

        const bindEvents = () => {
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', stopScrubbing)
            document.addEventListener('touchmove', onTouchMove)
            document.addEventListener('touchend', stopScrubbing)
        }

        const unbindEvents = () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', stopScrubbing)
            document.removeEventListener('touchmove', onTouchMove)
            document.removeEventListener('touchend', stopScrubbing)
        }

        const startScrubbing = () => {
            if (!isSliding.current && mounted.current) {
                isSliding.current = true
                if (typeof handlersRef.current?.onScrubStart === 'function') {
                    handlersRef.current.onScrubStart()
                }
                setActive(true)
                bindEvents()
            }
        }

        const stopScrubbing = () => {
            if (isSliding.current && mounted.current) {
                flushPendingPosition()
                isSliding.current = false
                if (typeof handlersRef.current?.onScrubStop === 'function') {
                    handlersRef.current.onScrubStop()
                }
                setActive(false)
                unbindEvents()
                clearEndTimer()
                endTimer.current = setTimeout(() => {
                    endTimer.current = null
                    if (!mounted.current) {
                        return
                    }
                    if (typeof handlersRef.current?.onScrubEnd === 'function') {
                        handlersRef.current.onScrubEnd()
                    }
                }, 0)
            }
        }

        const onMouseDown = (event: MouseEvent) => {
            startScrubbing()
            event.preventDefault()
            onMouseMove(event)
        }

        const onMouseMove = (event: MouseEvent) =>
            onScrub({ x: event.clientX, y: event.clientY })

        const onTouchStart = (event: TouchEvent) => {
            if (event.cancelable) {
                event.preventDefault()
            }

            startScrubbing()
            onTouchMove(event)
        }

        const onTouchMove = (event: TouchEvent) => {
            if (event.cancelable) {
                event.preventDefault()
            }

            onScrub({
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY,
            })
        }

        node?.addEventListener('mousedown', onMouseDown)
        node?.addEventListener('touchstart', onTouchStart, { passive: false })

        return () => {
            if (isSliding.current) {
                isSliding.current = false
                unbindEvents()
            }
            if (frame.current !== null) {
                cancelAnimationFrame(frame.current)
                frame.current = null
            }
            pendingPosition.current = null
            clearEndTimer()
            if (node) {
                node.removeEventListener('mousedown', onMouseDown)
                node.removeEventListener('touchstart', onTouchStart)
            }
        }
    }, [dir, edgePadding])

    return { ref, active }
}

export default useMove
