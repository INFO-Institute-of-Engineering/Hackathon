# INFOMEISTER Hackathon 2025 🚀

A visually striking, highly animated, mobile-responsive landing page for the INFOMEISTER Hackathon 2025 organized by the CSE Association Club of INFO Institute of Engineering.

## ✨ Features

### 🎨 Design & Animations
- **Futuristic Theme**: Dark backgrounds with neon gradients (cyan, magenta, yellow)
- **Particle System**: Interactive background particles that respond to mouse movement
- **Advanced Animations**: Typing effects, scroll reveals, glowing elements, and hover interactions
- **Mouse Interactions**: Custom cursor, parallax effects, and magnetic button animations
- **Smooth Transitions**: Seamless section transitions and element reveals

### 📱 Responsive Design
- **Mobile-First**: Optimized for all devices (desktop, tablet, mobile)
- **Touch-Friendly**: Enhanced touch interactions for mobile users
- **Adaptive Layout**: Flexible grid and flexbox layouts that work on any screen size
- **Performance Optimized**: Reduced animations on slower devices and respects motion preferences

### 🏗️ Sections

1. **Hero Section**
   - Dynamic typing effect for "INFOMEISTER"
   - Animated particle background
   - Prominent glowing "Register Now" button
   - Scroll indicator with bounce animation

2. **About Section**
   - Three feature cards (Innovation, Collaboration, Challenge)
   - Floating icon animations
   - Grid layout with hover effects

3. **Timeline Section**
   - Animated roadmap with three rounds
   - Glowing timeline connectors
   - Scroll-triggered card animations
   - Mobile-optimized timeline layout

4. **Prizes Section**
   - Three animated prize cards with hover lift effects
   - Winner card (1st place) with special styling
   - Rotating glow animations
   - Prize amounts: ₹10,000, ₹5,000, ₹2,500

5. **Call-to-Action Section**
   - Duplicate registration button
   - Ripple click effects
   - Secondary "Learn More" button

6. **Footer**
   - Institute information
   - Responsive link layout

## 🚀 Quick Start

### Option 1: Simple File Opening
1. Download all files (`index.html`, `styles.css`, `script.js`)
2. Open `index.html` in any modern web browser
3. Enjoy the interactive experience!

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have it)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Advanced animations, gradients, and responsive design
- **Vanilla JavaScript**: Interactive features and particle system
- **Google Fonts**: Orbitron (headers) and Exo 2 (body text)

## 📋 Event Details

- **Event**: INFOMEISTER Hackathon 2025
- **Duration**: 8 hours
- **Organizer**: CSE Association, INFO Institute of Engineering

### Competition Rounds:
1. **Round 1**: BRD Documentation (20-26 Sept, Results: 28 Sept)
2. **Round 2**: UI/UX Design (29 Sept - 4 Oct, Results: 7 Oct)
3. **Round 3**: Coding & Presentation (7-16 Oct, Results: 17 Oct)

### Prizes:
- 🏆 **1st Prize**: ₹10,000
- 🥈 **2nd Prize**: ₹5,000
- 🥉 **3rd Prize**: ₹2,500

## 🎯 Features Breakdown

### Animations & Effects
- **Particle Canvas**: Interactive background with 50-100 particles
- **Mouse Follower**: Custom cursor with hover state changes
- **Typing Effect**: Character-by-character typing animation
- **Scroll Reveals**: Elements animate in as you scroll
- **Card Tilts**: 3D tilt effects on hover
- **Button Magnetics**: Buttons follow mouse movement slightly
- **Timeline Pulses**: Markers pulse and glow when in view
- **Prize Rotations**: Icons rotate with color shifting

### Performance Optimizations
- **Throttled Scroll**: Optimized scroll event handling
- **Reduced Motion Support**: Respects accessibility preferences
- **Mobile Optimized**: Fewer particles and simplified animations on mobile
- **Error Handling**: Graceful degradation if features fail

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Fallbacks**: CSS fallbacks for older browser support

## 🔧 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-neon: #00ffff;    /* Cyan */
    --secondary-neon: #ff00ff;  /* Magenta */
    --tertiary-neon: #ffff00;   /* Yellow */
}
```

### Particle Count
Modify in `script.js`:
```javascript
const particleCount = window.innerWidth < 768 ? 50 : 100;
```

### Registration Link
Update the href in `index.html`:
```html
<a href="YOUR_REGISTRATION_LINK_HERE" class="cta-button primary">
```

## 📱 Mobile Experience

The landing page is specifically optimized for mobile devices with:
- **Responsive Typography**: Text scales appropriately on all screens
- **Touch Interactions**: Proper touch targets (minimum 44px)
- **Performance**: Reduced particle count and simplified animations
- **Navigation**: Hamburger menu with smooth slide-in animation
- **Timeline**: Vertical layout optimized for scrolling

## 🌟 Accessibility

- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Motion Preferences**: Respects `prefers-reduced-motion` setting
- **Color Contrast**: High contrast ratios for text readability
- **Screen Readers**: Descriptive alt texts and labels

## 📄 License

This project is created for the INFOMEISTER Hackathon 2025. Feel free to use and modify for educational purposes.

## 🤝 Contributing

This is a hackathon landing page template. Feel free to:
- Report bugs or issues
- Suggest improvements
- Adapt for your own events
- Share feedback

---

**Built with ⚡ by the CSE Association, INFO Institute of Engineering**

*Ready to code the future? Join the hackathon!* 🚀
- 🎯 **Registration CTA**: Direct link to external registration form
- ⚡ **Performance Optimized**: Fast loading with CSS animations

## 🎯 Event Details

### Hackathon Structure
- **Duration**: 8 Hours of intensive coding
- **Rounds**: 3 competitive rounds
  1. **Round 1**: Ideation & Planning
  2. **Round 2**: Development Phase
  3. **Round 3**: Presentation & Demo

### Schedule
- **09:00 AM**: Registration & Welcome
- **10:00 AM**: Round 1 - Ideation
- **12:00 PM**: Lunch Break
- **01:00 PM**: Round 2 - Development
- **04:00 PM**: Round 3 - Presentations
- **05:00 PM**: Awards & Closing

### Venue
- **Location**: INFO Institute of Engineering
- **Address**: [View on Google Maps - embedded in website]

## 📁 Project Structure

```
frontend/
├── index.html          # Main landing page
├── css/
│   └── style.css      # All styles and animations
└── js/
    └── script.js      # Interactive functionality
```

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Hackathon
   ```

2. **Open the website**:
   - Simply open `frontend/index.html` in your web browser
   - Or use a local server for development:
     ```bash
     cd frontend
     python -m http.server 8000
     # Or use Live Server extension in VS Code
     ```

3. **View the site**:
   - Open `http://localhost:8000` in your browser

## 🎨 Design Features

### Color Scheme
- **Primary**: Cyan (#00ffff) - High-tech, futuristic
- **Secondary**: Magenta (#ff00ff) - Energy and creativity
- **Accent**: Electric Green (#00ff00) - Innovation
- **Background**: Dark gradients with blue undertones

### Animations
- **Glitch Effect**: Applied to main title for cyberpunk aesthetic
- **Particle System**: Floating animated particles in background
- **Smooth Scrolling**: Enhanced navigation experience
- **Hover Effects**: Interactive feedback on all elements

### Typography
- **Orbitron**: Futuristic font for headings
- **Rajdhani**: Modern sans-serif for body text

## � Customization

### Update Event Information
- Edit `frontend/index.html` to modify event details, schedule, and content
- Update the Google Maps embed URL in the location section

### Modify Styling
- Edit `frontend/css/style.css` to customize colors, animations, and layout
- All CSS variables are defined at the root for easy theming

### Update Registration Link
- Change the registration URL in `frontend/js/script.js` in the `handleRegistration` function

### Location Details
- Update the Google Maps embed and venue information in the location section of `index.html`

## 📱 Responsive Design

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px  
- **Mobile**: Below 768px

## 🌟 Key Animation Classes

```css
.glitch          /* Glitch text effect */
.float           /* Floating animation */
.pulse           /* Pulsing effect */
.slide-in        /* Slide in animation */
.fade-in         /* Fade in effect */
.bounce          /* Bouncing animation */
```

## 🌐 Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- CSS Grid and Flexbox support required

## 🛠️ Technologies Used

- **HTML5**: Semantic structure and modern elements
- **CSS3**: Advanced animations, Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: Interactive functionality and smooth animations
- **Google Maps**: Embedded location display

## ⚡ Performance Notes

- All assets are optimized for fast loading
- CSS animations use GPU acceleration
- Minimal JavaScript for better performance
- No external dependencies or frameworks

## 🚀 Deployment

This is a static website that can be deployed on any web hosting service:

- **GitHub Pages**: Perfect for hosting static sites
- **Netlify**: Drag and drop deployment
- **Vercel**: One-click deployment
- **Firebase Hosting**: Google's hosting solution

### Example GitHub Pages Deployment
1. Push code to GitHub repository
2. Go to repository settings
3. Enable GitHub Pages from main branch
4. Your site will be available at `https://username.github.io/repository-name`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

For queries related to the hackathon:
- **Organization**: CSE Association Club, INFO Institute of Engineering
- **Website**: [Registration Link - External Form]

## 🎉 Credits

**INFOMEISTER Hackathon 2025**
- **Organizer**: CSE Association Club
- **Institution**: INFO Institute of Engineering
- **Target Audience**: Tech-savvy developers and innovators

---

**Ready to code your future? Join INFOMEISTER Hackathon 2025! 🚀**