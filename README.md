# WebKelasTIREGC 🎓

Portal informasi resmi kelas Teknik Informatika - Reguler C (Semester 7) Universitas Muhadi Setiabudi (UMUS). Website statis ini dirancang sebagai pusat informasi terpadu untuk mempermudah mahasiswa dalam melacak jadwal perkuliahan, tugas harian, dan pengumuman penting secara *real-time*.

## ✨ Fitur Utama

* **Dashboard Statistik Interaktif:** Kalkulasi otomatis jumlah tugas (total, selesai, sisa) dan persentase *progress* penyelesaian tugas berdasarkan batas waktu (*deadline*).
* **Dynamic Hero Banner:** Tampilan *header* dinamis dengan *video background looping* dan animasi rotasi kata-kata mutiara seputar dunia IT.
* **Manajemen Data Terpusat:** Seluruh konten web (jadwal, tugas, pengumuman, profil) ditarik secara asinkron dari satu file `data.json`, memudahkan pembaruan tanpa perlu menyentuh kode HTML.
* **Jam & Tanggal Real-Time:** Penunjuk waktu presisi yang selalu berjalan saat web dibuka.
* **Desain Responsif & Modern:** Tampilan antarmuka yang dioptimalkan untuk perangkat seluler maupun *desktop*, dilengkapi dengan animasi transisi yang halus.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan pendekatan *Client-Side* murni untuk memastikan performa yang cepat dan kemudahan dalam *deployment*:

* **Struktur & Tampilan:** HTML5, CSS3, (Eksperimental: Tailwind CSS)
* **Logika & Interaktivitas:** Vanilla JavaScript (ES6+), Fetch API
* **Animasi DOM:** GSAP (GreenSock Animation Platform)
* **Database Mini:** JSON (`data.json`)
* **Hosting:** Mendukung GitHub Pages & Tencent Cloud EdgeOne Pages

## 📂 Struktur Direktori

```text
📦 WebKelasTIREGC
 ┣ 📂 img/               # Penyimpanan aset gambar (profil, dll) dan video background
 ┣ 📜 data.json          # Database utama (Jadwal, Tugas, Pengumuman, Identitas)
 ┣ 📜 index.html         # Halaman utama (Beranda & Dashboard Statistik)
 ┣ 📜 main.js            # Skrip utama (Fetch data, kalkulasi waktu, DOM manipulation)
 ┣ 📜 profil.html        # Halaman profil kelas dan developer
 ┣ 📜 style.css          # Kumpulan gaya visual dan layout
 ┣ 📜 tugas.html         # Halaman daftar tugas lengkap
 ┗ 📜 README.md          # Dokumentasi proyek
