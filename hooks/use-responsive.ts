import { useEffect, useState } from 'react'

const twBreakpoint: Record<'2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs', string> = {
    '2xl': '1536',
    xl: '1280',
    lg: '1024',
    md: '768',
    sm: '640',
    xs: '576',
}

const breakpointInt = (str = '') => {
    return parseInt(str.replace('px', ''))
}

const breakpoint = {
    '2xl': breakpointInt(twBreakpoint['2xl']), // 1536
    xl: breakpointInt(twBreakpoint.xl), // 1280
    lg: breakpointInt(twBreakpoint.lg), // 1024
    md: breakpointInt(twBreakpoint.md), // 768
    sm: breakpointInt(twBreakpoint.sm), // 640
    xs: breakpointInt(twBreakpoint.xs), // 576
}

type Breakpoint = keyof typeof breakpoint
type ResponsiveSizes = Record<Breakpoint, boolean>

type ResponsiveState = {
    windowWidth: number
    larger: ResponsiveSizes
    smaller: ResponsiveSizes
}

const initialSizes: ResponsiveSizes = {
    '2xl': false,
    xl: false,
    lg: false,
    md: false,
    sm: false,
    xs: false,
}

const initialResponsiveState: ResponsiveState = {
    windowWidth: 0,
    larger: initialSizes,
    smaller: initialSizes,
}

const getAllSizes = (
    currentWindowWidth: number,
    comparator: 'larger' | 'smaller',
) =>
    Object.fromEntries(
        Object.entries(breakpoint).map(([key, value]) => [
            key,
            comparator === 'larger'
                ? currentWindowWidth > value
                : currentWindowWidth < value,
        ]),
    ) as ResponsiveSizes

const getResponsiveState = (): ResponsiveState => {
    if (typeof window === 'undefined') {
        return initialResponsiveState
    }

    const currentWindowWidth = window.innerWidth

    return {
        windowWidth: currentWindowWidth,
        larger: getAllSizes(currentWindowWidth, 'larger'),
        smaller: getAllSizes(currentWindowWidth, 'smaller'),
    }
}

const useResponsive = () => {
    const [responsive, setResponsive] = useState(initialResponsiveState)

    useEffect(() => {
        const resizeHandler = () => {
            setResponsive(getResponsiveState())
        }

        resizeHandler()
        window.addEventListener('resize', resizeHandler)

        return () => window.removeEventListener('resize', resizeHandler)
    }, [])

    return responsive
}

export default useResponsive
