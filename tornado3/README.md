# Tornado.io 3 - Battle Arena
## Official Game Page

A vibrant, Brawl Stars-inspired game page with bilingual support (English/Portuguese) showcasing Tornado.io 3 - Battle Arena.

## 📁 Project Structure

```
tornado3/
├── index.html                 # Main HTML page
├── assets/
│   ├── css/
│   │   └── main.css          # Brawl Stars-inspired styling
│   ├── js/
│   │   └── tornado3.js       # Localization & interactivity
│   └── images/
│       ├── Main.jpg          # Main screenshot (featured)
│       ├── Screenshot_2_Raw.jpg
│       ├── Screenshot_3_Raw.jpg
│       ├── Screenshot_4_Raw.jpg
│       ├── Screenshot_5_Raw.jpg
│       └── Screenshot_6_Raw.jpg
└── README.md                 # This file

data/
├── tornado3.json             # English content
└── tornado3_pt.json          # Portuguese content
```

## 🎨 Design System

### Color Palette
- **Primary**: `#FF6B35` (Energetic Orange)
- **Secondary**: `#4ECDC4` (Fresh Cyan)
- **Backgrounds**: `#1A1D29`, `#252A3F`, `#2D3347`
- **Text**: `#FFFFFF`, `#E0E6ED`, `#A8B2C1`

### Typography
- **Headings**: Extra-bold sans-serif (700-900 weight)
- **Body**: Medium-bold (600 weight)
- **Buttons**: Uppercase, bold

### Components
- Pill-shaped buttons (50px border-radius)
- Rounded cards (16-24px border-radius)
- Smooth animations (0.3s transitions)
- Hover effects (scale 1.05)

## 🌐 Localization

The page supports two languages:
- **English** (default): `/tornado3/index.html` or `/tornado3/?lang=en`
- **Portuguese**: `/tornado3/?lang=pt`

### How to Add/Update Content

1. Edit the JSON files in `/data/` folder:
   - `tornado3.json` for English
   - `tornado3_pt.json` for Portuguese

2. Content structure includes:
   - Meta information (SEO, titles)
   - Hero section (title, tagline, trailer)
   - Features (7 feature cards)
   - Game modes (3 modes)
   - Tornado types (Wind, Fire, Ice, etc.)
   - About section
   - Social links
   - Footer

### Adding a New Language

1. Create a new JSON file: `data/tornado3_[language_code].json`
2. Copy structure from `tornado3.json` and translate all content
3. Update `supportedLanguages` array in `tornado3.js`
4. Add language toggle option in navigation

## 📱 Responsive Design

The page is fully responsive with breakpoints at:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

Features:
- Mobile-first approach
- Touch swipe support for gallery
- Optimized for all screen sizes
- Reduced motion support
- High contrast mode support
- Print-friendly styles

## 🚀 Performance Optimizations

- DNS prefetching for external resources
- Preconnect to external domains
- Resource preloading (critical CSS, JS, main image)
- Lazy loading for screenshots
- Image optimization via browser native lazy loading
- Intersection Observer for scroll animations
- Performance monitoring built-in

## 🎮 Features

### Interactive Elements
- **Screenshot Gallery**: Click any screenshot to open fullscreen modal
  - Keyboard navigation (arrows, ESC)
  - Touch swipe support
  - Previous/Next buttons
- **Language Toggle**: Seamless switching between EN/PT
- **Smooth Scrolling**: Internal anchor links
- **Store Buttons**: Direct links to App Store & Google Play
- **Social Links**: Instagram, YouTube
- **Contact Form**: Email integration

### Sections
1. **Hero Section**
   - Game title with gradient effects
   - Embedded YouTube trailer
   - Download buttons for iOS/Android
   
2. **Features Section**
   - 7 feature cards with icons
   - Hover animations
   
3. **Game Modes Section**
   - 3 game mode cards
   - Gradient background with wave divider
   
4. **Screenshots Gallery**
   - 6 screenshots in responsive grid
   - Modal viewer with navigation
   
5. **About Section**
   - Game description
   - Key highlights
   - Tornado types showcase
   
6. **Social & Contact Section**
   - Social media links
   - Contact email button
   
7. **Footer**
   - Legal links (Privacy, Terms)
   - Copyright information
   - Social icons

## 🔗 Important Links

- **App Store**: https://apps.apple.com/us/app/id6753775427
- **Google Play**: https://play.google.com/store/apps/details?id=com.CrossBlack.Tornado3
- **YouTube Trailer**: https://youtu.be/OJDynpSvKDU
- **Privacy Policy**: /privacy-tornado-io-3.html
- **Terms of Service**: /terms-tornado-io-3.html
- **Portfolio**: /index.html

## 📧 Contact

- **Email**: crossblackstudios@gmail.com
- **Instagram**: https://www.instagram.com/crossblackstudios/
- **YouTube**: https://www.youtube.com/@JCMStudiosOfficial

## 🛠️ Maintenance

### Updating Screenshots
1. Place new images in `tornado3/assets/images/`
2. Update references in JSON files
3. Recommended format: JPG or WebP
4. Recommended size: 1920x1080 or similar 16:9 aspect ratio

### Updating Trailer
1. Upload new video to YouTube
2. Get embed URL (with /embed/ in the path)
3. Update `trailerUrl` in JSON files

### Updating Store Links
1. Edit JSON files
2. Update `appStoreUrl` and `googlePlayUrl` properties

### Adding New Features
1. Add feature object to `features.items` array in JSON
2. Include: icon (emoji), title, description
3. Page will automatically render new feature

### Adding New Game Mode
1. Add mode object to `gameModes.modes` array in JSON
2. Include: name, icon, type, description, highlight
3. Page will automatically render new mode

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Analytics & Monitoring

The page includes:
- Performance timing monitoring
- Page load time logging
- Visibility change detection
- Error handling and logging

Check browser console for performance metrics and debugging information.

## 🎨 Design Inspiration

This page follows the design principles of:
- **Supercell's Brawl Stars**: Vibrant colors, energetic feel
- **Mobile-first gaming**: Optimized for touch and mobile viewing
- **Modern web design**: Clean layouts, smooth animations

## 🔧 Technical Details

- **No Build Process**: Pure HTML, CSS, JavaScript
- **No Dependencies**: Vanilla JS, no frameworks
- **JSON-Driven**: Easy content updates
- **SEO Optimized**: Meta tags, OpenGraph, structured data
- **Accessibility**: ARIA labels, keyboard navigation, screen reader friendly

## 📝 License

© 2025 CrossBlack Studios. All rights reserved.
Developed by João de Carvalho Milone.

---

**Last Updated**: November 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready

