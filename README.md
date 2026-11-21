# Mohammed Maideen - Frontend Developer Portfolio

A high-performance, responsive personal portfolio website for **Mohammed Maideen**, Frontend Developer experienced in building responsive, modern web applications with **React.js**, **JavaScript**, **Tailwind CSS**, and **Bootstrap**. Skilled in developing reusable UI components, integrating REST APIs and payment gateways, and optimizing performance for seamless user experiences.

---

## 🚀 Quick Start (Running Locally)

### Option 1: Built-in Node.js Server
Zero external dependencies required (uses built-in Node.js modules):

```bash
npm start
```
or
```bash
node server.js
```
Then open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

### Option 2: Direct Browser / Static Hosting
Open [index.html](file:///c:/Users/maide/OneDrive/Desktop/folio/index.html) directly:
- **VS Code Live Server**: Right-click `index.html` and select **Open with Live Server**.
- **Python**:
  ```bash
  python -m http.server 3000
  ```

---

## 📁 Project Structure

```text
folio/
├── index.html                  # Main portfolio single-page application
├── style.css                   # Custom theme styles & responsive enhancements
├── script.js                   # Interactive JS engine (preloader, menu, modals, sliders)
├── favicon.ico                 # Site favicon
├── assets/
│   ├── img/                    # Images, icons, logos, graphics
│   └── video/                  # MP4 showcase video (2.mp4)
├── style/                      # Theme styles
├── _next/
│   └── static/immutable/
│       ├── chunks/             # Core CSS stylesheets (Bootstrap, Fonts, Utilities)
│       └── media/              # FontAwesome & ValidThemes web fonts
├── server.js                   # Lightweight zero-dependency local runner
├── package.json                # Project scripts & config
└── README.md                   # Documentation
├── package.json                # NPM run scripts
└── README.md                   # Documentation
```

---

## ✨ Features
- **Clean Architecture**: No React or Next.js flight dependencies; 100% clean semantic HTML5, CSS3, and vanilla JS.
- **Interactive Components**:
  - Preloader with smooth fade-out.
  - Sticky header navigation with blur backdrop.
  - Offcanvas slide-out menu drawer.
  - Hero background office video (`autoplay loop muted playsinline`).
  - Giant glowing neon gradient headline ("RYNOX").
  - Service cards and tech experience grid.
  - Project showcase with high-res mockups.
  - Swiper customer testimonial slider with pagination.
  - Video popup modal with playback controls.
  - Continuous infinite marquee ticker banner.
  - Floating scroll-to-top button.
