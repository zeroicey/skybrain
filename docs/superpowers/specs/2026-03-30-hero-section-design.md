# Hero Section Landing Page Design

## Project Overview

- **Project name:** SkyBrain Hero Section
- **Type:** Landing page with GSAP scroll-triggered animation
- **Core functionality:** A visually engaging hero section featuring a 3D drone model that animates from top-right to bottom-left on scroll, with content fade-in/out transitions
- **Target users:** Visitors to the SkyBrain drone monitoring platform

---

## UI/UX Specification

### Layout Structure

**Initial State (page load):**
```
+---------------------------+------------------------+
| 天枢灵犀                  |        3D Model        |
| (title + description)     |    (top-right)        |
+---------------------------+------------------------+
| 核心功能                  |      空                |
| (feature list)           |                        |
+---------------------------+------------------------+
```

**After Scrolling:**
```
+---------------------------+------------------------+
| 智能协作                  |     技术优势           |
| (new title + desc)        |  (new feature list)   |
+---------------------------+------------------------+
| 3D Model                 |   功能卡片             |
| (bottom-left)            |  (feature cards)       |
+---------------------------+------------------------+
```

- **Section:** Full viewport height (h-screen)
- **Grid:** Two-column layout, roughly 50/50 split
- **Responsive:** Stack vertically on mobile (< 768px)

### Visual Design

**Color Palette:**
- Primary green: `#7ddf7d`
- Green dark: `#1a3d1a`
- Orange: `#ff8c42`
- Pink: `#ff7eb3`

**Background:**
- Gradient: `linear-gradient(135deg, #e8f5e9 0%, #fff8e8 20%, #ffe8d6 40%, #ffe8f0 60%, #f8e8f8 80%, #e8f5e9 100%)`
- Grid overlay: Subtle 30px grid pattern with 8% opacity
- Scanline effect: Horizontal lines at 4px intervals

**Card Style (Glassmorphism):**
- Background: `white/60`
- Backdrop blur: `backdrop-blur-sm`
- Border: `border-white/50`
- Border radius: `rounded-2xl`
- Shadow: `shadow-xl`

**Typography:**
- Title: `text-5xl`, `font-bold`, `#1a2e1a`
- Subtitle: `text-xl`, `#3d5c3d`
- Body: `text-lg`, `#3d5c3d`

### Components

1. **HeroSection** - Main container with ScrollTrigger
2. **ModelCanvas** - 3D drone model display with Canvas/three.js
3. **InfoCard** - Glassmorphic text card (reusable)
4. **FeatureList** - List of features with bullet points
5. **FeatureCards** - Grid of feature cards with icons (scroll后)

### Animations

**Scroll-triggered (GSAP ScrollTrigger):**
- Duration: 2000px scroll distance
- Pin: true (section stays fixed)
- Scrub: 1 (1s smooth delay)

**Animations Sequence:**
1. Left-top text fades out (duration: 1)
2. Right-bottom text fades out (same time)
3. 3D model moves from top-right to bottom-left (duration: 2)
4. Left-top new text fades in (智能协作)
5. Right-top new text fades in (技术优势)
6. Right-bottom feature cards fade in

---

## Functionality Specification

### Core Features

1. **3D Drone Model Display**
   - Load GLTF model from `/drone3d.glb`
   - Auto-rotate with orbit controls
   - Scale: 3-4 (adjustable)
   - Tilt: -15deg for visual interest

2. **Scroll Animation**
   - Model moves diagonally from top-right to bottom-left
   - Content cards fade in/out based on scroll position
   - Smooth scrubbing with 1s delay

3. **Responsive Behavior**
   - Mobile: Stack vertically, hide 3D model or simplify

### Data Handling

- Static content (no API calls)
- Model preloaded with `useGLTF.preload()`

---

## Acceptance Criteria

1. ✅ Page loads with 3D drone model in top-right
2. ✅ Left-top shows "天枢灵犀" + description
3. ✅ Right-bottom shows "核心功能" list
4. ✅ Scrolling causes model to move to bottom-left
5. ✅ Left content fades out, new left content fades in (智能协作)
6. ✅ Right content fades out, new right content fades in (技术优势 + 功能卡片)
7. ✅ No overlap between model and text content
8. ✅ Glassmorphism card style consistent throughout
9. ✅ Background gradient and grid pattern visible