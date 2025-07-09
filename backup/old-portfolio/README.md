# Old Portfolio Files - Backup

This folder contains the original portfolio files that were replaced by the new modern design.

## Files Moved to Backup (July 9, 2024)

### Original Files
- `index.html` - Original portfolio HTML file using Strata template
- `debug.html` - Original debug panel for testing the old portfolio
- `main.css` - Original CSS file (was in `assets/css/main.css`)
- `portfolio.js` - Original JavaScript file (was in `assets/js/portfolio.js`)

### Original Design Features
- **Template**: Based on "Strata" template with teal accent color (#49bf9d)
- **Layout**: Single column layout with gallery-style project display
- **Language Support**: Bilingual (English/Portuguese) with automatic detection
- **Data Source**: JSON files (`data/portfolio.json`, `data/portfolio_pt.json`)
- **Image Display**: Used Poptrox library for image galleries

### New Design (Current)
The new portfolio features:
- **Modern Design**: Dark theme with pink-to-purple gradients (#ff4081 to #9c27b0)
- **Responsive Layout**: Adaptive sidebar layout for desktop, stacked for mobile
- **Enhanced Features**: Improved image modal, better mobile experience, performance monitoring
- **Same Data Structure**: Compatible with existing JSON data files
- **Modern Typography**: SF Pro Display/Text fonts with improved readability

## Restoration
If you need to restore the old portfolio:
1. Replace current `index.html` with `backup/old-portfolio/index.html`
2. Replace current `assets/css/main.css` with `backup/old-portfolio/main.css`
3. Replace current `assets/js/portfolio.js` with `backup/old-portfolio/portfolio.js`
4. Replace current `debug.html` with `backup/old-portfolio/debug.html`

## Notes
- All image assets remain in the same location (`images/` folder)
- JSON data files are unchanged and compatible with both versions
- The new design maintains all original functionality while adding modern features 