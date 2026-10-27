'use client'

import { createContext, useContext } from 'react'
import type {
    ConfigClassNames,
    ConfigComponentDefaults,
    TypeAttributes,
} from './types'

export const SIZES = {
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
} as const

export type SIZES = (typeof SIZES)[keyof typeof SIZES]

export const CONTROL_SIZES: Record<
    SIZES,
    { h: string; w: string; minH: string; minW: string }
> = {
    [SIZES.SM]: {
        h: 'h-control-sm',
        w: 'w-control-sm',
        minH: 'min-h-control-sm',
        minW: 'min-w-control-sm',
    },
    [SIZES.MD]: {
        h: 'h-control-md',
        w: 'w-control-md',
        minH: 'min-h-control-md',
        minW: 'min-w-control-md',
    },
    [SIZES.LG]: {
        h: 'h-control-lg',
        w: 'w-control-lg',
        minH: 'min-h-control-lg',
        minW: 'min-w-control-lg',
    },
}

export type Config = {
    mode: 'light' | 'dark'
    locale: string
    direction: TypeAttributes.Direction
    classNames?: ConfigClassNames
    componentDefaults?: ConfigComponentDefaults
}

export const defaultConfig: Config = {
    direction: 'ltr',
    mode: 'light',
    locale: 'en',
    classNames: {},
    componentDefaults: {},
} as const

export const ConfigContext = createContext<Config>(defaultConfig)

const ConfigProvider = ConfigContext.Provider

export const ConfigConsumer = ConfigContext.Consumer

export function useConfig() {
    return useContext(ConfigContext)
}

export default ConfigProvider
