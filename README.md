# StudentHub — Premium SaaS-Style Student Platform

> "One Platform. Endless Opportunities."

StudentHub is a premium, high-fidelity dashboard built exactly like a professional software company project. It operates purely on **HTML5, CSS3, and Vanilla JavaScript**, following modular design guidelines (no frameworks, no third-party code duplication).

---

## 📂 Project Architecture

```
StudentHub/
│
├── index.html                  # Main SaaS Dashboard & Global search hub
│
├── css/
│   ├── variables.css           # Design tokens, themes (light/dark HSL mapping)
│   ├── global.css              # Custom scrollbars, resetting rules, typography (Jakarta)
│   ├── animations.css          # Spotlight coordinates trackers, skeleton loaders
│   ├── utilities.css           # Button variations, inputs, grid systems
│   ├── theme.css               # Blur ambient backing blobs, models overlay configurations
│   └── responsive.css          # Responsive styling overrides (mobile, tablet, laptop)
│
├── js/
│   ├── app.js                  # Initialization, loading overlays, ambient canvas shapes
│   ├── animations.js           # Count-up trackers, mouse coordinate spotlight shines
│   ├── search.js               # Fuzzy matching engines mapping multiple databases
│   ├── sidebar.js              # Injectable responsive sidebar logic
│   ├── navbar.js               # Dynamic headers, theme switchers, notification alerts
│   ├── api.js                  # Fetch endpoints with automatic CORS offline backups
│   ├── utils.js                # SVG vector icons mapper, layout transitions
│   └── data.js                 # StorageManager local storage wrappers, fallback databases
│
├── data/
│   ├── scholarships.json       # High-quality mock scholarships
│   ├── internships.json       # Verified internship openings
│   ├── courses.json           # Free online courses with certifications details
│   └── roadmaps.json          # Multi-stage learning blueprints for 10 careers
│
└── pages/
    ├── scholarships/          # Scholarship finder cards grid (dynamic filter + bookmark)
    ├── internships/           # Corporate entry positions cards list (skills badges)
    ├── free-courses/          # Courses list with certificate badge alerts
    ├── career-roadmaps/       # Flowcharts displaying 10 interactive learning stages
    ├── resume-builder/        # Real-time text sync template editor with print-export CSS
    ├── ai-career-assistant/   # Chat panels generating reply templates + matcher wizard
    ├── profile/               # Bookmark grids, learning logs, and completed certs
    ├── notifications/         # Real deadline lists
    ├── settings/              # Color accents toggles and reminder settings
    ├── login/                 # Centered form panel with loading redirects
    └── signup/                # Account registration wizard
```

---

## 🎨 Premium Aesthetics System

StudentHub features premium interface designs styled after **Apple**, **Stripe Dashboard**, **Linear.app**, and **Vercel**:
1. **Interactive Spotlight Glows**: Shines radial gradients centering on the mouse cursor over glassmorphic surfaces.
2. **Ambient Blurry Blobs**: Soft colorful background shapes glowing and rotating behind elements.
3. **Count-Up Stat Widgets**: Dynamic count-ups displaying student logs upon dashboards launching.
4. **Clean Print Vector Support**: Real-time resume builders fitting perfectly on single A4 vector PDFs when calling standard print modes.
