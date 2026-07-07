# Step 15 - Professional Design Reset Audit

## Problem yang ditemukan

1. CSS terlalu banyak tambalan dari Step 6 sampai Step 14 sehingga terjadi konflik style.
2. Homepage terlalu banyak informasi dan kehilangan hierarchy.
3. Simbol Unicode/emoji menyebabkan risiko karakter aneh di beberapa browser mobile.
4. Floating WhatsApp menutup konten mobile.
5. Banner hero dinamis terlalu bergantung pada gambar upload sehingga tampilan mudah rusak jika rasio gambar tidak ideal.
6. Konten panduan GrabMerchant terlalu berat jika dipaksa masuk homepage.

## Solusi Step 15

1. Homepage di-reset ke struktur baru yang bersih.
2. Homepage memakai file CSS/JS independen:
   - assets/css/pro-home.css
   - assets/js/pro-home.js
3. Konten panduan dipindahkan ke panduan-grabmerchant.html.
4. Floating WhatsApp dihilangkan dari homepage; kontak tetap tersedia di section kontak.
5. Mobile sticky CTA hanya berisi Daftar Gratis dan Merchant Baru.
6. Dynamic content tetap jalan dari Google Sheet:
   - pengumuman
   - merchant_baru
   - faq
   - kontak
7. Form daftar tetap menggunakan daftar.html yang sudah support Google Sheet + email PIC.

## File yang perlu diupload

- index.html
- panduan-grabmerchant.html
- assets/css/pro-home.css
- assets/js/pro-home.js

