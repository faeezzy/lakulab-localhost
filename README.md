# LakuLab (localhost)

Web app frontend untuk menguji minat calon pembeli, membandingkan vendor, dan menghitung modal produksi pertama. Memakai GSAP + ScrollTrigger (lokal) untuk animasi dan parallax.

## Menjalankan
1. Ekstrak ZIP, buka terminal di folder `lakulab-localhost`.
2. Jalankan `npm run dev` atau `node server.mjs` (tanpa `npm install`).
3. Buka http://localhost:3000. Di Windows bisa klik dua kali `start.bat`.
4. Port bentrok: `node server.mjs --port 3001`.

## Isi
- Beranda: ilustrasi animasi, parallax mengikuti kursor, orbit bergerak saat scroll.
- Sidebar: Beranda, Dashboard, Kampanye, Calon pembeli, Vendor & simulasi (tab Vendor, Simulasi, Keputusan), Laporan. Di HP sidebar menjadi menu geser.
- Vendor: bandingkan sampai 4 vendor (MOQ, harga, sampel, setup, ongkir, DP), modal terendah ditandai, peringatan MOQ vs konfirmasi minat.
- Simulasi: 3 skenario (pesimis, realistis, optimis), titik impas, konversi minat, kas puncak.
- Keputusan: Lanjut, Sesuaikan, atau Tunda dari aturan terbuka: konfirmasi ulang vs kriteria sukses dan titik impas.
- Laporan: cetak/PDF lewat dialog cetak browser, atau salin sebagai teks.
- Semua isian tersimpan di localStorage browser. Tombol "Reset ke contoh" memulihkan data awal.
- Mendukung prefers-reduced-motion.

## Cakupan
Tanpa backend, login, atau pembayaran. Halaman penawaran hanya pratinjau, dan daftar calon pembeli adalah contoh. Angka funnel diisi manual. Semua data awal adalah contoh, bukan riset pasar. Reservasi dan konfirmasi minat adalah sinyal permintaan, bukan penjualan.
