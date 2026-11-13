# WebKelasTIREGC - Portal Informasi Akademik

WebKelasTIREGC adalah portal informasi resmi kelas Teknik Informatika - Reguler C (Semester 7) Universitas Muhadi Setiabudi (UMUS). Aplikasi web statis dengan kapabilitas dinamis ini dirancang sebagai pusat komando terpadu untuk menyederhanakan akses terhadap jadwal perkuliahan, manajemen tugas akademik, dan pengumuman krusial secara real-time.

## Fitur Utama

* **Sistem Manajemen Tugas Otomatis**
  Sistem mengekstrak data batas waktu (deadline) berformat string dari basis data dan membandingkannya dengan waktu sistem lokal secara real-time. Tugas kemudian diklasifikasikan secara otomatis ke dalam status "Aktif" atau "Selesai".
* **Pengurutan Tugas Algoritmik**
  Tugas yang berstatus aktif diurutkan secara dinamis untuk memprioritaskan tenggat waktu yang paling mendekati hari ini di posisi teratas. Tugas yang telah kedaluwarsa atau berstatus "Selesai" secara otomatis diberikan penyesuaian visual (redup) dan dipindahkan ke bagian paling bawah daftar.
* **Antarmuka Akordeon Interaktif**
  Repositori tugas utama menggunakan antarmuka akordeon (buka-tutup) modular untuk merender detail instruksi penugasan. Hal ini secara signifikan menghemat ruang tampilan layar dan meningkatkan ergonomi keterbacaan data.
* **Sinkronisasi Dasbor Analitik**
  Halaman beranda menampilkan dasbor statistik cerdas yang menghitung metrik secara real-time, meliputi total tugas, metrik penyelesaian, beban tugas berjalan, serta bilah kemajuan (progress bar) interaktif yang merepresentasikan pencapaian semester.
* **Widget Tugas Mendatang (Upcoming Tasks)**
  Halaman beranda terintegrasi penuh dengan algoritma evaluasi waktu pada halaman tugas, sehingga komponen "Tugas Upcoming" secara eksklusif hanya menampilkan maksimal dua tugas aktif yang paling mendesak.
* **Panel Admin Tanpa Backend (Serverless CRUD)**
  Dilengkapi dengan dasbor administrasi bawaan (`admin.html`) yang diautentikasi melalui GitHub Personal Access Token (PAT). Panel ini memfasilitasi operasi CRUD (Create, Read, Update, Delete) langsung pada basis data JSON internal tanpa memerlukan server backend tambahan, dengan memanfaatkan GitHub REST API.
* **UI/UX Dinamis dan Animasi DOM**
  Menggunakan GSAP (GreenSock Animation Platform) untuk menghasilkan transisi antarmuka yang presisi, dipadukan dengan hero banner dinamis yang mendukung latar belakang video dan injeksi teks rotasional.

## Teknologi yang Digunakan

Arsitektur sistem ini dibangun seutuhnya pada lingkungan Client-Side untuk menjamin latensi yang rendah, kemudahan deployment melalui CDN, dan pemeliharaan server nol (zero maintenance).

* **Struktur Representasi & Tampilan**: HTML5, CSS3, Tailwind CSS (via integrasi CDN untuk kelas utilitas utilitas cepat)
* **Logika Inti & Interaktivitas**: Vanilla JavaScript (ES6+), Fetch API, Manipulasi Objek Waktu (Date)
* **Mesin Animasi**: GSAP (GreenSock Animation Platform)
* **Penyimpanan Data Struktural**: JSON (`data.json`)
* **Pengiriman Konten & Hosting**: GitHub Pages / Tencent Cloud EdgeOne Pages
* **Integrasi Pihak Ketiga**: GitHub REST API (Infrastruktur Panel Admin)

## Struktur Direktori

```text
WebKelasTIREGC/
 |-- img/               # Direktori aset untuk gambar statis dan latar belakang video
 |-- data.json          # Basis data primer (Jadwal, Daftar Tugas, Pengumuman, Identitas)
 |-- index.html         # Beranda utama, Dasbor Analitik, dan Widget Tugas
 |-- tugas.html         # Repositori Tugas komprehensif dengan fungsionalitas penyaringan
 |-- profil.html        # Informasi identitas kelas dan pengembang
 |-- admin.html         # Panel Admin aman untuk manipulasi basis data
 |-- style.css          # Lembar gaya inti untuk mendefinisikan layout dan estetika visual
 |-- main.js            # Sentralisasi skrip JavaScript (DOM, Fetch API, Algoritma Kalkulasi)
 |-- README.md          # Dokumentasi teknis proyek
```

## Manajemen & Modifikasi Data

Seluruh data operasional diatur dalam berkas `data.json`. Modifikasi manual pada fail HTML tidak diperlukan untuk pembaruan data akademik rutin.

**Instruksi Pembaruan Data melalui Panel Admin:**
1. Akses rute `/admin.html` pada situs web yang telah didistribusikan.
2. Lakukan otorisasi menggunakan GitHub Personal Access Token (PAT) dengan cakupan hak akses `repo`.
3. Gunakan antarmuka dasbor untuk menambah, memodifikasi, atau menghapus jadwal, pengumuman, maupun tugas.
4. Klik tombol "Simpan & Deploy" untuk mengirimkan muatan JSON terbaru langsung ke repositori GitHub. Perubahan akan terefleksikan pada situs publik seketika setelah cache CDN diperbarui.

## Instalasi & Pengembangan Lokal

1. Salin repositori ini ke lingkungan lokal Anda:
   ```bash
   git clone https://github.com/FIAN245/WebKelasTIREGC.git
   ```
2. Buka direktori proyek yang telah diunduh.
3. Jalankan proyek menggunakan server pengembangan lokal (seperti ekstensi Live Server di VSCode, Python SimpleHTTPServer, atau Node `http-server`) untuk menghindari restriksi kebijakan CORS saat peramban mengambil berkas `data.json`.
4. Akses `index.html` melalui peramban web pilihan Anda.

## Lisensi

Proyek perangkat lunak ini dikembangkan untuk kebutuhan operasional akademik dan keorganisasian mahasiswa.
Hak Cipta (c) 2026 FIAN245.