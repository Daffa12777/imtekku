# IMTEKKU — Ikatan Mahasiswa Telkom University Kuningan

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Sync-FFCA28?logo=firebase&logoColor=black)

Official web platform for **IMTEKKU** (Ikatan Mahasiswa Telkom University Kuningan), a student organization at Telkom University. The application was rebuilt from a static HTML/CSS/JS site into a modern, component-based **Single Page Application (SPA)** using React and Vite.

> **Catatan untuk pengurus berikutnya:** project ini adalah project komunitas yang diteruskan antar-angkatan. Kalau kamu mau melanjutkan, **jangan push ke repo ini** — buat repo sendiri dengan mengikuti bagian [Untuk Angkatan Selanjutnya](#-untuk-angkatan-selanjutnya-panduan-handover) di bawah.

---

## ✨ Features

- **Client-side routing** with React Router for fast, flicker-free navigation.
- **Component-based architecture** — reusable, isolated components (Navbar, Footer, ScrollReveal, page modules).
- **Interactive UI/UX** — scroll-reveal animations, card tilt effects, and a fully responsive mobile layout.
- **Recruitment module** — application form with file uploads (CV/PDF and applicant photos).
- **Admin dashboard** — manage recruitment data, organizational structure (core team & divisions), activity galleries, and global site settings (open/close careers, toggle homepage sections).
- **Data synchronization** — state persistence via IndexedDB with Firebase Realtime Database cloud sync.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build Tool | Vite |
| Routing | React Router v7 |
| Styling | Vanilla CSS (modular, page-scoped) |
| Local Data | IndexedDB (via `idb-keyval`) |
| Cloud Data | Firebase Realtime Database |

---

## 📂 Project Structure

```
imtekku/
├── public/
│   ├── img/            # Static images & logos
│   ├── js/             # Admin dashboard logic (admin-page.js)
│   └── _redirects      # Netlify SPA routing rule
├── src/
│   ├── assets/css/     # Page-scoped and core component styles
│   ├── components/     # Reusable UI (Navbar, Footer, ScrollReveal)
│   ├── pages/          # Routes (Home, TimInti, Divisi, Galeri, Rekrutasi, Admin)
│   ├── utils/          # ImtekkuStore (storage) + AppUtils (data & cloud sync)
│   ├── App.jsx         # Router and layout wrapper
│   └── main.jsx        # React DOM entry point
├── legacy/             # Archived static HTML for reference
└── vite.config.js      # Vite configuration
```

---

## 💻 Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) installed.

```bash
npm install      # install dependencies
npm run dev      # run dev server at http://localhost:5173
npm run build    # build for production (output in /dist)
```

---

## 🔄 Untuk Angkatan Selanjutnya (Panduan Handover)

Kalau kamu pengurus IMTEKKU periode berikutnya dan mau melanjutkan/mengelola web ini, **JANGAN melanjutkan langsung di repo ini.** Buat repo baru atas nama kamu sendiri supaya perubahanmu tidak masuk ke repo angkatan sebelumnya. Ikuti langkah berikut:

### 1. Buat repo kosong baru di GitHub
Login ke akun GitHub kamu → klik tombol **New** → beri nama (misal `imtekku`) → **JANGAN** centang "Add a README file" → **Create repository**. Salin URL-nya, contoh: `https://github.com/USERNAME-KAMU/imtekku.git`

### 2. Clone project ini & putuskan koneksi dari repo asli
```bash
git clone https://github.com/Daffa12777/imtekku.git
cd imtekku
```
Hapus folder `.git` agar tidak ada lagi sambungan ke repo asli:
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force .git

# macOS / Linux
rm -rf .git
```

### 3. Inisialisasi git baru & arahkan ke repo kamu
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME-KAMU/imtekku.git
git push -u origin main
```
Sekarang semua perubahanmu masuk ke repo kamu sendiri.

### 4. Pasang dependency & jalankan
```bash
npm install
npm run dev
```

### 5. Ganti Firebase ke milikmu sendiri ⚠️ (PENTING)
Data pendaftar, galeri, dan pengaturan disimpan di **Firebase Realtime Database**. Secara default URL-nya masih milik angkatan sebelumnya, jadi datanya akan tercampur. Agar datamu terpisah:

1. Buat project Firebase gratis di [console.firebase.google.com](https://console.firebase.google.com) → **Realtime Database** → **Create Database**.
2. Buka `src/utils/AppUtils.js`, cari `CLOUD_SYNC_CONFIG`, lalu ganti `databaseUrl` dengan URL database kamu:

```js
const CLOUD_SYNC_CONFIG = Object.freeze({
    databaseUrl: 'https://PROJECT-KAMU-default-rtdb.firebasedatabase.app/',
    rootPath: 'imtekkuData'
});
```

### 6. Ganti kredensial admin
Jangan pakai username/password admin bawaan. Ganti dengan milikmu sendiri di komponen login, dan **jangan menyimpan password di dalam repo publik.**

### 7. Deploy ke Netlify
Hubungkan repo kamu ke [Netlify](https://www.netlify.com), lalu set:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

File `public/_redirects` sudah disertakan agar routing halaman (`/rekrutasi`, `/admin`, dll) tidak error 404.

> **Tip GUI (lebih cepat):** kalau pemilik repo mengaktifkan opsi *Template repository* di Settings, kamu cukup klik tombol **"Use this template"** di GitHub untuk langsung membuat salinan ke akunmu — tanpa perlu hapus `.git` manual.

---

## 🚀 Deployment (Netlify)

This is an SPA, so the host must redirect all routes back to `index.html`. The included `public/_redirects` handles this:

```
/*    /index.html   200
```

Netlify settings: **Build command** `npm run build`, **Publish directory** `dist`.

---

## 🔒 Admin Access

The admin dashboard is reached via the **"Admin Login"** link in the site footer. Credentials are **not** stored in this repository — configure them privately and never commit secrets to version control.

---

## 📖 Background

This project was migrated from a multi-page static HTML site into a React SPA. The original files are preserved under `legacy/` for reference and are not part of the production build.

---

## 👤 Author

**Muhammad Daffa Fadlurrahman**
Telecommunications Engineering — Telkom University
GitHub: [@Daffa12777](https://github.com/Daffa12777)