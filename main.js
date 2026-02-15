document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil data dari JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Jalankan fungsi sesuai halaman yang aktif
            renderIdentitas(data.identitas);
            
            // Halaman Home
            renderPengumuman(data.pengumuman);
            renderJadwal(data.jadwal);
            renderTugasPreview(data.tugas);

            // Halaman Tugas
            renderAllTugas(data.tugas);

            // Halaman Profil
            renderProfilKelas(data.identitas);
            renderDaftarMatkul(data.jadwal); // Kita ambil daftar matkul dari jadwal
        })
        .catch(error => console.error('Gagal mengambil data:', error));

    // 2. Fitur Menu Mobile
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if(hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("toggle");
        });
    }
});

// --- Fungsi Penampil Data ---

function renderIdentitas(identitas) {
    // Mengisi elemen-elemen umum (header, footer, dll)
    if(document.getElementById("nama-kelas-display")) document.getElementById("nama-kelas-display").innerText = identitas.nama_kelas;
    if(document.getElementById("footer-year")) document.getElementById("footer-year").innerText = new Date().getFullYear();
    
    // Mengisi nama developer di footer dan di halaman profil
    const devNameElements = document.querySelectorAll("#dev-name, #dev-name-profile");
    devNameElements.forEach(el => el.innerText = identitas.pembuat);
}

// --- LOGIKA HOME ---
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
            <p>${item.text}</p>
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
    // Hanya ambil 2 tugas pertama
    const previewTugas = listTugas.slice(0, 2); 

    previewTugas.forEach(tugas => {
        const div = document.createElement("div");
        div.className = "card tugas-card";
        div.innerHTML = `
            <h3>${tugas.matkul}</h3>
            <h4>${tugas.judul}</h4>
            <p>Deadline: <span class="deadline">${tugas.deadline}</span></p>
            <hr>
            <p class="desc-short">${tugas.deskripsi}</p>
        `;
        container.appendChild(div);
    });
}

// --- LOGIKA HALAMAN TUGAS (FULL) ---
function renderAllTugas(listTugas) {
    const container = document.getElementById("tugas-list-full");
    if (!container) return; // Stop jika bukan halaman tugas

    container.innerHTML = "";
    
    if (listTugas.length === 0) {
        container.innerHTML = "<p>Tidak ada tugas saat ini.</p>";
        return;
    }

    listTugas.forEach(tugas => {
        const div = document.createElement("div");
        div.className = "card tugas-card";
        
        // Cek apakah ada link pengumpulan
        let linkHtml = "";
        if (tugas.link_pengumpulan) {
            linkHtml = `<a href="${tugas.link_pengumpulan}" target="_blank" class="btn-more" style="margin-top:10px; display:inline-block;">📂 Kumpulkan Tugas</a>`;
        } else {
            linkHtml = `<span style="color: grey; font-size: 0.9rem;">(Dikumpulkan Offline/LMS Kampus)</span>`;
        }

        div.innerHTML = `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                <h3 style="color:var(--primary-color)">${tugas.matkul}</h3>
                <small>Deadline: <span class="deadline">${tugas.deadline}</span></small>
            </div>
            <h2 style="font-size: 1.2rem; margin-bottom: 10px;">${tugas.judul}</h2>
            <p>${tugas.deskripsi}</p>
            ${linkHtml}
        `;
        container.appendChild(div);
    });
}

// --- LOGIKA HALAMAN PROFIL ---
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
    
    // Trik: Ambil nama matkul unik saja (biar ga dobel kalau matkulnya ada 2x seminggu)
    const uniqueMatkul = [...new Set(listJadwal.map(item => item.matkul))];

    uniqueMatkul.forEach(matkul => {
        const li = document.createElement("li");
        li.innerText = matkul;
        li.style.padding = "10px";
        li.style.borderBottom = "1px solid #eee";
        ul.appendChild(li);
    });
}
// --- FUNGSI TAMBAHAN: AUTO LINK ---
function textToLink(text) {
    // Pola untuk mendeteksi link (Regex)
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    // Ubah link menjadi tag <a>
    return text.replace(urlPattern, (url) => {
        return `<a href="${url}" target="_blank" style="color: #007bff; text-decoration: underline;">${url}</a>`;
    });
}


