# Design System Specification: The Editorial Canvas

## 1. Overview & Creative North Star
**Creative North Star: "The Curated Atelier"**

This design system is built to move beyond the "SaaS template" look. For a social media creator tool, the interface must act as a sophisticated gallery—quiet enough to let the creator's content shine, yet intentional enough to feel like a premium professional instrument. 

We achieve this through **"Organic Brutalism"**—a philosophy that pairs a rigid, spacious layout with soft, organic tactile elements. We break the standard grid by using intentional asymmetry (e.g., staggering cards) and high-contrast typography scales. The goal is an editorial feel that suggests the tool isn't just a utility, but an extension of the creator's brand.

---

## 2. Color & Surface Logic
The palette is anchored in deep, intelligent slates (`secondary`) and soulful indigos (`primary`), punctuated by a "Vibrant Crimson" (`tertiary`) for high-energy moments.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are prohibited for sectioning. 
Structure must be defined through:
1.  **Tonal Shifts:** Placing a `surface-container-low` component against a `surface` background.
2.  **Negative Space:** Using the spacing scale to create "invisible boundaries."

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper or frosted glass. Use the `surface-container` tiers to define "altitude":
*   **Base Layer:** `surface` (#f5f7f9) - The infinite canvas.
*   **Sectioning:** `surface-container-low` (#eef1f3) - For large sidebar or background zones.
*   **Primary Cards:** `surface-container-lowest` (#ffffff) - The highest "pop" for content blocks.
*   **Nested Elements:** Use `surface-container-high` (#dfe3e6) for utility items inside cards (e.g., search bars or tags).

### The "Glass & Gradient" Rule
To inject "soul" into the UI, use **Glassmorphism** for floating menus or navigation bars. Use `surface` at 80% opacity with a `20px` backdrop-blur. 
*   **Signature Gradients:** For primary CTAs, transition from `primary` (#4a40e0) to `primary-container` (#9795ff) at a 135° angle to create a sense of depth and luminosity.

---

## 3. Typography
The system uses a duo-font approach to balance professional authority with creative fluidity.

*   **Display & Headlines (Plus Jakarta Sans):** These are your "Editorial Voices." Use `display-lg` and `headline-md` with tight tracking (-0.02em) to create a bold, modern impact. The geometric nature of Plus Jakarta Sans provides the "High-End" feel.
*   **Body & Labels (Manrope):** Manrope is chosen for its exceptional readability at small sizes. It feels technical yet warm. 
*   **Hierarchy as Identity:** Use a dramatic jump between `display-sm` for page headers and `body-md` for content. This "scale gap" is what creates the boutique, non-generic look.

---

## 4. Elevation & Depth
We reject the "heavy shadow" aesthetic. Depth is achieved through light and atmospheric layering.

*   **Tonal Layering:** Always prefer a color shift over a shadow. A `surface-container-lowest` card on a `surface` background provides enough contrast for the eye to perceive depth.
*   **Ambient Shadows:** If a card must "float" (e.g., a modal or a dragged item), use an extra-diffused shadow:
    *   `X: 0, Y: 12, Blur: 40, Spread: -4`
    *   **Color:** `on-surface` (#2c2f31) at 6% opacity. This mimics natural ambient occlusion.
*   **The "Ghost Border":** For high-accessibility needs, use `outline-variant` at 15% opacity. Never use 100% opaque borders.
*   **Refraction:** For glass elements, add a `0.5px` inner stroke of `surface-container-lowest` at 30% opacity to simulate a "glass edge."

---

## 5. Components

### Cards & Containers
*   **Corner Radius:** Use `xl` (1.5rem) for main content cards and `md` (0.75rem) for nested items.
*   **Spacing:** Content inside cards must never be closer than `1.5rem` to the edge.
*   **No Dividers:** Prohibit the use of `<hr>` lines. Use `1.5rem` of vertical whitespace to separate header, body, and footer sections of a card.

### Buttons
*   **Primary:** Indigo-to-Light-Indigo gradient. Radius: `full`. No border.
*   **Secondary:** `secondary-container` background with `on-secondary-container` text. Subtle and sophisticated.
*   **Tertiary/Action:** Use the vibrant `tertiary` (#b80438) for destructive actions or "Go Live" buttons to provide high-energy contrast.

### Interactive Inputs
*   **Text Fields:** Use `surface-container-highest` as the background. On focus, transition to a `primary` "Ghost Border" (20% opacity).
*   **Chips:** Use `secondary-fixed-dim` for a muted, pro-look tag. Radius: `sm` (0.25rem) for a more technical, "labeled" appearance.

### Creator-Specific Components
*   **The Content Feed:** Staggered card layouts (Masonry style) using `surface-container-lowest`.
*   **Status Indicators:** Instead of a simple dot, use a `primary` "Glow" (a small circle with a `primary-container` outer glow) to signify "Processing" or "Live."

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., wider left margins) to give the layout an editorial feel.
*   **Do** layer cards. A small card overlapping the corner of a larger card creates a high-end, bespoke layout.
*   **Do** use `display-lg` typography for numbers and metrics to make data feel like art.

### Don't
*   **Don't** use black (#000000). Use `on-background` (#2c2f31) for text to maintain a soft, premium "ink" look.
*   **Don't** use standard 8px padding. Lean into 16px, 24px, or 32px to ensure the UI "breathes."
*   **Don't** use heavy "drop shadows" on buttons. If it needs to stand out, use color and scale, not shadow weight.