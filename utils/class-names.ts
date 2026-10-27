import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const controlSizes = ['control-sm', 'control-md', 'control-lg']

const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            rounded: [
                {
                    rounded: [
                        'control',
                        'control-sm',
                        'card',
                        'popover',
                        'overlay',
                        'tag',
                        'badge',
                    ],
                },
            ],
            shadow: [
                {
                    shadow: [
                        'card',
                        'control',
                        'popover',
                        'dialog',
                        'drawer',
                        'focus',
                        'inset-active',
                    ],
                },
            ],
            z: [
                {
                    z: [
                        'dropdown',
                        'sticky',
                        'popover',
                        'overlay',
                        'modal',
                        'toast',
                        'tooltip',
                    ],
                },
            ],
            h: [{ h: controlSizes }],
            'min-h': [{ 'min-h': controlSizes }],
            w: [{ w: controlSizes }],
            'min-w': [{ 'min-w': controlSizes }],
        },
    },
})

export default function classNames(...args: ClassValue[]) {
    return twMerge(clsx(...args))
}
