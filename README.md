# LakuLab (localhost)

Web app frontend untuk menguji minat calon pembeli, membandingkan vendor, dan menghitung modal produksi pertama. Memakai GSAP + ScrollTrigger dan Lucide (lokal) untuk animasi 3D, scroll, dan ikon.

## Menjalankan
1. Ekstrak ZIP, buka terminal di folder `lakulab-localhost`.
2. Jalankan `npm run dev` atau `node server.mjs` (tanpa `npm install`).
3. Buka http://localhost:3000. Di Windows bisa klik dua kali `start.bat`.
4. Port bentrok: `node server.mjs --port 3001`.

## Isi
- Halaman depan: panggung 3D (CSS 3D + GSAP) berisi 30 kubus = 30 unit produksi, berubah per langkah saat digulir (ScrollTrigger). Tilt mengikuti kursor. Lalu kalkulator mini dengan slider, perbandingan dengan formulir+spreadsheet, paket, tanya jawab.
- Aplikasi: stepper 6 tahap (Rancangan, Minat, Vendor, Simulasi, Keputusan, Laporan) dengan tombol lanjut/kembali di tiap halaman.
- Ringkasan: KPI, meter konfirmasi ulang vs titik impas dan kriteria, checklist tahapan.
- Rancangan uji: produk, harga uji, sasaran, durasi, target reservasi, kriteria sukses. Pratinjau halaman penawaran dengan persetujuan data.
- Calon pembeli: angka funnel, visual funnel dengan garis titik impas, daftar contoh.
- Vendor: tabel perbandingan sampai 4 vendor, total modal, DP, dan titik impas per vendor.
- Simulasi: 3 skenario, titik impas, perkiraan pembeli, DP sebelum produksi, pelunasan.
- Keputusan: Lanjut, Sesuaikan, atau Tunda dari aturan terbuka, plus pemeriksaan dan saran vendor.
- Laporan: lembar mentoring (rekomendasi, bukti minat, biaya, asumsi). Cetak/PDF atau salin teks.
- Paket & harga: Individu Rp49.000/kampanye (30 hari), Institusi Rp1.500.000/program (25 tim, 3 bulan, onboarding).
- Untuk institusi: contoh rekap mentor semua tim (data fiktif).
- Isian tersimpan di localStorage. Versi sebelum redesign ada di `_backup-sebelum-redesign`.

## Cakupan
Tanpa backend, login, atau pembayaran. Halaman penawaran hanya pratinjau, dan daftar calon pembeli adalah contoh. Angka funnel diisi manual. Semua data awal adalah contoh, bukan riset pasar. Reservasi dan konfirmasi minat adalah sinyal permintaan, bukan penjualan.
