okc# Aplikasi Penilaian Kinerja RT/RW

Ini adalah aplikasi Next.js untuk melacak dan menilai kinerja pengurus RT dan RW.

## Menjalankan Aplikasi Secara Lokal (Web)

Untuk memulai server development, jalankan perintah berikut:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Menjalankan Aplikasi di Android

Aplikasi ini dikonfigurasi untuk dapat dijalankan sebagai aplikasi Android menggunakan Capacitor.

### Prasyarat

- Pastikan Anda telah menginstal [Android Studio](https://developer.android.com/studio) dan JDK.
- Pastikan `npx` (yang datang bersama npm) terinstal.

### Langkah-langkah Build

1.  **Bangun Aplikasi Web dan Sinkronkan dengan Android**:
    Perintah ini akan membangun versi statis dari aplikasi Next.js Anda dan menyalin semua aset web yang diperlukan ke dalam proyek Android.

    ```bash
    npm run android:sync
    ```
    
    Jika Anda ingin menggabungkan build dan membuka Android Studio dalam satu langkah, gunakan:
    ```bash
    npm run android:build
    ```

2.  **Buka Proyek di Android Studio**:
    Perintah ini akan membuka proyek Android di Android Studio.

    ```bash
    npm run android:open
    ```

3.  **Jalankan Aplikasi di Android Studio**:
    - Setelah Android Studio terbuka, tunggu hingga proses Gradle sync selesai.
    - Anda bisa menjalankan aplikasi di emulator Android atau perangkat fisik yang terhubung.
    - Klik tombol **Run 'app'** (ikon play berwarna hijau) di toolbar Android Studio.

4.  **Membuat APK**:
    - Di Android Studio, pilih menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
    - Setelah proses build selesai, Anda akan menemukan file APK di `android/app/build/outputs/apk/debug/app-debug.apk`.
    - File APK ini dapat Anda instal di perangkat Android mana pun.

## Hosting di Firebase (Web)

Aplikasi ini juga dikonfigurasi untuk di-deploy menggunakan **Firebase Hosting**.

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

3.  **Deploy ke Firebase Hosting:**
    Untuk men-deploy aplikasi Anda ke web, jalankan perintah berikut:
    ```bash
    firebase deploy
    ```
    Perintah ini akan membangun aplikasi Next.js Anda untuk production dan men-deploy-nya. Setelah selesai, CLI akan memberikan Anda URL publik tempat aplikasi Anda dapat diakses.
