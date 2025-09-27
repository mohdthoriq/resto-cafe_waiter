// c:\projectku\belajar\project 2\waiters\src\modules\tema.js

import { modulNotifikasi } from './notifikasi.js'; // Mengimpor modul notifikasi untuk memberi feedback saat tema diubah.

// Set tema aplikasi
function aturTema(tema) { // Fungsi untuk menerapkan tema ke seluruh halaman.
    document.body.className = `${tema}-theme`; // Mengubah kelas pada elemen body untuk menerapkan CSS tema.
    document.documentElement.setAttribute('data-theme', tema); // Mengatur atribut data-theme pada elemen <html> untuk variabel CSS.
    localStorage.setItem('temaPilihan', tema); // Menyimpan pilihan tema ke localStorage agar diingat saat membuka halaman lagi.
}

// Update ikon tema
function perbaruiIkonTema(tema) { // Fungsi untuk mengubah ikon tombol tema (bulan/matahari).
    const tombolTema = document.getElementById('tombolTheme'); // Mendapatkan elemen tombol tema.
    if (tombolTema) { // Jika tombolnya ada.
        const ikon = tombolTema.querySelector('i'); // Dapatkan elemen ikon di dalam tombol.
        ikon.className = tema === 'light' ? 'fas fa-moon' : 'fas fa-sun'; // Ganti kelas ikon sesuai tema. 'fa-moon' untuk light, 'fa-sun' untuk dark.
    }
}

// Inisialisasi tema
function inisialisasi() { // Fungsi yang dijalankan saat aplikasi pertama kali dimuat.
    const temaTersimpan = localStorage.getItem('temaPilihan') || 'light'; // Ambil tema yang tersimpan di localStorage, atau gunakan 'light' sebagai default.
    aturTema(temaTersimpan); // Terapkan tema yang didapat.
    perbaruiIkonTema(temaTersimpan); // Perbarui ikon sesuai tema.
    console.log(`🎨 Tema diinisialisasi: ${temaTersimpan}`); // Log untuk debugging.
}

// Toggle tema
function toggleTema() { // Fungsi yang dipanggil saat tombol tema diklik.
    const temaSekarang = document.body.className.includes('dark') ? 'dark' : 'light'; // Cek tema yang sedang aktif.
    const temaBaru = temaSekarang === 'light' ? 'dark' : 'light'; // Tentukan tema baru (kebalikan dari tema sekarang).
    
    aturTema(temaBaru); // Terapkan tema baru.
    perbaruiIkonTema(temaBaru); // Perbarui ikon tema.
    
    // Cek apakah modulNotifikasi ada sebelum digunakan
    if (modulNotifikasi && typeof modulNotifikasi.tampilkanToast === 'function') { // Pastikan modul notifikasi sudah dimuat.
        modulNotifikasi.tampilkanToast( // Tampilkan notifikasi toast.
            'Tema Diubah', // Judul toast.
            `Tema ${temaBaru === 'light' ? 'Terang' : 'Gelap'} aktif`, // Pesan toast.
            'info' // Tipe toast.
        );
    }
    
    console.log(`🔄 Tema diubah ke ${temaBaru}`); // Log untuk debugging.
}

export const modulTema = { // Mengekspor fungsi-fungsi agar bisa digunakan di file lain.
    inisialisasi, // Ekspor fungsi inisialisasi.
    toggleTema, // Ekspor fungsi untuk mengganti tema.
};
