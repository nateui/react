import classNames from '@/utils/class-names'
import { useConfig } from '../config-provider/index'
import type { ReactNode, ComponentPropsWithRef } from 'react'

export interface TimeLineItemProps extends ComponentPropsWithRef<'li'> {
    isLast?: boolean
    media?: string | ReactNode
}

const TimeLineItem = (props: TimeLineItemProps) => {
    const { children, className, isLast, media, ref } = props
    const { classNames: configClassNames } = useConfig()
    const timelineClassNames = configClassNames?.timeline

    return (
        <li
            ref={ref}
            className={classNames(
                'timeline-item flex min-h-[50px]',
                isLast ? 'timeline-item-last min-h-max' : '',
                timelineClassNames?.item,
                className,
            )}
        >
            <div
                className={classNames(
                    'timeline-item-wrapper flex flex-auto',
                    timelineClassNames?.wrapper,
                )}
            >
                <div
                    className={classNames(
                        'timeline-item-media flex flex-col items-center',
                        timelineClassNames?.media,
                    )}
                >
                    <div
                        className={classNames(
                            'timeline-item-media-content my-0.5',
                            timelineClassNames?.mediaContent,
                        )}
                    >
                        {media || (
                            <div
                                className={classNames(
                                    'timeline-item-media-default rounded-full border-3 border-input h-4 w-4',
                                    timelineClassNames?.mediaDot,
                                )}
                            />
                        )}
                    </div>
                    {!isLast && (
                        <div
                            className={classNames(
                                'timeline-connect h-full w-[2px] bg-border flex-grow',
                                timelineClassNames?.connector,
                            )}
                        />
                    )}
                </div>
                <div
                    className={classNames(
                        'timeline-item-content ml-3 rtl:mr-3 pb-6 pt-0.5 w-full',
                        isLast && 'timeline-item-content-last pb-0',
                        timelineClassNames?.content,
                    )}
                >
                    {children}
                </div>
            </div>
        </li>
    )
}

export default TimeLineItem
