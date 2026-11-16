// Database Anggota Komunitas (Himpunan Semesta S)
const databaseAnggota = [
    { nama: "Rian", hobi: ["Coding", "Futsal", "Gaming"], role: "Mahasiswa FST" },
    { nama: "Abyan", hobi: ["Coding", "Desain"], role: "Fullstack Dev" },
    { nama: "Restu", hobi: ["Futsal", "Gaming"], role: "Gamers & Athlete" },
    { nama: "Faizah", hobi: ["Desain", "Gaming"], role: "UI/UX Explorer & Gamers" },
    { nama: "Dika", hobi: ["Gaming", "Futsal", "Coding"], role: "All-Rounder" },
    { nama: "Jefri", hobi: ["Futsal"], role: "Video Editor & Athlete" },
    { nama: "Fahrein", hobi: ["Futsal", "Desain"], role: "Video Editor & Athlete" }
];

function runMatchmaker() {
    // 1. Ambil hobi yang dicentang oleh pengguna (Himpunan A)
    const checkboxes = document.querySelectorAll('.hobbies-checkbox:checked');
    const userHobbies = Array.from(checkboxes).map(cb => cb.value);

    const profilesGrid = document.getElementById('profilesGrid');
    const mathBox = document.getElementById('mathExplanation');
    const matchCount = document.getElementById('matchCount');

    profilesGrid.innerHTML = '';

    if (userHobbies.length === 0) {
        profilesGrid.innerHTML = `
            <div class="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                ⚠️ Silakan pilih minimal satu hobi Anda terlebih dahulu untuk memulai pencocokan!
            </div>`;
        matchCount.innerText = "0";
        mathBox.innerHTML = "<p>Pilih setidaknya satu hobi untuk melihat kalkulasi himpunan.</p>";
        return;
    }

    let results = [];
    let unionSet = new Set();
    let intersectionLog = [];
    let differenceLog = [];

    // 2. Evaluasi menggunakan Operasi Himpunan
    databaseAnggota.forEach(member => {
        const memberHobbiesSet = new Set(member.hobi);
        
        // IRISAN (Intersection / A ∩ B): Hobi yang sama antara pengguna dan anggota
        const commonHobbies = member.hobi.filter(hobi => userHobbies.includes(hobi));
        
        // DIFFERENCE (A - B): Keahlian tambahan yang dimiliki anggota di luar pilihan pengguna
        const extraHobbies = member.hobi.filter(hobi => !userHobbies.includes(hobi));

        // UNION (A ∪ B): Gabungan seluruh hobi unik
        member.hobi.forEach(h => unionSet.add(h));

        // Tentukan skor kecocokan berdasarkan jumlah irisan
        if (commonHobbies.length > 0) {
            results.push({
                ...member,
                commonHobbies,
                extraHobbies,
                score: commonHobbies.length
            });
        }
    });

    // Urutkan berdasarkan tingkat kecocokan terbanyak
    results.sort((a, b) => b.score - a.score);
    matchCount.innerText = results.length;

    if (results.length === 0) {
        profilesGrid.innerHTML = `
            <div class="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                Tidak ditemukan anggota dengan hobi yang sama persis. Coba kombinasikan hobi lainnya!
            </div>`;
        mathBox.innerHTML = `<p>Hasil Irisan (Intersection) bernilai kosong $\\emptyset$ terhadap data komunitas.</p>`;
        return;
    }

    // 3. Render Kartu Profil Modern
    profilesGrid.innerHTML = results.map(m => `
        <div class="profile-card bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
            <div class="space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-lg text-white">${m.nama}</h3>
                        <p class="text-xs text-slate-400">${m.role}</p>
                    </div>
                    <span class="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-1 rounded-full font-semibold">
                        Match: ${m.score} Hobi Sama
                    </span>
                </div>
            </div>

            <div class="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                    <span class="text-slate-400 block mb-1">Hobi yang Sama (Irisan / $\\cap$):</span>
                    <div class="flex flex-wrap gap-1.5">
                        ${m.commonHobbies.map(h => `<span class="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md font-medium">${h}</span>`).join('')}
                    </div>
                </div>
                ${m.extraHobbies.length > 0 ? `
                <div>
                    <span class="text-slate-400 block mb-1">Keahlian Tambahan (Difference / $-$):</span>
                    <div class="flex flex-wrap gap-1.5">
                        ${m.extraHobbies.map(h => `<span class="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">${h}</span>`).join('')}
                    </div>
                </div>` : ''}
            </div>
        </div>
    `).join('');

    // 4. Generate Laporan Matematika Himpunan untuk Tugas
    mathBox.innerHTML = `
        <p><strong>1. Himpunan Pilihan Anda ($A$):</strong> { ${userHobbies.join(', ')} }</p>
        <p><strong>2. Operasi Irisan (Intersection / $A \\cap B$):</strong> Sistem mencocokkan elemen anggota yang beririsan langsung dengan hobi pilihan Anda untuk menentukan tingkat kecocokan skor.</p>
        <p><strong>3. Operasi Selisih (Difference / $B - A$):</strong> Menampilkan keahlian atau hobi ekstra yang dimiliki rekan squad di luar pilihan Anda.</p>
        <p><strong>4. Operasi Gabungan (Union / $\\bigcup$):</strong> Total keseluruhan hobi unik yang tercakup dalam pencarian aktif adalah: { ${Array.from(unionSet).join(', ')} }</p>
    `;
}

// Fungsi untuk membuka/menutup panel laporan matematika
function toggleSecretDebug() {
    const box = document.getElementById('debugBox');
    box.classList.toggle('hidden');
}