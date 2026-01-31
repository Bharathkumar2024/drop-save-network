# 🎨 Royal Theme Quick Reference Guide

## Quick Start - Apply Royal Theme to Any Page

### 1. **Basic Page Structure**

```tsx
import { Card } from '@/components/ui/card';

const YourPage = () => {
  return (
    <div className="min-h-screen bg-white bg-royal-pattern">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#8B0000]/10 to-transparent rounded-full blur-3xl animate-elegant-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#DC143C]/8 to-transparent rounded-full blur-3xl animate-elegant-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Your content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Content here */}
      </div>
    </div>
  );
};
```

### 2. **Premium Card Component**

```tsx
<Card className="glass-card-royal p-8 hover:shadow-royal transition-all duration-500 border-2 border-[#8B0000]/20">
  <h2 className="text-3xl font-bold text-[#8B0000] mb-4">
    Your Heading
  </h2>
  <p className="text-gray-600">
    Your content here
  </p>
</Card>
```

### 3. **Royal Gradient Heading**

```tsx
<h1 className="text-6xl font-bold text-royal mb-6">
  Royal Heading
</h1>

{/* Or with custom gradient */}
<h1 className="text-6xl font-bold bg-gradient-to-br from-[#8B0000] to-[#DC143C] bg-clip-text text-transparent">
  Gradient Heading
</h1>
```

### 4. **Premium Button**

```tsx
<button className="px-8 py-4 bg-gradient-to-br from-[#8B0000] to-[#DC143C] text-white font-bold rounded-xl shadow-elegant hover:shadow-royal hover:scale-105 transition-all duration-300">
  Take Action
</button>
```

### 5. **Icon with Royal Gradient Background**

```tsx
import { Heart } from 'lucide-react';

<div className="w-20 h-20 bg-gradient-to-br from-[#8B0000] to-[#DC143C] rounded-2xl flex items-center justify-center shadow-elegant hover:scale-110 transition-transform duration-300">
  <Heart className="w-10 h-10 text-white" />
</div>
```

### 6. **Stats Display**

```tsx
<div className="glass-card-royal p-8 rounded-3xl shadow-royal">
  <div className="grid grid-cols-3 gap-8 text-center">
    <div>
      <div className="text-6xl font-bold bg-gradient-to-br from-[#8B0000] to-[#DC143C] bg-clip-text text-transparent mb-3">
        342+
      </div>
      <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide">
        Active Donors
      </div>
    </div>
    {/* More stats... */}
  </div>
</div>
```

### 7. **Feature Card**

```tsx
import { Shield } from 'lucide-react';

<div className="glass-card p-6 text-center hover:shadow-elegant transition-all duration-300">
  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8B0000] to-[#DC143C] rounded-xl mb-4 shadow-elegant">
    <Shield className="w-8 h-8 text-white" />
  </div>
  <h3 className="text-xl font-bold text-[#8B0000] mb-2">Secure & Safe</h3>
  <p className="text-gray-600">HIPAA compliant platform</p>
</div>
```

---

## 🎨 Utility Classes Reference

### Glass Cards
- `.glass-card` - White glass card with subtle effects
- `.glass-card-royal` - Glass card with red tint

### Text Effects
- `.text-royal` - Royal gradient text effect

### Shadows
- `.shadow-soft` - Subtle shadow
- `.shadow-elegant` - Medium elegant shadow
- `.shadow-royal` - Strong royal shadow

### Animations
- `.animate-elegant-float` - Smooth floating animation
- `.animate-slide-in-up` - Entrance animation
- `.animate-pulse` - Pulsing effect

### Backgrounds
- `.bg-royal-pattern` - Royal red pattern overlay
- `.bg-white-pattern` - White pattern overlay

---

## 🎨 Color Values

### Use These Exact Colors

```tsx
// Primary Royal Reds
const colors = {
  royalRed: '#8B0000',      // Deep royal blood red
  crimson: '#DC143C',        // Crimson red
  brightRed: '#FF1744',      // Bright accent red
  white: '#FFFFFF',          // Pure white
  offWhite: '#FAFAFA',       // Off-white
  lightGray: '#F5F5F5',      // Light gray backgrounds
  textGray: '#666666',       // Body text gray
  darkGray: '#1A1A1A',       // Dark text
};

// Gradients
const gradients = {
  royal: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FF1744 100%)',
  redWhite: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FFFFFF 100%)',
};
```

---

## 📐 Spacing & Sizing

### Consistent Spacing
- Small gap: `gap-4` (1rem)
- Medium gap: `gap-6` (1.5rem)
- Large gap: `gap-8` (2rem)

### Card Padding
- Small card: `p-6` (1.5rem)
- Medium card: `p-8` (2rem)
- Large card: `p-12` (3rem)

### Border Radius
- Small: `rounded-lg` (0.5rem)
- Medium: `rounded-xl` (0.75rem)
- Large: `rounded-2xl` (1rem)
- Extra large: `rounded-3xl` (1.5rem)

---

## 🎭 Animation Timing

### Transitions
```tsx
// Quick: 200-300ms
className="transition-all duration-300"

// Standard: 400-500ms
className="transition-all duration-500"

// Slow: 600-800ms
className="transition-all duration-700"
```

### Hover Effects
```tsx
// Scale up
className="hover:scale-105 transition-transform duration-300"

// Translate up
className="hover:-translate-y-2 transition-transform duration-300"

// Shadow change
className="hover:shadow-royal transition-shadow duration-300"
```

---

## 📱 Responsive Design

### Typography Sizes
```tsx
// Headings
<h1 className="text-4xl md:text-6xl lg:text-8xl">

// Subheadings
<h2 className="text-2xl md:text-3xl lg:text-4xl">

// Body text
<p className="text-base md:text-lg">
```

### Grid Layouts
```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## ✅ Checklist for New Pages

When creating a new page with the royal theme:

- [ ] Use white background with `bg-royal-pattern`
- [ ] Add floating background elements
- [ ] Use Playfair Display for headings
- [ ] Use Inter for body text
- [ ] Apply glass cards with `glass-card` or `glass-card-royal`
- [ ] Use royal red (#8B0000, #DC143C) for CTAs
- [ ] Add hover effects with smooth transitions
- [ ] Include entrance animations with `animate-slide-in-up`
- [ ] Use proper shadow hierarchy
- [ ] Maintain consistent spacing
- [ ] Test responsive breakpoints

---

## 🎨 Common Patterns

### Hero Section
```tsx
<header className="text-center mb-20 animate-slide-in-up">
  <div className="inline-block p-4 bg-gradient-to-br from-[#8B0000] to-[#DC143C] rounded-2xl shadow-royal mb-6">
    <Icon className="w-16 h-16 text-white" />
  </div>
  <h1 className="text-8xl font-bold text-royal mb-6">
    Your Title
  </h1>
  <p className="text-2xl text-gray-700 max-w-3xl mx-auto">
    Your description
  </p>
</header>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {items.map((item, index) => (
    <Card
      key={item.id}
      className="glass-card-royal p-8 hover:shadow-royal transition-all duration-500 animate-slide-in-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Card content */}
    </Card>
  ))}
</div>
```

---

## 🚀 Pro Tips

1. **Always use gradients** for important CTAs and headings
2. **Layer shadows** for depth (soft → elegant → royal)
3. **Stagger animations** with delay for visual flow
4. **Use glassmorphism** for modern premium feel
5. **Maintain white space** for professional look
6. **Add hover effects** to all interactive elements
7. **Use royal red sparingly** for maximum impact
8. **Keep text readable** with proper contrast

---

**Quick reference for implementing the royal blood red and white professional theme!**
