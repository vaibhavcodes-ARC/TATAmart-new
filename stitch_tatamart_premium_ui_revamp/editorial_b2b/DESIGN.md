---
name: Editorial B2B
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#464741'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#777771'
  outline-variant: '#c7c7bf'
  surface-tint: '#5f5e5c'
  primary: '#020302'
  on-primary: '#ffffff'
  primary-container: '#1d1d1b'
  on-primary-container: '#868582'
  inverse-primary: '#c8c6c3'
  secondary: '#346941'
  on-secondary: '#ffffff'
  secondary-container: '#b4eebb'
  on-secondary-container: '#396d45'
  tertiary: '#030302'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e1d19'
  on-tertiary-container: '#888580'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2de'
  primary-fixed-dim: '#c8c6c3'
  on-primary-fixed: '#1c1c1a'
  on-primary-fixed-variant: '#474744'
  secondary-fixed: '#b6f0be'
  secondary-fixed-dim: '#9bd4a3'
  on-secondary-fixed: '#00210b'
  on-secondary-fixed-variant: '#1b512c'
  tertiary-fixed: '#e7e2dc'
  tertiary-fixed-dim: '#cac6c0'
  on-tertiary-fixed: '#1d1b18'
  on-tertiary-fixed-variant: '#494642'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  ink-black: '#1D1D1B'
  forest-accent: '#043F1C'
  paper-neutral: '#F0EBE5'
  border-subtle: '#E5E5E5'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 72px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
  label-mono:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 32px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

This design system fuses the raw, high-fashion impact of editorial print with the clinical precision of modern SaaS leaders. The personality is authoritative, premium, and efficient—designed for a B2B marketplace where high-volume transactions meet high-end brand values. 

The aesthetic is **High-Contrast Minimalism**. It leverages the aggressive use of whitespace seen in luxury fashion layouts, punctuated by the systematic functionalism of Stripe and Apple. The goal is to evoke a sense of "Industrial Luxury"—where the UI feels like a bespoke tool that is both powerful and impeccably curated.

**Key Stylistic Pillars:**
- **Editorial Scale:** Dramatic shifts in type scale to create clear hierarchy and "magazine-style" layouts.
- **Architectural Layouts:** A focus on structural lines and grid-based alignment rather than decorative elements.
- **The "Edge":** Utilizing sharp typography and a restricted palette to maintain a serious, high-stakes business tone.

## Colors

The color strategy is intentionally restrictive to allow product imagery and typography to command attention. 

- **Primary (Ink Black):** Used for primary headings, body text, and "heavy" UI elements like primary buttons. It provides the foundation of high-contrast.
- **Secondary (Forest Accent):** A sharp, deep green derived from the reference brand. This is used sparingly for semantic emphasis, success states, or premium membership indicators.
- **Neutral (Paper & White):** We utilize a dual-neutral approach. `#FFFFFF` is used for the main workspace and surface areas to keep the "Apple" clarity, while `#F0EBE5` (Paper) is used for sectioning, sidebars, or "editorial" callouts to add depth and warmth.
- **Interactive State:** Hover states should transition from Black to the Forest Accent or utilize opacity shifts to maintain a sophisticated feel.

## Typography

This system employs a "High-Low" typographic pairing. 

**EB Garamond** (The "High") is the editorial voice. It should be used for large display headings and marketing moments. Use the Italic variant for single words within headlines to create the "Switch Nails" signature edge.

**Hanken Grotesk** (The "Low") is the functional workhorse. It handles all UI, data, and body copy. It is clean, modern, and provides the "Stripe/Apple" reliability.

**Geist** is used specifically for technical data, labels, and small metadata. Its monospaced-adjacent feel brings the "Notion/Developer" precision to the marketplace interface.

**Implementation Note:** Maintain tight tracking (letter-spacing) on large Garamond headlines to keep them looking expensive and deliberate.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. While the content lives within a maximum 1440px container to ensure readability, the internal grid is a strict 12-column system with generous 32px gutters.

**Spacing Philosophy:**
- **Asymmetric Balance:** Use large, intentional gaps in layout to separate high-level categories.
- **Breathability:** Spacing between sections should be aggressive (120px+ on desktop) to emulate a premium catalog.
- **Component Density:** While the page layout is airy, functional components (like data tables or order forms) should follow a tighter 8px grid to ensure B2B efficiency.

**Breakpoints:**
- **Mobile (<768px):** Shift to 4 columns. Reduce top/bottom padding by 50%.
- **Tablet (768px - 1024px):** 8 columns. Margins at 40px.
- **Desktop (>1024px):** 12 columns. Full 64px margins.

## Elevation & Depth

This design system rejects heavy shadows in favor of **Tonal Layers** and **Ghost Borders**. 

- **Tonal Layers:** Elevation is primarily communicated through color shifts. The background is pure White (`#FFFFFF`), while "elevated" cards or side panels use the Paper (`#F0EBE5`) neutral. 
- **Ghost Borders:** Use 1px solid borders in `#E5E5E5` to define structure. This creates a clean, architectural feel similar to Notion.
- **Interaction Depth:** For hovering over actionable cards, use a very subtle, highly diffused shadow (0px 4px 20px rgba(0,0,0,0.04)) only to suggest "lift." 
- **Glassmorphism:** Reserved exclusively for navigation bars. Use a heavy backdrop blur (20px) with 80% opacity White to maintain context while scrolling through high-scale imagery.

## Shapes

To maintain the "Editorial Edge" and "Stripe-like" precision, the shape language is disciplined and geometric. 

- **Soft (0.25rem):** Standard for buttons, input fields, and small cards. It is just enough to feel modern without losing the "sharp" B2B character.
- **Sharp (0px):** Large image containers and primary section dividers should remain sharp to maintain the architectural, magazine-style aesthetic.
- **Pill (100px):** Reserved exclusively for status indicators (e.g., "In Stock," "Shipped") and primary tags/chips.

## Components

**Buttons:**
- **Primary:** Solid Ink Black, white text, 4px radius. No gradients. High-contrast hover (slight opacity drop or Forest Green accent).
- **Secondary:** Ghost style. 1px Black border, transparent background.
- **Editorial CTA:** EB Garamond Italic text with a simple underlined link—used for "Discover" or "Read More" in content-heavy sections.

**Inputs & Fields:**
- Use the "Stripe" model: Minimalist 1px borders, subtle light-gray background on focus. Labels should use Geist at 12px uppercase for a technical, precise look.

**Cards:**
- **Product Cards:** Zero-border, pure white background. The image should be full-bleed to the top. Price and Title use Hanken Grotesk.
- **Container Cards:** Use the Paper neutral (`#F0EBE5`) with no borders to group related B2B data (e.g., Shipping Details).

**Data Tables:**
- Essential for a marketplace. High density. Use 1px horizontal dividers only. Row hover state uses the Paper neutral. Column headers use Geist Mono-style labels.

**Large Imagery:**
- Imagery is a core component. Use large-scale, high-fashion photography of products. Every product image should have a consistent "studio" lighting feel to match the premium brand identity.