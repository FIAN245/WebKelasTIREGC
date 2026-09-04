document.addEventListener("DOMContentLoaded", () => {
    // Tambahkan ?t=... untuk mengatasi cache agar data selalu update
    fetch('data.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            renderIdentitas(data.identitas);
            renderAdminProfile(data.identitas);
            renderPengumuman(data.pengumuman);
            renderJadwal(data.jadwal);
            renderTugasPreview(data.tugas);
            renderAllTugas(data.tugas);
            renderProfilKelas(data.identitas);
            renderDaftarMatkul(data.jadwal);
            hitungStatistikTugas(data.tugas);
            startQuoteRotation();
        })
        .catch(error => console.error('Gagal mengambil data:', error));

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if(hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("toggle");
        });
    }

    // Jalankan jam real-time segera setelah halaman dimuat
    updateClock();
    setInterval(updateClock, 1000);
});

// --- FUNGSI WAKTU REAL-TIME ---
function updateClock() {
    const clockElement = document.getElementById('realtime-clock');
    if (!clockElement) return;

    const now = new Date();
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', optionsDate);
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    clockElement.innerText = `📅 ${dateString} | ⏰ ${timeString}`;
}

// --- HELPER: Deteksi Link & Format List ---
function formatContent(content) {
    if (Array.isArray(content)) {
        let listHtml = content.map(item => `<li>${textToLink(item)}</li>`).join("");
        return `<ul style="padding-left: 20px; margin-top: 5px;">${listHtml}</ul>`;
    }
    return `<p>${textToLink(content)}</p>`;
}

function textToLink(text) {
    if (!text) return ""; 
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, (url) => {
        let displayUrl = url.length > 30 ? url.substring(0, 30) + "..." : url;
        return `<a href="${url}" target="_blank" style="color: var(--accent-color); text-decoration: underline; word-break: break-all;">${displayUrl}</a>`;
    });
}

// --- FUNGSI RENDER DATA ---
function renderIdentitas(identitas) {
    if(document.getElementById("nama-kelas-display")) document.getElementById("nama-kelas-display").innerText = identitas.nama_kelas;
    if(document.getElementById("footer-year")) document.getElementById("footer-year").innerText = new Date().getFullYear();
    const devNameElements = document.querySelectorAll("#dev-name, #dev-name-profile");
    devNameElements.forEach(el => el.innerText = identitas.pembuat);
}

function renderPengumuman(listPengumuman) {
    const container = document.getElementById("pengumuman-list");
    if (!container) return; 
    container.innerHTML = "";
    listPengumuman.forEach(item => {
        const div = document.createElement("div");
        div.className = `card pengumuman-card ${item.penting ? 'penting' : ''}`;
        div.innerHTML = `
            <div class="card-header">
                <span class="date">${item.tanggal}</span>
                ${item.penting ? '<span class="badge">PENTING</span>' : ''}
            </div>
            ${formatContent(item.text)}
        `;
        container.appendChild(div);
    });
}

function renderJadwal(listJadwal) {
    const tbody = document.getElementById("jadwal-list");
    if (!tbody) return;
    tbody.innerHTML = "";
    listJadwal.forEach(jadwal => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${jadwal.hari}</td>
            <td class="fw-bold">${jadwal.matkul}</td>
            <td>${jadwal.dosen}</td>
            <td>${jadwal.jam}</td>
            <td><span class="status ${jadwal.tipe.toLowerCase()}">${jadwal.tipe}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderTugasPreview(listTugas) {
    const container = document.getElementById("tugas-preview-list");
    if (!container) return;
    container.innerHTML = "";
    const previewTugas = listTugas.slice(0, 2); 
    previewTugas.forEach(tugas => {
        const div = document.createElement("div");
        div.className = "card tugas-card";
        let shortDesc = Array.isArray(tugas.deskripsi) ? tugas.deskripsi[0] + "..." : tugas.deskripsi;
        div.innerHTML = `
            <h3>${tugas.matkul}</h3>
            <h4>${tugas.judul}</h4>
            <p>Deadline: <span class="deadline">${tugas.deadline}</span></p>
            <hr>
            <p class="desc-short">${shortDesc}</p>
        `;
        container.appendChild(div);
    });
}

function renderAllTugas(listTugas) {
    const container = document.getElementById("tugas-list-full");
    if (!container) return; 
    container.innerHTML = "";
    if (listTugas.length === 0) {
        container.innerHTML = "<p>Tidak ada tugas saat ini.</p>";
        return;
    }
    listTugas.forEach(tugas => {
        const div = document.createElement("div");
        div.className = "card tugas-card";
        let linkHtml = "";
        if (!tugas.link_pengumpulan) {
            linkHtml = `<span style="color: grey;">(Offline)</span>`;
        } else if (tugas.link_pengumpulan.startsWith("http")) {
            linkHtml = `<a href="${tugas.link_pengumpulan}" target="_blank" class="btn-more">📂 Kumpulkan Tugas</a>`;
        } else {
            linkHtml = `<div style="margin-top:10px; padding:10px; background:#e3f2fd; border-radius:6px;">ℹ️ ${tugas.link_pengumpulan}</div>`;
        }
        div.innerHTML = `
            <h3 style="color:var(--primary-color)">${tugas.matkul}</h3>
            <h2 style="font-size: 1.2rem;">${tugas.judul}</h2>
            <p>Deadline: <span class="deadline">${tugas.deadline}</span></p>
            ${formatContent(tugas.deskripsi)}
            ${linkHtml}
        `;
        container.appendChild(div);
    });
}

function renderProfilKelas(identitas) {
    const container = document.getElementById("profil-kelas-card");
    if (!container) return;
    container.innerHTML = `
        <table style="width:100%">
            <tr><td><strong>Fakultas</strong></td><td>: ${identitas.kampus}</td></tr>
            <tr><td><strong>Jurusan</strong></td><td>: ${identitas.nama_kelas}</td></tr>
            <tr><td><strong>Semester</strong></td><td>: ${identitas.semester}</td></tr>
        </table>
    `;
}

function renderDaftarMatkul(listJadwal) {
    const ul = document.getElementById("daftar-matkul-list");
    if (!ul) return;
    ul.innerHTML = "";
    const uniqueMatkul = [...new Set(listJadwal.map(item => item.matkul))];
    uniqueMatkul.forEach(matkul => {
        const li = document.createElement("li");
        li.innerText = matkul;
        li.style.padding = "10px";
        li.style.borderBottom = "1px solid #eee";
        ul.appendChild(li);
    });
}
// --- FUNGSI BARU UNTUK RENDER PROFIL ADMIN ---
function renderAdminProfile(identitas) {
    const adminImageElement = document.getElementById("admin-image");
    const adminNameElement = document.getElementById("admin-name");
    
    if (adminImageElement) {
        // Gunakan foto profil dari JSON, kalau kosong pakai default
        adminImageElement.src = identitas.id_profile_img || "img/default_profile.png";
    }
    
    if (adminNameElement) {
        // Gunakan nama profil, kalau kosong pakai nama pembuat
        adminNameElement.innerText = identitas.nama_profil || identitas.pembuat;
    }
}
// ==========================================
// FITUR 1: ROTASI KATA MUTIARA HERO BANNER
// ==========================================
const quotes = [
    "\"The Blueprint is drawn, the Seal is set. When the Clock striketh the Thirteenth Hour, the Unseen shall become the Only Truth.\"",
    "\"Seperti Neural Network, pemahaman kita dibangun dengan terus belajar dan beradaptasi dari setiap error.\"",
    "\"Di lautan Big Data yang acak, pola yang tepat akan memandu kita pada inovasi.\"",
    "\"Melihat dunia tidak hanya dengan mata, tetapi melalui matriks, piksel, dan algoritma.\"",
    "\"Sistem yang tangguh selalu berawal dari koneksi dan arsitektur yang tak terputus.\""
];

let quoteIndex = 0;

function startQuoteRotation() {
    const quoteEl = document.getElementById("hero-quote");
    if (!quoteEl) return; // Hanya jalankan jika ada elemennya (di halaman index)

    // Set teks awal
    quoteEl.innerText = quotes[quoteIndex];

    setInterval(() => {
        // Beri efek fade-out
        quoteEl.classList.add("fade-out");
        
        setTimeout(() => {
            // Ganti teks saat tulisan sedang menghilang
            quoteIndex = (quoteIndex + 1) % quotes.length;
            quoteEl.innerText = quotes[quoteIndex];
            
            // Beri efek fade-in
            quoteEl.classList.remove("fade-out");
        }, 500); // Sinkronkan dengan 0.5s durasi transisi di CSS
        
    }, 6000); // Ganti kalimat setiap 6 detik
}

// ==========================================
// FITUR 2: KALKULASI DASHBOARD STATISTIK
// ==========================================
function hitungStatistikTugas(listTugas) {
    const elTotal = document.getElementById("stat-total");
    if (!elTotal) return; // Hentikan fungsi jika bukan di halaman index

    const elSelesai = document.getElementById("stat-selesai");
    const elSisa = document.getElementById("stat-sisa");
    const elDeadline = document.getElementById("stat-deadline");
    const elProgressText = document.getElementById("progress-text");
    const elProgressBar = document.getElementById("progress-bar-fill");

    if (!listTugas || listTugas.length === 0) return;

    let total = listTugas.length;
    let selesai = 0;
    let sisa = 0;
    
    let terdekatTeks = null;
    let jarakTerdekat = Infinity;

    // Reset waktu ke jam 00:00:00 hari ini untuk kalkulasi jarak hari yang akurat
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const bulanIndo = { "januari":0, "februari":1, "maret":2, "april":3, "mei":4, "juni":5, "juli":6, "agustus":7, "september":8, "oktober":9, "november":10, "desember":11 };
    
    listTugas.forEach(tugas => {
        let parseDate = null;
        // Membaca string format "12 Juni 2026" dari JSON
        let parts = tugas.deadline.toLowerCase().split(" ");
        if (parts.length >= 3) {
            let d = parseInt(parts[0]);
            let m = bulanIndo[parts[1]];
            let y = parseInt(parts[2]);
            if (!isNaN(d) && m !== undefined && !isNaN(y)) {
                parseDate = new Date(y, m, d);
            }
        }

        if (parseDate) {
            let selisihWaktu = parseDate.getTime() - now.getTime();
            let selisihHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24));

            if (selisihHari < 0) {
                // Jika deadline sudah terlewat dari hari ini
                selesai++;
            } else {
                // Jika deadline hari ini (0) atau di masa depan (>0)
                sisa++;
                if (selisihHari < jarakTerdekat) {
                    jarakTerdekat = selisihHari;
                    terdekatTeks = `${tugas.matkul}<br><span style="font-size:0.85rem; color:#666; font-weight:normal;">${selisihHari === 0 ? 'HARI INI!' : selisihHari + ' hari lagi'}</span>`;
                }
            }
        } else {
            // Jika penulisan JSON tidak standar, anggap saja tugas belum selesai
            sisa++; 
        }
    });

    // Injeksi angka ke HTML
    elTotal.innerText = total;
    elSelesai.innerText = selesai;
    elSisa.innerText = sisa;
    elDeadline.innerHTML = terdekatTeks ? terdekatTeks : "Semua Selesai";

    // Hitung persentase untuk Progress Bar
    let persentase = total === 0 ? 0 : Math.round((selesai / total) * 100);
    elProgressText.innerText = persentase + "%";
    
    // Beri sedikit jeda 0.3 detik agar bar teranimasi dari 0 ke persentase aslinya saat halaman dimuat
    setTimeout(() => {
        elProgressBar.style.width = persentase + "%";
    }, 300);
}
// ==========================================
// FITUR 3: ANIMASI UI LANJUTAN DENGAN GSAP
// ==========================================
function jalankanAnimasiGSAP() {
    // Pastikan GSAP sudah ter-load
    if (typeof gsap === 'undefined') return;

    // 1. Animasi Navbar (Turun dari atas)
    gsap.from(".navbar", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" });

    // 2. Animasi Hero Banner (Muncul perlahan)
    gsap.from(".hero-content", { y: 30, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });

    // 3. Animasi Staggered untuk Card Statistik (Muncul berurutan bergelombang)
    gsap.from(".stat-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15, // Jeda antar card
        ease: "back.out(1.2)", // Efek pantulan elastis
        delay: 0.5
    });

    // 4. Animasi Daftar Pengumuman dan Tabel Jadwal
    gsap.from(".card-container > .card, .table-responsive", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.8
    });
}
