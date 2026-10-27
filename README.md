<p align="center">
  <a href="https://nateui.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/assets/logo-dark.svg">
      <img src=".github/assets/logo-light.svg" alt="NateUI" width="200" height="52">
    </picture>
  </a>
</p>

<h1 align="center">NateUI React</h1>

<p align="center">React 19 · Tailwind CSS 4 · TypeScript · MIT</p>

<p align="center">
  <a href="https://nateui.com/components">Components</a> ·
  <a href="#installation">Installation</a> ·
  <a href="https://nateui.com/components/theming">Theming</a> ·
  <a href="https://nateui.com/themes">Theme Editor</a> ·
  <a href="https://nateui.com/pricing">Pro</a>
</p>

NateUI is a React UI component library built with Tailwind CSS and TypeScript. This repository contains the free component source, shared hooks and utilities, and the base theme stylesheet. Copy the source into your application, import it locally, and adapt it to your project.

Component documentation and interactive examples are available at [nateui.com/components](https://nateui.com/components). The source in this repository is licensed under [MIT](LICENSE).

## Contents

- [Overview](#overview)
- [Components](#components)
- [Installation](#installation)
- [Usage](#usage)
- [Theming and configuration](#theming-and-configuration)
- [AI tools and resources](#ai-tools-and-resources)
- [Updating your copy](#updating-your-copy)
- [Troubleshooting](#troubleshooting)
- [Repository layout](#repository-layout)
- [Free and Pro](#free-and-pro)
- [Contributing and support](#contributing-and-support)
- [License](#license)

## Overview

- **Local component source.** Components live in your project, alongside the code that uses them. Props, styles, and behavior can be changed in those files.
- **Semantic theme tokens.** Colors, surfaces, borders, radii, shadows, and control sizes are defined in [styles/base.css](styles/base.css).
- **Light and dark values.** The theme includes both palettes. Keep the document appearance and component provider mode aligned when switching between them.
- **Shared configuration.** [ConfigProvider](https://nateui.com/components/config-provider) supplies component defaults and named style-slot overrides throughout a subtree.
- **TypeScript APIs.** Component props and related types are defined in the source. Follow the component examples for compound APIs and controlled state.

## Components

Browse a component's documentation for its API and examples, or open its source here. The catalog below covers the free UI source in this repository.

### Actions

| Component | Source |
| --- | --- |
| [ActionBar](https://nateui.com/components/action-bar) | [action-bar.tsx](components/ui/action-bar.tsx) |
| [Button](https://nateui.com/components/button) | [button.tsx](components/ui/button.tsx) |
| [CloseButton](https://nateui.com/components/close-button) | [close-button.tsx](components/ui/close-button.tsx) |
| [Link](https://nateui.com/components/link) | [link.tsx](components/ui/link.tsx) |

### Forms and selection

| Component | Source |
| --- | --- |
| [Calendar](https://nateui.com/components/calendar) | [calendar/](components/ui/calendar/) |
| [Checkbox](https://nateui.com/components/checkbox) | [checkbox/](components/ui/checkbox/) |
| [DatePicker](https://nateui.com/components/date-picker) | [date-picker/](components/ui/date-picker/) |
| [Form](https://nateui.com/components/form) | [form/](components/ui/form/) |
| [Input](https://nateui.com/components/input) | [input/](components/ui/input/) |
| [InputGroup](https://nateui.com/components/input-group) | [input-group/](components/ui/input-group/) |
| [MultiValueInput](https://nateui.com/components/multi-value-input) | [multi-value-input.tsx](components/ui/multi-value-input.tsx) |
| [Radio](https://nateui.com/components/radio) | [radio/](components/ui/radio/) |
| [Rate](https://nateui.com/components/rate) | [rate.tsx](components/ui/rate.tsx) |
| [Segment](https://nateui.com/components/segment) | [segment/](components/ui/segment/) |
| [Select](https://nateui.com/components/select) | [select/](components/ui/select/) |
| [Slider](https://nateui.com/components/slider) | [slider/](components/ui/slider/) |
| [Switcher](https://nateui.com/components/switcher) | [switcher.tsx](components/ui/switcher.tsx) |
| [TimeInput](https://nateui.com/components/time-input) | [time-input/](components/ui/time-input/) |
| [Upload](https://nateui.com/components/upload) | [upload/](components/ui/upload/) |

### Navigation

| Component | Source |
| --- | --- |
| [Breadcrumb](https://nateui.com/components/breadcrumb) | [breadcrumb/](components/ui/breadcrumb/) |
| [Menu](https://nateui.com/components/menu) | [menu/](components/ui/menu/) |
| [Pagination](https://nateui.com/components/pagination) | [pagination/](components/ui/pagination/) |
| [Steps](https://nateui.com/components/steps) | [steps/](components/ui/steps/) |
| [Tabs](https://nateui.com/components/tabs) | [tabs/](components/ui/tabs/) |

### Overlays

| Component | Source |
| --- | --- |
| [Dialog](https://nateui.com/components/dialog) | [dialog.tsx](components/ui/dialog.tsx) |
| [Drawer](https://nateui.com/components/drawer) | [drawer.tsx](components/ui/drawer.tsx) |
| [Dropdown](https://nateui.com/components/dropdown) | [dropdown/](components/ui/dropdown/) |
| [Popover](https://nateui.com/components/popover) | [popover/](components/ui/popover/) |
| [Tooltip](https://nateui.com/components/tooltip) | [tooltip.tsx](components/ui/tooltip.tsx) |

### Feedback

| Component | Source |
| --- | --- |
| [Alert](https://nateui.com/components/alert) | [alert.tsx](components/ui/alert.tsx) |
| [Notification](https://nateui.com/components/notification) | [notification.tsx](components/ui/notification.tsx) |
| [Progress](https://nateui.com/components/progress) | [progress/](components/ui/progress/) |
| [Shimmer](https://nateui.com/components/shimmer) | [shimmer/](components/ui/shimmer/) |
| [Skeleton](https://nateui.com/components/skeleton) | [skeleton.tsx](components/ui/skeleton.tsx) |
| [Spinner](https://nateui.com/components/spinner) | [spinner.tsx](components/ui/spinner.tsx) |

### Content and data

| Component | Source |
| --- | --- |
| [Avatar](https://nateui.com/components/avatar) | [avatar/](components/ui/avatar/) |
| [Badge](https://nateui.com/components/badge) | [badge.tsx](components/ui/badge.tsx) |
| [Card](https://nateui.com/components/card) | [card.tsx](components/ui/card.tsx) |
| [Carousel](https://nateui.com/components/carousel) | [carousel/](components/ui/carousel/) |
| [Kbd](https://nateui.com/components/kbd) | [kbd.tsx](components/ui/kbd.tsx) |
| [Table](https://nateui.com/components/table) | [table/](components/ui/table/) |
| [Tag](https://nateui.com/components/tag) | [tag.tsx](components/ui/tag.tsx) |
| [Timeline](https://nateui.com/components/timeline) | [timeline/](components/ui/timeline/) |

### Layout and configuration

| Component | Source |
| --- | --- |
| [Collapsible](https://nateui.com/components/collapsible) | [collapsible/](components/ui/collapsible/) |
| [ConfigProvider](https://nateui.com/components/config-provider) | [config-provider/](components/ui/config-provider/) |
| [Container](https://nateui.com/components/container) | [container.tsx](components/ui/container.tsx) |
| [Divider](https://nateui.com/components/divider) | [divider.tsx](components/ui/divider.tsx) |
| [Resizable](https://nateui.com/components/resizable) | [resizable/](components/ui/resizable/) |
| [Scroll](https://nateui.com/components/scroll) | [scroll/](components/ui/scroll/) |

### Supporting UI modules

| Module | Source |
| --- | --- |
| Icon helpers used by the UI components | [icons/](components/ui/icons/) |
| Toast notification API and wrapper | [toast/](components/ui/toast/) |

## Installation

### Requirements

| Requirement | Version or setup |
| --- | --- |
| React and React DOM | 19 |
| TypeScript | 5 or later |
| Tailwind CSS | 4, configured for your existing React project |
| Import alias | `@/*` mapped to your application's source folder |
| CSS modules | Support for imported `.module.css` files, used by Shimmer |

The steps below install source into an existing project. Follow your framework's Tailwind CSS 4 setup first, or refer to the [installation guide](https://nateui.com/components/installation).

### Install dependencies

If you are copying the full component set, install these packages in your application:

```bash
npm install @floating-ui/react motion dayjs clsx tailwind-merge
npm install -D @tailwindcss/typography@
```

| Package | Used for |
| --- | --- |
| `@floating-ui/react` | Floating surfaces, positioning, and related interactions |
| `motion` | Component transitions and animation |
| `dayjs` | Date and time handling |
| `clsx` and `tailwind-merge` | Combining conditional Tailwind class names |
| `@tailwindcss/typography` | The typography plugin loaded by the base stylesheet |

You do not need every package for every component. The Manual section on an individual [component page](https://nateui.com/components) lists its files and npm dependencies.

### Copy the source

Download or clone this repository, then copy the folders below into your application's source folder. For a project using `src/`:

| From this repository | Into your project |
| --- | --- |
| `components/ui/` | `src/components/ui/` |
| `hooks/` | `src/hooks/` |
| `utils/` | `src/utils/` |
| `styles/base.css` | `src/styles/base.css` |

Keep component folders and their local styles together. If copying only selected components, include the components and helpers their imports reference. Copying just the visible `.tsx` file can leave supporting files missing.

### Load the theme once

Import the copied base stylesheet from your application's global CSS entry. For example, from `src/app/globals.css`:

```css
@import '../styles/base.css';
```

The base stylesheet already imports Tailwind CSS and its typography plugin. Remove a separate `@import 'tailwindcss';` from the same entry to avoid loading Tailwind twice.

### Configure the import alias

Components import each other and their helpers through `@/`. For a source folder named `src`, the TypeScript mapping is:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Merge this into your existing configuration. If your framework or bundler needs a separate alias setting, map `@` to the same source folder there. TypeScript's `paths` only affects TypeScript resolution.

If your source lives at the project root instead, use `./*` and copy the component folders to that root. See the [installation guide](https://nateui.com/components/installation) for framework-specific examples.

## Usage

Import components from the local files you copied:

```tsx
'use client';

import Button from '@/components/ui/button';

export default function Example() {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Button variant='solid'>Save changes</Button>
      <Button variant='ghost'>Cancel</Button>
      <Button loading disabled>Saving</Button>
    </div>
  );
}
```

In the Next.js App Router, interactive components need a client entry. Put `'use client'` at the top of the file that imports and uses them. In a client-rendered React application, import them through your normal component tree.

Each component page covers its props, events, states, types, and compound API. For example, [Button](https://nateui.com/components/button), [Select](https://nateui.com/components/select), and [Dialog](https://nateui.com/components/dialog) have different composition patterns; follow their examples rather than assuming they share an API.

## Theming and configuration

### Semantic tokens

The [base stylesheet](styles/base.css) defines `--nui-*` values and maps them into Tailwind utilities through `@theme inline`. Components use classes such as `bg-card`, `text-foreground`, and `border-border`.

| Variable | Controls |
| --- | --- |
| `--nui-background`, `--nui-foreground` | Base surface and text |
| `--nui-card`, `--nui-card-foreground` | Card and panel surfaces |
| `--nui-popover`, `--nui-popover-foreground` | Floating panels |
| `--nui-primary`, `--nui-primary-foreground` | Primary actions and selected states |
| `--nui-control`, `--nui-control-border` | Control fills and edges |
| `--nui-ring` | Focus-ring color |
| `--nui-radius-control` | Shared control radius |
| `--nui-shadow-control` | Shared control shadow |

You can edit the copied stylesheet or load your overrides after it. For example, to change the primary action color and its interaction states:

```css
:root {
  --nui-primary: #0f766e;
  --nui-primary-foreground: #ffffff;
  --nui-primary-hover: #14897f;
  --nui-primary-active: #0b5c55;
}
```

Change fills and their foregrounds together, and check hover, active, and focus states. For a separate dark palette, override the corresponding values under `.dark`. The [theming guide](https://nateui.com/components/theming) lists the token families and how they map to components.

### Light and dark mode

The stylesheet includes light and dark values. The `.dark` class activates Tailwind's `dark:` utilities; `data-theme` also selects token values. Keep your document mode and `ConfigProvider`'s `mode` consistent, including for floating surfaces.

For a dark document, the root markup can start with:

```html
<html class="dark" data-theme="dark">
```

Set `mode: 'dark'` in `ConfigProvider`'s `value`, or pass `mode='dark'` to the `Providers` wrapper below. If your app already has a theme controller, keep it as the source of the selected mode and use it to update both the document and provider.

### Component defaults and style slots

Use [ConfigProvider](https://nateui.com/components/config-provider) to configure a subtree. It expects a complete config value, so start from `defaultConfig` or the current `useConfig()` value:

```tsx
'use client';

import type { ReactNode } from 'react';
import ConfigProvider, { defaultConfig } from '@/components/ui/config-provider';

type ProvidersProps = {
  children: ReactNode;
  mode?: 'light' | 'dark';
};

export function Providers({ children, mode = 'light' }: ProvidersProps) {
  return (
    <ConfigProvider
      value={{
        ...defaultConfig,
        mode,
        componentDefaults: {
          button: { size: 'sm', variant: 'solid' },
          input: { size: 'sm' },
        },
        classNames: {
          button: { root: 'font-semibold' },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
```

Wrap the relevant part of your app with `<Providers>`. An explicit prop on a component takes precedence over its provider default. `classNames` targets named slots; use the provider's [API reference](https://nateui.com/components/config-provider) to find the supported slot names.

### Theme Editor

The [Theme Editor](https://nateui.com/themes) lets you explore component appearance and adjust colors, typography, density, and component styles. See the [theming guide](https://nateui.com/components/theming) for applying a theme's CSS and provider configuration to your application.

## AI tools and resources

Use the actual component source and public documentation when working with coding agents. They provide the supported props, composition patterns, imports, and theme configuration.

| Resource | What to find there |
| --- | --- |
| [Components](https://nateui.com/components) | Component APIs, examples, and file dependencies |
| [Installation](https://nateui.com/components/installation) | Theme, alias, and framework setup |
| [Theming](https://nateui.com/components/theming) | Tokens, component defaults, and style slots |
| [Theme Editor](https://nateui.com/themes) | Interactive theme exploration |
| [MCP setup](https://nateui.com/components/mcp) | Connecting an AI tool to the NateUI catalog and documentation |
| [Agent skills](https://nateui.com/components/agent-skills) | NateUI usage guidance for coding agents |

## Updating your copy

Copied source remains part of your application. Check [CHANGELOG.md](CHANGELOG.md), compare relevant component files with your local versions, and keep your intended changes when applying an update.

Include changed helpers, local CSS, and theme values where the component needs them. Review dependency changes too. Updating an npm dependency does not replace the component source you copied into your project.

## Troubleshooting

<details>
<summary><b>Imports beginning with @/ cannot be resolved</b></summary>

Map `@/*` to the folder containing your `components`, `hooks`, and `utils` directories. Check both TypeScript and your framework's resolver, then restart the development server if needed.

</details>

<details>
<summary><b>Components render without the expected styles</b></summary>

Check that Tailwind CSS 4 is configured, the copied `styles/base.css` is imported once, and `@tailwindcss/typography` is installed. The stylesheet uses Tailwind v4's `@theme` and `@plugin` syntax.

Keep the copied source inside Tailwind's scanned paths. If your project has customized source detection, include the component folders there.

</details>

<details>
<summary><b>A supporting file or npm package is missing</b></summary>

Follow imports from the component file. Include its referenced UI components, hooks, utilities, and local styles. The package list above covers the full free set; an individual component's Manual documentation lists its own requirements.

</details>

<details>
<summary><b>React reports a server/client component error</b></summary>

In an application with React Server Components, import interactive UI from a client entry marked with `'use client'`. Put `ConfigProvider` inside a client wrapper such as the `Providers` example above, then use that wrapper from your layout.

</details>

<details>
<summary><b>Dark colors and component appearance do not agree</b></summary>

Check the document's `.dark` class and the value passed to `ConfigProvider`. Setting only `data-theme='dark'` selects token values but does not activate Tailwind's `dark:` utilities. Both the document and provider should use the selected appearance.

</details>

<details>
<summary><b>Shimmer appears without its sweep animation</b></summary>

Keep `shimmer.module.css` beside the Shimmer source and ensure your build supports CSS modules. The sweep is disabled when the operating system requests reduced motion; that behavior is intentional.

</details>

## Repository layout

```text
components/ui/       Free UI component source and local styles
hooks/               Shared hooks used by these components
utils/               Shared utility functions
styles/base.css      Theme values and Tailwind token mappings
.github/assets/      README brand assets
```

## Free and Pro

The code in this repository is the free UI library under [MIT](LICENSE). The wider NateUI catalog also includes Pro component layers, Blocks, and templates under separate terms.

See [pricing](https://nateui.com/pricing), [templates](https://nateui.com/templates), and the [Terms of Service](https://nateui.com/terms) for the current paid scope and license. Those terms do not replace the MIT license for the source included here.

## Contributing and support

- **Bugs and component requests:** use [GitHub Issues](https://github.com/nateui/react/issues/new/choose). See [CONTRIBUTING.md](CONTRIBUTING.md) for reproduction details to include.
- **Security vulnerabilities:** follow [SECURITY.md](SECURITY.md) for private reporting.
- **Account or purchase questions:** email [support@nateui.com](mailto:support@nateui.com).

## License

[MIT](LICENSE) © 2026 NateUI. Retain the license notice when copying or distributing the code. Dependencies retain their own licenses.
