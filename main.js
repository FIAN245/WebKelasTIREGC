document.addEventListener("DOMContentLoaded", () => {
    // Tambahkan ?t=... untuk mengatasi cache (solusi sebelumnya)
    fetch('data.json?t=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            renderIdentitas(data.identitas);
            renderPengumuman(data.pengumuman);
            renderJadwal(data.jadwal);
            renderTugasPreview(data.tugas);
            renderAllTugas(data.tugas);
            renderProfilKelas(data.identitas);
            renderDaftarMatkul(data.jadwal); 
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
});

// --- HELPER: Deteksi Link & Format List ---
function formatContent(content) {
    // 1. Jika kontennya berupa Array (Daftar), jadikan UL/LI
    if (Array.isArray(content)) {
        let listHtml = content.map(item => `<li>${textToLink(item)}</li>`).join("");
        return `<ul style="padding-left: 20px; margin-top: 5px;">${listHtml}</ul>`;
    }
    // 2. Jika kontennya Teks biasa, proses linknya saja
    return `<p>${textToLink(content)}</p>`;
}

function textToLink(text) {
    if (!text) return ""; // Cegah error jika kosong
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, (url) => {
        let displayUrl = url.length > 30 ? url.substring(0, 30) + "..." : url;
        return `<a href="${url}" target="_blank" style="color: var(--accent-color); text-decoration: underline; word-break: break-all;">${displayUrl}</a>`;
    });
}

// --- FUNGSI RENDER ---

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
        
        // Untuk preview, kalau deskripsi array, kita ambil poin pertama saja + "..."
        let shortDesc = "";
        if(Array.isArray(tugas.deskripsi)) {
            shortDesc = tugas.deskripsi[0] + " (Lihat detail...)";
        } else {
            shortDesc = tugas.deskripsi;
        }

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
        
        // --- LOGIKA BARU: Cek Tipe Link ---
        let linkHtml = "";
        
        // Cek 1: Apakah kosong / null?
        if (!tugas.link_pengumpulan) {
            linkHtml = `<span style="color: grey; font-size: 0.9rem; display:block; margin-top:10px;">(Dikumpulkan Offline/LMS Kampus)</span>`;
        } 
        // Cek 2: Apakah isinya Link (diawali http atau https)?
        else if (tugas.link_pengumpulan.startsWith("http")) {
            linkHtml = `<a href="${tugas.link_pengumpulan}" target="_blank" class="btn-more" style="margin-top:15px; display:inline-block; background-color: var(--primary-color); color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none;">📂 Kumpulkan Tugas</a>`;
        } 
        // Cek 3: Kalau bukan link, berarti Pesan Teks (misal: "Kirim ke Edlink")
        else {
            linkHtml = `<div style="margin-top:15px; padding: 10px; background-color: #e3f2fd; color: #0d47a1; border-radius: 6px; font-size: 0.9rem; border-left: 4px solid #2196f3;">
                            ℹ️ ${tugas.link_pengumpulan}
                        </div>`;
        }

        // --- Render HTML ---
        div.innerHTML = `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                <h3 style="color:var(--primary-color)">${tugas.matkul}</h3>
                <small>Deadline: <span class="deadline">${tugas.deadline}</span></small>
            </div>
            <h2 style="font-size: 1.2rem; margin-bottom: 10px;">${tugas.judul}</h2>
            
            <div style="margin-bottom: 15px; line-height: 1.8;">
                ${formatContent(tugas.deskripsi)}
            </div>
            
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
