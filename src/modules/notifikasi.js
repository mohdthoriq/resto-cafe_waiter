// c:\projectku\belajar\project 2\waiters\src\modules\notifikasi.js

// Container untuk toast
let container = null; // Variabel untuk menyimpan elemen DOM yang akan menampung semua notifikasi toast.

// Inisialisasi
function inisialisasi() { // Fungsi untuk menyiapkan container toast.
    container = document.getElementById('toastContainer'); // Mencari container di HTML.
    if (!container) { // Jika container tidak ditemukan di HTML.
        container = document.createElement('div'); // Buat elemen div baru.
        container.id = 'toastContainer'; // Beri ID.
        container.className = 'toast-container'; // Beri kelas CSS.
        document.body.appendChild(container); // Tambahkan elemen tersebut ke body dokumen.
    }
}

// Hapus toast
function hapusToast(toast) { // Fungsi untuk menghapus sebuah elemen toast dari DOM.
    if (toast && toast.parentElement) { // Pastikan toast dan parent-nya ada.
        toast.classList.add('fade-out'); // Tambahkan kelas untuk animasi fade-out.
        setTimeout(() => { // Setelah animasi selesai (300ms).
            if (toast.parentElement) { // Cek lagi untuk keamanan.
                toast.parentElement.removeChild(toast); // Hapus elemen toast dari DOM.
            }
        }, 300); // Durasi harus cocok dengan durasi transisi di CSS.
    }
}

// Tampilkan toast notification
function tampilkanToast(judul, pesan, tipe = 'info', durasi = 4000) { // Fungsi utama untuk membuat dan menampilkan toast.
    if (!container) inisialisasi(); // Jika container belum diinisialisasi, lakukan sekarang.

    const toast = document.createElement('div'); // Buat elemen div baru untuk toast.
    toast.className = `toast ${tipe}`; // Atur kelas CSS berdasarkan tipe notifikasi (info, success, error).
    
    const iconMap = { // Objek untuk memetakan tipe notifikasi ke ikon FontAwesome.
        'success': 'fa-check-circle', // Ikon untuk sukses.
        'error': 'fa-exclamation-circle', // Ikon untuk error.
        'warning': 'fa-exclamation-triangle', // Ikon untuk peringatan.
        'info': 'fa-info-circle' // Ikon untuk info.
    };

     // Mengisi konten HTML dari elemen toast.
    toast.innerHTML = `
        <i class="fas ${iconMap[tipe]} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${judul}</div>
            <div class="toast-message">${pesan}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    const closeBtn = toast.querySelector('.toast-close'); // Cari tombol close di dalam toast.
    closeBtn.addEventListener('click', () => hapusToast(toast)); // Tambahkan event listener untuk menghapus toast saat tombol close diklik.

    container.appendChild(toast); // Tambahkan toast yang baru dibuat ke dalam container.

    setTimeout(() => hapusToast(toast), durasi); // Atur waktu untuk menghapus toast secara otomatis.

    console.log(`📢 Toast [${tipe}]: ${judul} - ${pesan}`); // Log ke konsol untuk debugging.
}

export const modulNotifikasi = { // Mengekspor fungsi-fungsi agar bisa digunakan di file lain.
    inisialisasi, // Ekspor fungsi inisialisasi.
    tampilkanToast, // Ekspor fungsi untuk menampilkan toast.
};
