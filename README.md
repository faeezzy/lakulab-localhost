# LakuLab untuk localhost

Prototipe frontend dengan desain ungu, lime, ivory, dan teks hijau tua yang sudah direvisi. Semua aset font, logo, ikon, GSAP, dan ScrollTrigger disertakan sebagai file lokal.

## Menjalankan

1. Buka terminal di folder `lakulab-localhost`.
2. Jalankan `npm run dev` atau `node server.mjs`.
3. Buka **http://localhost:3000** di browser.

Tidak perlu `npm install`. Perintah di atas membutuhkan Node.js. Di Windows, kamu juga bisa klik dua kali `start.bat`, lalu buka alamat yang ditampilkan.

Jika port 3000 sudah dipakai:

```sh
node server.mjs --port 3001
```

Alternatif tanpa Node.js: buka `index.html` dengan Live Server di VS Code. Jika Python sudah terpasang, jalankan `python -m http.server 3000 --bind 127.0.0.1` dari folder ini. Di Windows, perintah Python juga bisa berupa `py -m http.server 3000 --bind 127.0.0.1`.

## Yang bisa dicoba

- Landing page dengan animasi GSAP dan gerakan parallax pada ilustrasi.
- Sidebar dan seluruh tampilan: Beranda, Dashboard, Kampanye, Calon pembeli, Vendor & simulasi, dan Laporan.
- Menu yang menyesuaikan ukuran layar HP.
- Validasi formulir kampanye dan pesan rancangan.
- Delapan kategori produk: tote bag, kaos, hoodie/sweater, topi, tumbler, mug, stiker, dan notebook. Pilihan produk kustom menyediakan kolom kategori sendiri.
- Contoh nama, harga, dan sasaran pembeli menyesuaikan kategori. Nilai yang sudah kamu edit tetap dipertahankan ketika kategori diganti. Seluruh harga contoh adalah asumsi, bukan hasil riset pasar.
- Simulator modal, stok tersisa, penerimaan skenario, serta selisih penerimaan dan biaya.
- Preferensi pengurangan gerakan melalui pengaturan aksesibilitas perangkat.

## Cakupan prototipe

Ini adalah frontend lokal dengan data contoh. Formulir belum menerbitkan kampanye atau menyimpan data ke database. Daftar calon pembeli dan laporan masih merupakan contoh tampilan. Input simulasi diproses di browser dan kembali ke nilai awal ketika halaman dimuat ulang. Tidak ada login, integrasi pembayaran, atau pengiriman data ke server.

Reservasi gratis dan konfirmasi minat tidak dianggap sebagai penjualan. Jumlah terjual dalam simulator adalah asumsi skenario. Perhitungan belum memasukkan biaya lain yang tidak diisi pengguna.

## Struktur file

- `index.html`: struktur tampilan.
- `assets/styles.css`: warna, tata letak, font, dan aturan responsif.
- `assets/app.js`: navigasi, interaksi formulir, simulasi, dan animasi.
- `assets/vendor/`: GSAP 3.13.0, ScrollTrigger 3.13.0, dan Lucide.
- `assets/fonts/`: DM Sans dan Manrope yang dipakai tampilan.
- `assets/logo-lakulab.png`: logo transparan.
- `server.mjs`: server statis lokal menggunakan modul bawaan Node.js.
- `licenses/`: lisensi dependensi pihak ketiga.

Tidak ada proses build, akun hosting, atau konfigurasi kunci API yang diperlukan.
