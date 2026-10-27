export declare namespace TypeAttributes {
    type Shape = 'round' | 'circle' | 'none'
    type Status = 'success' | 'warning' | 'danger' | 'info'
    type FormLayout = 'horizontal' | 'vertical' | 'inline'
    type ControlSize = 'lg' | 'md' | 'sm'
    type Direction = 'ltr' | 'rtl'
    type Placement = "top" | "right" | "bottom" | "left" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"
}

type SlotClassNames<TSlot extends string> = Partial<Record<TSlot, string>>

export type ActionBarConfigClassNames = SlotClassNames<'root' | 'content'>

export type AlertConfigClassNames = SlotClassNames<
    'root' | 'content' | 'icon' | 'title' | 'description' | 'close'
>

export type AvatarConfigClassNames = SlotClassNames<
    'root' | 'image' | 'icon' | 'fallback' | 'group' | 'overflow'
>

export type BadgeConfigClassNames = SlotClassNames<'root' | 'indicator'>

export type ButtonConfigClassNames = SlotClassNames<
    'root' | 'label' | 'icon' | 'spinner'
>

export type CloseButtonConfigClassNames = SlotClassNames<'root' | 'icon'>

export type LinkConfigClassNames = SlotClassNames<'root'>

export type BreadcrumbConfigClassNames = SlotClassNames<
    | 'root'
    | 'list'
    | 'item'
    | 'link'
    | 'page'
    | 'separator'
    | 'ellipsis'
    | 'icon'
>

export type CalendarConfigClassNames = SlotClassNames<
    | 'root'
    | 'view'
    | 'header'
    | 'headerLabel'
    | 'previousTrigger'
    | 'nextTrigger'
    | 'table'
    | 'weekday'
    | 'week'
    | 'cell'
    | 'day'
    | 'monthGrid'
    | 'monthCell'
    | 'yearGrid'
    | 'yearCell'
>

export type RangeCalendarConfigClassNames = CalendarConfigClassNames

export type CardConfigClassNames = SlotClassNames<
    'root' | 'header' | 'body' | 'footer'
>

export type CarouselConfigClassNames = SlotClassNames<
    'root' | 'viewport' | 'content' | 'item' | 'previousTrigger' | 'nextTrigger'
>

export type CheckboxConfigClassNames = SlotClassNames<
    'root' | 'wrapper' | 'control' | 'indicator' | 'content' | 'group'
>

export type CollapsibleConfigClassNames = SlotClassNames<
    'root' | 'trigger' | 'triggerLabel' | 'indicator' | 'content'
>

export type DatePickerConfigClassNames = SlotClassNames<
    'trigger' | 'clearButton' | 'panel' | 'calendar' | 'timePanel' | 'action'
>

export type DialogConfigClassNames = SlotClassNames<
    'overlay' | 'wrapper' | 'content' | 'close'
>

export type DrawerConfigClassNames = SlotClassNames<
    | 'overlay'
    | 'wrapper'
    | 'content'
    | 'header'
    | 'title'
    | 'close'
    | 'handle'
    | 'body'
    | 'footer'
>

export type DropdownConfigClassNames = SlotClassNames<
    | 'trigger'
    | 'triggerLabel'
    | 'triggerIndicator'
    | 'contentWrapper'
    | 'content'
    | 'item'
    | 'itemLabel'
    | 'itemIndicator'
    | 'label'
    | 'separator'
    | 'customItem'
    | 'subTrigger'
    | 'subContent'
    | 'subIndicator'
    | 'contextArea'
>

export type FormConfigClassNames = SlotClassNames<'root'>

export type FormScopeConfigClassNames = SlotClassNames<'root'>

export type FormFieldConfigClassNames = SlotClassNames<
    'root' | 'label' | 'asterisk' | 'control' | 'message'
>

export type InputConfigClassNames = SlotClassNames<
    'root' | 'control' | 'prefix' | 'suffix' | 'textarea'
>

export type InputGroupConfigClassNames = SlotClassNames<'root' | 'addon'>

export type MenuConfigClassNames = SlotClassNames<
    | 'root'
    | 'group'
    | 'groupLabel'
    | 'groupList'
    | 'item'
    | 'itemIndicator'
    | 'collapse'
    | 'collapseTrigger'
    | 'collapseLabel'
    | 'collapseIndicator'
    | 'collapseContent'
>

export type MenuItemConfigClassNames = SlotClassNames<'root' | 'indicator'>

export type MultiValueInputConfigClassNames = SlotClassNames<
    | 'root'
    | 'tagList'
    | 'tag'
    | 'tagLabel'
    | 'tagRemove'
    | 'overflowTrigger'
    | 'overflowContent'
    | 'input'
>

export type NotificationConfigClassNames = SlotClassNames<
    'root' | 'content' | 'icon' | 'title' | 'description' | 'close'
>

export type PaginationConfigClassNames = SlotClassNames<
    | 'root'
    | 'total'
    | 'list'
    | 'item'
    | 'ellipsis'
    | 'previousTrigger'
    | 'nextTrigger'
>

export type PopoverConfigClassNames = SlotClassNames<
    'trigger' | 'content' | 'body'
>

export type ProgressConfigClassNames = SlotClassNames<
    'root' | 'track' | 'trail' | 'indicator' | 'info'
>

export type RateConfigClassNames = SlotClassNames<
    'root' | 'item' | 'icon' | 'label'
>

export type RadioConfigClassNames = SlotClassNames<
    'root' | 'wrapper' | 'control' | 'indicator' | 'label' | 'group'
>

export type ResizableConfigClassNames = SlotClassNames<
    | 'root'
    | 'handleWrapper'
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'topRight'
    | 'bottomRight'
    | 'bottomLeft'
    | 'topLeft'
>

export type ScrollConfigClassNames = SlotClassNames<
    'root' | 'viewport' | 'content' | 'scrollbar' | 'thumb' | 'corner' | 'flexRoot'
>

export type SegmentConfigClassNames = SlotClassNames<
    'root' | 'item' | 'indicator'
>

export type SelectConfigClassNames = SlotClassNames<
    | 'root'
    | 'control'
    | 'trigger'
    | 'value'
    | 'placeholder'
    | 'indicator'
    | 'spinner'
    | 'clearButton'
    | 'menuWrapper'
    | 'menu'
    | 'menuContent'
    | 'filter'
    | 'filterInput'
    | 'group'
    | 'groupLabel'
    | 'item'
    | 'itemText'
    | 'itemIndicator'
    | 'message'
    | 'tag'
    | 'tagRemove'
    | 'multiInput'
>

export type SkeletonConfigClassNames = SlotClassNames<'root'>

export type SliderConfigClassNames = SlotClassNames<
    'root' | 'trackWrapper' | 'track' | 'range' | 'thumb' | 'tooltip' | 'mark' | 'markLabel'
>

export type SpinnerConfigClassNames = SlotClassNames<
    'root' | 'track' | 'indicator'
>

export type StepsConfigClassNames = SlotClassNames<
    | 'root'
    | 'item'
    | 'trigger'
    | 'icon'
    | 'content'
    | 'title'
    | 'description'
    | 'connector'
>

export type SwitcherConfigClassNames = SlotClassNames<
    'root' | 'control' | 'thumb' | 'spinner' | 'content'
>

export type TableConfigClassNames = SlotClassNames<
    | 'root'
    | 'overflow'
    | 'border'
    | 'head'
    | 'body'
    | 'foot'
    | 'row'
    | 'headerCell'
    | 'cell'
    | 'sorter'
    | 'sorterIcon'
>

export type TabsConfigClassNames = SlotClassNames<
    'root' | 'list' | 'trigger' | 'icon' | 'indicator' | 'content'
>

export type TagConfigClassNames = SlotClassNames<
    'root' | 'label' | 'prefix' | 'suffix'
>

export type TimeInputConfigClassNames = SlotClassNames<
    | 'root'
    | 'wrapper'
    | 'field'
    | 'separator'
    | 'period'
    | 'clearButton'
    | 'prefix'
    | 'suffix'
>

export type TimelineConfigClassNames = SlotClassNames<
    | 'root'
    | 'item'
    | 'wrapper'
    | 'media'
    | 'mediaContent'
    | 'mediaDot'
    | 'connector'
    | 'content'
>

export type TooltipConfigClassNames = SlotClassNames<
    'trigger' | 'content' | 'label'
>

export type UploadConfigClassNames = SlotClassNames<
    | 'root'
    | 'input'
    | 'trigger'
    | 'tip'
    | 'list'
    | 'item'
    | 'itemWrapper'
    | 'thumbnail'
    | 'fileIcon'
    | 'fileImage'
    | 'fileInfo'
    | 'fileName'
    | 'fileSize'
    | 'removeButton'
>

export type ConfigClassNames = Partial<{
    actionBar: ActionBarConfigClassNames
    alert: AlertConfigClassNames
    avatar: AvatarConfigClassNames
    badge: BadgeConfigClassNames
    button: ButtonConfigClassNames
    breadcrumb: BreadcrumbConfigClassNames
    calendar: CalendarConfigClassNames
    card: CardConfigClassNames
    carousel: CarouselConfigClassNames
    checkbox: CheckboxConfigClassNames
    closeButton: CloseButtonConfigClassNames
    collapsible: CollapsibleConfigClassNames
    datePicker: DatePickerConfigClassNames
    dialog: DialogConfigClassNames
    drawer: DrawerConfigClassNames
    dropdown: DropdownConfigClassNames
    form: FormConfigClassNames
    formScope: FormScopeConfigClassNames
    formField: FormFieldConfigClassNames
    input: InputConfigClassNames
    inputGroup: InputGroupConfigClassNames
    menu: MenuConfigClassNames
    menuItem: MenuItemConfigClassNames
    link: LinkConfigClassNames
    multiValueInput: MultiValueInputConfigClassNames
    notification: NotificationConfigClassNames
    pagination: PaginationConfigClassNames
    popover: PopoverConfigClassNames
    progress: ProgressConfigClassNames
    rate: RateConfigClassNames
    radio: RadioConfigClassNames
    resizable: ResizableConfigClassNames
    rangeCalendar: RangeCalendarConfigClassNames
    scroll: ScrollConfigClassNames
    segment: SegmentConfigClassNames
    select: SelectConfigClassNames
    skeleton: SkeletonConfigClassNames
    slider: SliderConfigClassNames
    spinner: SpinnerConfigClassNames
    steps: StepsConfigClassNames
    switcher: SwitcherConfigClassNames
    table: TableConfigClassNames
    tabs: TabsConfigClassNames
    tag: TagConfigClassNames
    timeInput: TimeInputConfigClassNames
    timeline: TimelineConfigClassNames
    tooltip: TooltipConfigClassNames
    upload: UploadConfigClassNames
}>

export type ConfigComponentDefaults = Partial<{
    alert: {
        variant?: 'success' | 'warning' | 'destructive' | 'info'
        showIcon?: boolean
    }
    avatar: {
        shape?: 'round' | 'circle' | 'square'
        size?: 'lg' | 'md' | 'sm' | number
    }
    avatarGroup: {
        chained?: boolean
    }
    button: {
        variant?: 'solid' | 'subtle' | 'default' | 'ghost' | 'link'
        shape?: TypeAttributes.Shape
        size?: TypeAttributes.ControlSize
        clickFeedback?: boolean
    }
    card: {
        bordered?: boolean
    },
    calendar: {
        cellHeight?: number
    }
    datePicker: {
        size?: TypeAttributes.ControlSize
    }
    form: {
        size?: TypeAttributes.ControlSize
    }
    input: {
        size?: TypeAttributes.ControlSize
    }
    inputGroup: {
        size?: TypeAttributes.ControlSize
    }
    multiValueInput: {
        size?: TypeAttributes.ControlSize
    }
    progress: {
        size?: 'sm' | 'md'
    }
    rate: {
        size?: TypeAttributes.ControlSize
    }
    segment: {
        size?: TypeAttributes.ControlSize
    }
    select: {
        size?: TypeAttributes.ControlSize
    }
    slider: {
        variant?: 'default' | 'capsule'
    }
    spinner: {
        size?: string | number
    }
    table: {
        bordered?: boolean
        compact?: boolean
        hoverable?: boolean
    }
    tabs: {
        variant?: 'underline' | 'pill'
    }
    tag: {
        size?: TypeAttributes.ControlSize
    }
    timeInput: {
        size?: TypeAttributes.ControlSize
    }
}>
