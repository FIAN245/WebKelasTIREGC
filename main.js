document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil data dari JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Panggil fungsi-fungsi untuk menampilkan data
            renderIdentitas(data.identitas);
            renderPengumuman(data.pengumuman);
            renderJadwal(data.jadwal);
            renderTugasPreview(data.tugas);
        })
        .catch(error => console.error('Gagal mengambil data:', error));

    // 2. Fitur Menu Mobile (Hamburger)
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("toggle");
    });
});

// --- Fungsi-Fungsi Penampil Data ---

function renderIdentitas(identitas) {
    // Cek apakah elemen ada di halaman (biar ga error di halaman lain)
    if(document.getElementById("nama-kelas-display")) {
        document.getElementById("nama-kelas-display").innerText = identitas.nama_kelas;
    }
    if(document.getElementById("footer-year")) {
        document.getElementById("footer-year").innerText = new Date().getFullYear();
    }
    if(document.getElementById("dev-name")) {
        document.getElementById("dev-name").innerText = identitas.pembuat;
    }
}

function renderPengumuman(listPengumuman) {
    const container = document.getElementById("pengumuman-list");
    if (!container) return; // Stop jika bukan di halaman home

    container.innerHTML = ""; // Bersihkan loading text

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
    
    // Ambil maksimal 2 tugas saja untuk preview di Home
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
