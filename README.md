# IMTEKKU - Ikatan Mahasiswa Telkom University Kuningan

IMTEKKU (Ikatan Mahasiswa Telkom University Kuningan) is a professional student organization web application. This repository contains the modernized front-end application rebuilt from static HTML/CSS/JS into a scalable Single Page Application (SPA) using React and Vite.

## 🚀 Features

- **Dynamic Routing:** Client-side navigation using React Router DOM for a seamless, flicker-free experience.
- **Component-Based Architecture:** Modular design with isolated React components (Navbar, Footer, Pages, Admin Modals).
- **Interactive UI/UX:** Scroll reveal animations, 3D tilt effects on cards, and responsive mobile-friendly layouts.
- **Data Synchronization:** Integrated state management mirroring the previous Firebase/localStorage sync logic using a custom `AppUtils` module.
- **Admin Dashboard:** Fully functional embedded administrative panel to manage:
  - Recruitment applications & applicant data
  - Organization structure (Organizational Core & Divisions)
  - Activity galleries & archives
  - Global site settings (Careers open/close, Homepage gallery toggle)

## 🛠️ Technology Stack

- **Core Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router v7
- **Styling:** Vanilla CSS (Modular Page-specific Styles)
- **Data Persistence:** LocalStorage API & Custom Cloud Sync (`AppUtils`)

## 📂 Project Structure

```text
imtekku1/
├── public/
│   ├── img/                 # Static images, logos, and icons
│   └── js/                  # Legacy admin integration scripts
├── src/
│   ├── assets/
│   │   └── css/             # Scoped CSS for pages and core components
│   ├── components/          # Reusable UI components (Navbar, Footer, ScrollReveal)
│   ├── pages/               # Main application routes (Home, Divisi, Galeri, dll)
│   ├── utils/               # Helper modules (AppUtils data bridge)
│   ├── App.jsx              # Application router and layout wrapper
│   └── main.jsx             # React DOM entry point
├── legacy/                  # Archived static HTML/CSS files for reference
├── index.html               # Main HTML template injected by Vite
├── package.json             # NPM dependencies and scripts
└── vite.config.js           # Vite configuration
```

## 💻 Running Locally

To run the application on your local machine, follow these steps:

1. **Install Dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *The server will start, usually accessible at `http://localhost:5173`.*

3. **Build for Production**
   To compile and minify the application for production deployment:
   ```bash
   npm run build
   ```
   *The output will be generated in the `dist/` directory.*

## 🔒 Administrative Access

To access the admin dashboard, click the "ADMIN LOGIN" link located in the footer of the site.

*(Note: These credentials trigger the local `adminLoggedIn` state which grants access to the `/admin` route).*

## 📖 Migration Note

This project was recently migrated from a multi-page static HTML setup. The old files have been preserved in the `legacy/` directory for historical reference and backup purposes but are no longer active in the production build.
