# Styling Standards

## Utility Framework
- Tailwind CSS — utility classes only
- Use `cn()` from `~/lib/utils` (clsx + tailwind-merge) for conditional/merged classes
- CVA (`class-variance-authority`) for components with multiple variants

## Design Tokens (tailwind.config.ts)
- **Primary**: `primary` / `#035925` (light: `#047a32`, dark: `#024a1c`)
- **Primary hover**: `#B0C834` (lime-ish, used in some CTAs)
- **Secondary**: `secondary` / `#0D0D0E`
- **Sage border/light**: `sage-light` / `#E7EFEA` (also as `#e7efea` inline)
- **Charcoal text**: `charcoal` / `#1E1E1E`
- **Rich black**: `rich-black` / `#0D0D0E`
- **Neutrals**: `neutral-100` (#F5F5F5) → `neutral-1000` (#333333)
- **Green accent**: `green-400` / `#2A9B4C`
- **Text secondary**: `text.secondary` / `#9EA2AD`
- **Border radius**: `--radius: 0.625rem` (10px)

## CSS Variables (global.css)
All colors also available as HSL CSS variables, e.g. `--color-primary`, `--color-neutral-100`, etc.

## Input Fields
Standard pattern across forms:
```
h-9 px-3 rounded-2xl border border-transparent bg-[#f8faf8] text-sm
focus:outline-none focus:ring-1 focus:ring-[#035925]/30
placeholder:text-[#717182] w-full
```
- Error state: add `border-red-400`
- Required asterisk: `<span class="text-red-500">*</span>`

## Buttons (BaseButton)
CVA-based with `rounded-full px-5 py-[18px]`:
- **Primary**: `bg-primary text-white hover:bg-primary-light`
- **Secondary**: `border border-[#e7efea] text-[#1e1e1e]`
- **CMS primary**: `bg-[#035925] hover:bg-[#024c20] text-white rounded-2xl h-9 px-4 text-sm`
- **CMS secondary**: `border border-[#e7efea] text-[#1e1e1e] rounded-2xl h-9 px-4 text-sm`

## Cards / Modals
- `rounded-2xl border border-[#e7efea] shadow-lg`
- Header: `bg-gray-50 border-b border-[#e7efea] px-6 py-4`
- Dividers: `border-[#e5e7eb]`

## Labels
- `text-sm font-medium text-gray-800` (forms)
- `text-sm font-medium text-neutral-900` (feature components)
- Hint/description text: `text-xs text-[#6B7280]`

## Fonts
- **Instrument Sans** (primary UI font, weights 400–700)
- **Inter** (secondary, weights 400–700)

## ImageUploader Border States
- Default: `border-[#D1D5DC]`
- Dragging: `border-[#035925] border-dashed`
- Error: `border-red-400`
- Custom via `borderClass` prop (overridden by error/drag states)
