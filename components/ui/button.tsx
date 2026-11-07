import classNames from "@/utils/class-names";
import { useConfig, SIZES, CONTROL_SIZES } from "./config-provider";
import { Spinner } from "./spinner";
import type { TypeAttributes } from "./config-provider/types";
import type {
    ReactNode,
    MouseEvent,
    ElementType,
    ComponentPropsWithoutRef,
    Ref,
} from "react";

type ButtonOwnProps<E extends ElementType = "button"> = {
    asElement?: E;
    active?: boolean;
    block?: boolean;
    className?:
        | string
        | ((state: {
              active: boolean;
              destructive: boolean;
              unclickable: boolean;
          }) => string);
    clickFeedback?: boolean;
    destructive?: boolean;
    disabled?: boolean;
    icon?: string | ReactNode;
    loading?: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    shape?: TypeAttributes.Shape;
    size?: TypeAttributes.ControlSize;
    variant?: "solid" | "subtle" | "default" | "ghost" | "link";
    iconAlignment?: "start" | "end";
    ref?: Ref<HTMLButtonElement>;
};

export type ButtonProps<E extends ElementType = "button"> = ButtonOwnProps<E> &
    Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>;

type ButtonColor = {
    bgColor: string;
    hoverColor: string;
    activeColor: string;
    textColor: string;
};

const radiusShape: Record<TypeAttributes.Shape, string> = {
    round: "rounded-control",
    circle: "rounded-full",
    none: "rounded-none",
};

const Button = <E extends ElementType = "button">(props: ButtonProps<E>) => {
    const {
        asElement: Component = "button",
        active = false,
        block = false,
        children,
        className,
        clickFeedback: clickFeedbackProp,
        destructive = false,
        disabled,
        icon,
        loading = false,
        ref,
        shape: shapeProp,
        size,
        variant: variantProp,
        iconAlignment = "start",
        ...rest
    } = props;
    const { classNames: configClassNames, componentDefaults } = useConfig();
    const shape = shapeProp ?? componentDefaults?.button?.shape ?? "round";
    const variant =
        variantProp ?? componentDefaults?.button?.variant ?? "default";
    const buttonClassNames = configClassNames?.button;
    const defaultClass =
        "button font-medium outline-none whitespace-nowrap content-center shadow-control";
    const sizeIconClass = "inline-flex items-center justify-center";

    const buttonSize = size ?? componentDefaults?.button?.size ?? "md";
    const feedback =
        clickFeedbackProp ?? componentDefaults?.button?.clickFeedback ?? true;
    const unclickable = disabled || loading;

    const getButtonSize = () => {
        let sizeClass = "";
        switch (buttonSize) {
            case SIZES.LG:
                sizeClass = classNames(
                    CONTROL_SIZES.lg.h,
                    radiusShape[shape],
                    icon && !children
                        ? `${CONTROL_SIZES.lg.w} ${sizeIconClass} text-2xl`
                        : "px-8 text-base",
                );
                break;
            case SIZES.SM:
                sizeClass = classNames(
                    CONTROL_SIZES.sm.h,
                    shape === "round"
                        ? "rounded-control-sm"
                        : radiusShape[shape],
                    icon && !children
                        ? `${CONTROL_SIZES.sm.w} ${sizeIconClass} text-base`
                        : "px-3",
                );
                break;
            default:
                sizeClass = classNames(
                    CONTROL_SIZES.md.h,
                    radiusShape[shape],
                    icon && !children
                        ? `${CONTROL_SIZES.md.w} ${sizeIconClass} text-xl`
                        : "px-4",
                );
                break;
        }
        return sizeClass;
    };

    const disabledClass = "opacity-50 cursor-not-allowed";

    const solidColor = () => {
        const btn = {
            bgColor: destructive
                ? `bg-destructive`
                : active
                  ? `bg-primary-active`
                  : `bg-primary`,
            textColor: destructive
                ? "text-destructive-foreground"
                : "text-primary-foreground",
            hoverColor: active
                ? ""
                : destructive
                  ? `hover:bg-destructive/90`
                  : `hover:bg-primary-hover`,
            activeColor: ``,
        };
        return getBtnColor(btn);
    };

    const subtleColor = () => {
        const btn = {
            bgColor: destructive
                ? `bg-destructive-soft`
                : active
                  ? `bg-secondary-active`
                  : `bg-secondary`,
            textColor: destructive ? `text-destructive` : `text-foreground`,
            hoverColor: active
                ? ""
                : destructive
                  ? `hover:bg-destructive-soft hover:text-destructive`
                  : `hover:bg-secondary-hover hover:text-foreground`,
            activeColor: ``,
        };
        return getBtnColor(btn);
    };

    const defaultColor = () => {
        const btn = {
            bgColor: destructive
                ? active
                    ? `bg-destructive-soft border border-destructive`
                    : `bg-control border border-destructive`
                : active
                  ? `bg-control-active border border-control-border`
                  : `bg-control border border-control-border`,
            textColor: destructive
                ? `text-destructive`
                : `text-control-foreground`,
            hoverColor: active
                ? ""
                : destructive
                  ? `hover:bg-destructive-soft hover:border-destructive hover:text-destructive`
                  : `hover:bg-control-hover hover:border-control-border`,
            activeColor: ``,
        };
        return getBtnColor(btn);
    };

    const linkColor = () => {
        const btn = {
            bgColor: ``,
            textColor: destructive ? `text-destructive` : `text-foreground`,
            hoverColor: active
                ? ""
                : destructive
                  ? `hover:text-destructive/80`
                  : `hover:text-primary-hover`,
            activeColor: destructive
                ? `active:text-destructive`
                : `active:text-primary-active`,
        };
        return getBtnColor(btn);
    };

    const ghostColor = () => {
        const btn = {
            bgColor: destructive
                ? active
                    ? `bg-destructive-soft`
                    : ``
                : active
                  ? `bg-muted`
                  : ``,
            textColor: destructive ? `text-destructive` : `text-foreground`,
            hoverColor: active
                ? ""
                : destructive
                  ? `hover:bg-destructive-soft hover:text-destructive`
                  : `hover:bg-muted hover:text-foreground`,
            activeColor: ``,
        };
        return getBtnColor(btn);
    };

    const getBtnColor = ({
        bgColor,
        hoverColor,
        activeColor,
        textColor,
    }: ButtonColor) => {
        return `${bgColor} ${
            unclickable ? disabledClass : hoverColor + " " + activeColor
        } ${textColor}`;
    };

    const btnColor = () => {
        switch (variant) {
            case "solid":
                return solidColor();
            case "subtle":
                return subtleColor();
            case "default":
                return defaultColor();
            case "ghost":
                return ghostColor();
            case "link":
                return linkColor();
            default:
                return defaultColor();
        }
    };

    const classes = classNames(
        defaultClass,
        "group/button",
        typeof className !== "function" ? btnColor() : "",
        getButtonSize(),
        block ? "w-full" : "",
        feedback &&
            !unclickable &&
            "button-press-feedback transition-transform active:translate-y-[1px]",
        buttonClassNames?.root,
        typeof className === "function"
            ? className?.({
                  active,
                  destructive,
                  unclickable,
              })
            : className,
    );

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { onClick } = props;
        if (unclickable) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    const renderChildren = () => {
        if (loading && children) {
            return (
                <span className="flex items-center justify-center">
                    <Spinner
                        enableTheme={false}
                        size={18}
                        className={classNames(
                            "mr-1",
                            buttonClassNames?.spinner,
                        )}
                    />
                    {buttonClassNames?.label ? (
                        <span className={buttonClassNames.label}>
                            {children}
                        </span>
                    ) : (
                        children
                    )}
                </span>
            );
        }

        if (icon && !children && loading) {
            return (
                <Spinner
                    size={18}
                    enableTheme={false}
                    className={buttonClassNames?.spinner}
                />
            );
        }

        if (icon && !children && !loading) {
            if (buttonClassNames?.icon) {
                return <span className={buttonClassNames.icon}>{icon}</span>;
            }
            return <>{icon}</>;
        }

        if (icon && children && !loading) {
            return (
                <span className="flex gap-1 items-center justify-center">
                    {iconAlignment === "start" && (
                        <span
                            className={classNames(
                                buttonSize === SIZES.SM ? "text-sm" : "text-lg",
                                buttonClassNames?.icon,
                            )}
                        >
                            {icon}
                        </span>
                    )}
                    <span className={buttonClassNames?.label}>{children}</span>
                    {iconAlignment === "end" && (
                        <span
                            className={classNames(
                                buttonSize === SIZES.SM ? "text-sm" : "text-lg",
                                buttonClassNames?.icon,
                            )}
                        >
                            {icon}
                        </span>
                    )}
                </span>
            );
        }

        return <>{children}</>;
    };

    return (
        <Component
            ref={ref}
            {...rest}
            className={classes}
            data-disabled={unclickable ? "" : undefined}
            data-destructive={destructive ? "" : undefined}
            data-loading={loading ? "" : undefined}
            data-variant={variant}
            data-state={active ? "active" : "inactive"}
            disabled={unclickable}
            onClick={handleClick}
        >
            {buttonClassNames?.label && !icon && !loading ? (
                <span className={buttonClassNames.label}>
                    {renderChildren()}
                </span>
            ) : (
                renderChildren()
            )}
        </Component>
    );
};

export default Button;

export { Button };
