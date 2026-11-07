import type { ResizeDirection, Size, SizeValue } from './types'

export const directions: ResizeDirection[] = [
    'top',
    'right',
    'bottom',
    'left',
    'topRight',
    'bottomRight',
    'bottomLeft',
    'topLeft',
]

export const defaultEnable = directions.reduce(
    (enabled, direction) => ({
        ...enabled,
        [direction]: true,
    }),
    {} as Record<ResizeDirection, boolean>,
)

export const defaultSize: Required<Size> = {
    width: 'auto',
    height: 'auto',
}

export function hasDirection(
    direction: ResizeDirection,
    side: 'top' | 'right' | 'bottom' | 'left',
) {
    return direction.toLowerCase().includes(side)
}

export function toCssSize(value: SizeValue | undefined) {
    if (value === undefined || value === null || value === 'auto') {
        return 'auto'
    }

    if (typeof value === 'number') {
        return `${value}px`
    }

    const trimmed = value.trim()
    return /^-?\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed
}

export function toPixelSize(
    value: SizeValue | undefined,
    parentSize: number,
    viewport: { width: number; height: number },
) {
    if (value === undefined || value === null || value === 'auto') {
        return undefined
    }

    if (typeof value === 'number') {
        return value
    }

    const numeric = Number.parseFloat(value)
    if (Number.isNaN(numeric)) {
        return undefined
    }

    if (value.endsWith('%')) {
        return parentSize * (numeric / 100)
    }

    if (value.endsWith('vw')) {
        return viewport.width * (numeric / 100)
    }

    if (value.endsWith('vh')) {
        return viewport.height * (numeric / 100)
    }

    return numeric
}

export function clamp(
    value: number,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
) {
    return Math.min(Math.max(value, min), max)
}

export function snapToGrid(value: number, size: number, gap = 0) {
    if (size <= 0) {
        return value
    }

    const step = Math.round(value / size)
    return step * size + gap * Math.max(step - 1, 0)
}

export function findClosestSnap(
    value: number,
    snapPoints: number[],
    snapGap = 0,
) {
    if (!snapPoints.length) {
        return value
    }

    const closest = snapPoints.reduce((current, point) =>
        Math.abs(point - value) < Math.abs(current - value) ? point : current,
    )
    const distance = Math.abs(closest - value)

    return snapGap === 0 || distance <= snapGap ? closest : value
}

export function normalizePair<T>(value: T | [T, T]): [T, T] {
    return Array.isArray(value) ? value : [value, value]
}

export function isAuto(value: SizeValue | undefined) {
    return value === undefined || value === 'auto'
}
