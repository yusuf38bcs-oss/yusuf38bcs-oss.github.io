# Hero Background Image - Deployment & Verification Guide

## ✅ File Structure (CORRECT)

```
yusuf38bcs-oss.github.io/
├── assets/
│   ├── images/
│   │   ├── header-bg.webp          ← MAIN HERO IMAGE (84KB)
│   │   ├── logo.png
│   │   ├── profile.jpg
│   │   └── site/
│   │       ├── default-teaser.webp
│   │       └── social-preview.webp
│   └── css/
│       ├── _hero-enhancements.scss ← NEW FILE
│       └── style.scss
├── _layouts/
│   └── home.html                   ← UPDATED
├── index.md                        ← UPDATED
├── _config.yml                     ← UPDATED
└── [other files]
```

## 🔧 Image Path Reference

| File | Hero Image Reference | Status |
|------|----------------------|--------|
| `index.md` | `/assets/images/header-bg.webp` | ✅ CORRECT |
| `_config.yml` defaults | `/assets/images/header-bg.webp` | ✅ CORRECT |
| CSS background-image | `url('/assets/images/header-bg.webp')` | ✅ CORRECT |

## ✅ What Each Update Fixes

### 1. **index.md** Fix
- **BEFORE**: `overlay_image: /images/header-bg.webp` ❌ (Wrong path)
- **AFTER**: `overlay_image: /assets/images/header-bg.webp` ✅ (Correct path)
- **Why**: Image is in `assets/images/`, not just `images/`

### 2. **_layouts/home.html** Enhancement
- ✅ Fixes Z-index hierarchy (`::before` at z-0, `::after` at z-0.5, content at z-2)
- ✅ Adds neural atmospheric symbols with subtle animation
- ✅ Improves overlay gradient performance
- ✅ Adds animation entrance for title/subtitle
- ✅ Mobile-optimized responsive behavior
- ✅ Accessibility: respects `prefers-reduced-motion`

### 3. **_hero-enhancements.scss** (NEW FILE)
- ✅ Defines color system (primary teal, neural grays)
- ✅ Advanced gradient overlay technique
- ✅ Cinematic text shadows for readability
- ✅ Fluid typography scaling
- ✅ Mobile-first media queries
- ✅ Fallback styles for failed image loads

### 4. **_config.yml** Fix
- **BEFORE**: Default header used `/assets/images/site/header-bg.webp` (Wrong)
- **AFTER**: Homepage specifically uses `/assets/images/header-bg.webp` (Correct)
- **Why**: Separates homepage hero from generic page headers

## 📊 Visual Hierarchy (Z-Index System)

```
Layer 2: .page__hero-content (z-index: 2)
         └─ Title & Subtitle (Main content)

Layer 1.5: .page__hero-caption (z-index: 2)
           └─ Interactive elements

Layer 0.5: .page__hero--overlay::after (z-index: 0.5)
           └─ Neural symbols (●━◯)

Layer 0: .page__hero--overlay::before (z-index: 0)
         └─ Gradient overlay

Layer -1: .page__hero--overlay background
          └─ WebP background image
```

## 🎯 Mobile Optimization Strategy

| Screen Size | Hero Height | Background | Animation |
|------------|------------|-----------|-----------|
| Desktop (>768px) | `100vh` | `fixed` (Parallax) | Enabled |
| Tablet (768px) | `90vh` | `scroll` | Enabled |
| Mobile (<480px) | `85vh` | `scroll` | Disabled (perf) |

## 🚀 Performance Notes

- **WebP Image**: 84KB (highly optimized)
- **Backdrop**: Uses `background-attachment: fixed` for parallax (remove on very low-power devices if needed)
- **Animations**: 1.2s + 1.4s staggered (total 2.6s max)
- **Fallback**: If WebP fails to load, gradient takes over
- **Mobile**: `background-attachment: scroll` prevents jank

## 📋 Deployment Steps

1. **Update `index.md`** - Fix image path
2. **Update `_layouts/home.html`** - Add z-index fixes and animations
3. **Add `assets/css/_hero-enhancements.scss`** - New style module
4. **Update `_config.yml`** - Fix default header path
5. **Test locally**: `bundle exec jekyll serve`
6. **Verify image loads**: Check DevTools Network tab
7. **Push to GitHub Pages**
8. **Check live site**: https://learningbiologyforlife.org

## ✅ Final Verification Checklist

- [ ] Image renders in browser (not showing binary content)
- [ ] Gradient overlay visible (semi-transparent)
- [ ] Title & subtitle text readable
- [ ] Title animation smooth on first load
- [ ] Mobile view: background scrolls, not parallax
- [ ] Navbar doesn't overlap hero
- [ ] No horizontal overflow
- [ ] Page builds without Jekyll errors
- [ ] Images load in DevTools Network tab
- [ ] Lighthouse Performance > 75

---
