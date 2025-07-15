# Aplikasi Penilaian Kinerja RT/RW

Ini adalah aplikasi Next.js untuk melacak dan menilai kinerja pengurus RT dan RW.

## Menjalankan Aplikasi Secara Lokal

Untuk memulai server development, jalankan perintah berikut:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Hosting di Firebase

Aplikasi ini dikonfigurasi untuk di-deploy menggunakan Firebase App Hosting.

1.  **Install Firebase CLI:**
    Jika Anda belum menginstalnya, install Firebase CLI secara global dengan perintah:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login ke Firebase:**
    Login ke akun Google Anda melalui CLI:
    ```bash
    firebase login
    ```

3.  **Inisialisasi Firebase (jika belum):**
    Jika proyek ini belum terhubung dengan Firebase, jalankan perintah berikut di root direktori proyek Anda dan ikuti petunjuknya. Pastikan untuk memilih project Firebase yang benar.
    ```bash
    firebase init
    ```

4.  **Deploy ke App Hosting:**
    Untuk men-deploy aplikasi Anda ke web, jalankan perintah berikut:
    ```bash
    firebase apphosting:backends:deploy
    ```
    Perintah ini akan membangun aplikasi Next.js Anda untuk production dan men-deploy-nya. Setelah selesai, CLI akan memberikan Anda URL publik tempat aplikasi Anda dapat diakses.

