# Fixit — Blog Pribadi dengan Firebase

Blog pribadi untuk menuliskan keresahan dan perjuangan apa pun (gagal berkali-kali, terus mencoba, akhirnya berhasil). Bisa tulis/edit/hapus cerita langsung dari browser, data tersimpan di **Firebase Firestore** (cloud, gratis).

## Stack

- [Next.js](https://nextjs.org) (App Router) + React
- Firebase Firestore (database)
- Deploy gratis di [Vercel](https://vercel.com)

## Persyaratan

- Node.js 18+ (di Termux: `pkg install nodejs-lts`)
- Akun Google untuk Firebase
- Akun Vercel (atau pakai `npx vercel` CLI)

---

## 1. Setup Firebase

1. Buka <https://console.firebase.google.com> → **Add project** → beri nama (mis. `fixit`) → buat project.
2. Di dashboard project, klik ikon **</>** (Web) untuk menambah aplikasi web.
3. Isi nama aplikasi, klik **Register app**.
4. Firebase menampilkan konfigurasi web. Salin nilainya (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
5. Di menu kiri → **Build → Firestore Database** → **Create database**.
   - Pilih mode **production** (atau test mode untuk sementara).
   - Pilih lokasi terdekat (mis. `asia-southeast2` / Jakarta).
6. Salin nilai konfigurasi ke file `.env` di proyek:

```bash
cp .env.example .env
```

Isi `.env`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dimonitor-1c806.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dimonitor-1c806
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dimonitor-1c806.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# opsional, hanya kalau mau pakai Firebase Analytics
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxx
```

> **Catatan penting:** Next.js hanya mengekspos env vars ber-prefix `NEXT_PUBLIC_` ke browser — prefix lain **tidak** terbaca di komponen client. Saat mengisi Environment Variables di Vercel, gunakan nama `NEXT_PUBLIC_FIREBASE_*` (bukan `VITE_*`/`PUBLIC_*`).
>
> **Penting:** jangan commit `.env`. Sudah ada di `.gitignore`.
>
> **Jangan tempel mentah snippet dari Firebase Console.** Snippet bawaan Console (`const firebaseConfig = { apiKey: "..." }` + `getAnalytics(app)`) meng-hardcode kredensial ke source code dan memanggil Analytics di level modul — di Next.js itu bikin error saat SSR. Nilainya cukup dipindah ke `.env`, lalu biarkan `lib/firebase.js` yang membacanya. Analytics sudah di-handle di sana secara lazy (browser saja) lewat `getAnalyticsClient()`.

## 2. Atur Firestore Rules

Agar tidak sembarang orang bisa menulis/menghapus ceritamu, atur rules berikut.

**Opsi A — development / tes, tanpa login** (yang jalan dengan kode saat ini):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{id} {
      allow read: if true;
      allow create, delete: if true;
    }
  }
}
```

> ⚠️ Konsekuensinya: siapa pun yang tahu URL bisa menulis **dan menghapus** cerita. Untuk sekadar tes, lebih aman pakai **test mode** bawaan Firebase (rules `if true` yang otomatis kedaluwarsa), lalu ganti ke Opsi B sebelum dipakai serius.

**Opsi B — bebas baca, tulis harus terautentikasi** (recommended untuk production):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{id} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

> **Syarat wajib Opsi B:** nyalakan **Anonymous Auth** di Firebase Console → **Build → Authentication → Sign-in method → Anonymous → Enable**, lalu panggil `signInAnonymously()` dari aplikasi saat pertama kali load. Tanpa itu semua operasi tulis akan gagal dengan `FirebaseError: permission-denied` / *Missing or insufficient permissions*, karena aplikasi ini sekarang belum punya alur login. Jadi: belum mau tambah auth → pakai **Opsi A**.

Cara pasang rules: menu **Firestore Database → Rules** → tempel → **Publish**.

## 3. Jalankan Lokal (di Termux)

```bash
pkg install nodejs-lts
cd ~/personal-story
npm install
npm run dev
```

Buka `http://localhost:3000` di browser (gunakan termux-url-opener / browser).

## 4. Deploy ke Vercel

### Opsi A — Via CLI (paling cepat)

```bash
npm install -g vercel
npx vercel login
npx vercel
```

- Ikuti prompt: link ke project Vercel (buat baru).
- Saat diminta env vars, tambahkan 6 variabel `NEXT_PUBLIC_FIREBASE_*` dari `.env`.
- Setelah sukses, buka URL yang diberikan.

Untuk update berikutnya:

```bash
npx vercel --prod
```

### Opsi B — Via Git + Dashboard

1. Install git: `pkg install git`, buat repo di GitHub, lalu:

```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/USER/fixit.git
git push -u origin main
```

2. Buka <https://vercel.com/new> → **Import** repo → **Environment Variables**: tambahkan 6 variabel `NEXT_PUBLIC_FIREBASE_*`.
3. Klik **Deploy**.

---

## Struktur Proyek

```
fixit/
├── .env.example              # template kredensial Firebase
├── next.config.mjs           # config Next.js
├── public/favicon.svg
├── app/
│   ├── layout.js             # layout utama (header, footer)
│   ├── page.js               # halaman utama
│   └── globals.css           # gaya global (tema terminal/CRT)
├── components/
│   ├── StoryApp.jsx      # pemisah konfigurasi vs editor
│   ├── StoryEditor.jsx   # form tulis cerita
│   └── StoryList.jsx     # timeline cerita (real-time)
└── lib/firebase.js       # init Firebase
```

## Fitur

- Tulis / hapus cerita langsung di web (real-time)
- Data tersimpan di Firebase (aman dari ganti browser/HP)
- Dark mode otomatis, mobile-friendly
- Template kerangka cerita universal (pendahuluan → kegagalan → titik balik → berhasil)

## Catatan

- Tanpa Firebase Auth, siapa pun yang punya akses URL bisa menulis cerita. Untuk penggunaan pribadi, aktifkan Anonymous Auth + rules `request.auth != null` pada step 2.
- Jika `.env` kosong, halaman menampilkan pesan "Firebase belum dikonfigurasi".
