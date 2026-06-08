# Deploy Web + Sync Data Antar Device

## 1) Buat Project Firebase
1. Buka Firebase Console.
2. Buat project baru.
3. Enable `Realtime Database` (mode test dulu saat setup awal).

## 2) Set URL Database di project ini
1. Buka file `assets/js/core/app-utils.js`.
2. Cari:
   - `databaseUrl: 'https://YOUR_FIREBASE_DATABASE_URL'`
3. Ganti dengan URL Realtime Database kamu.
   - Contoh: `https://imtekku-live-default-rtdb.asia-southeast1.firebasedatabase.app`

## 3) Atur Rules Realtime Database (minimum)
Untuk uji awal, bisa pakai:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Catatan: ini belum aman untuk production. Setelah live stabil, sebaiknya pakai Auth dan rules yang lebih ketat.

## 4) Deploy Hosting Firebase
Jalankan di folder project ini:

```powershell
npm install -g firebase-tools
firebase login
Copy-Item .firebaserc.example .firebaserc
```

Lalu edit `.firebaserc` dan isi `YOUR_FIREBASE_PROJECT_ID`.

Deploy:

```powershell
firebase deploy --only hosting
```

## 5) Hasil
- Website online di URL Firebase Hosting.
- Data admin (anggota, divisi, gallery, pengaturan) tersimpan di cloud database.
- Update dari admin di device mana pun akan terlihat di device lain saat buka web.
