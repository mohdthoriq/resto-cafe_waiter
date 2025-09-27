// c:\projectku\belajar\project 2\waiters\src\login.js

import { modulTema } from './modules/tema.js'; // Mengimpor modul untuk mengelola tema (gelap/terang).
import { modulPenyimpanan } from './modules/penyimpanan.js'; // Mengimpor modul untuk menyimpan dan mengambil data dari storage.
import { modulValidasi } from './modules/validasi.js'; // Mengimpor modul untuk validasi input form.
import { modulAPIRestoran } from './modules/api.js'; // Mengimpor modul untuk simulasi panggilan API ke server.

// ===== MODUL ANTARMUKA PENGGUNA (UI) =====
const modulAntarmuka = { // Objek yang berisi fungsi-fungsi untuk memanipulasi antarmuka pengguna (UI).

    tampilkanNotifikasi: function(pesan, tipe = 'info', durasi = 5000) { // Fungsi untuk menampilkan pesan notifikasi di form login.
        const el = document.getElementById('pesanNotifikasi'); // Mendapatkan elemen notifikasi dari HTML.

        if (!el) return; // Jika elemen tidak ditemukan, hentikan fungsi.

        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' }; // Objek untuk memetakan tipe notifikasi ke ikon FontAwesome.
        el.className = 'notifikasi'; // Mereset kelas CSS elemen notifikasi.
        el.innerHTML = `<i class="fas ${icons[tipe] || icons.info}"></i> ${pesan}`; // Mengatur konten HTML notifikasi dengan ikon dan pesan.
        el.classList.add(tipe, 'show'); // Menambahkan kelas tipe (error/success) dan 'show' untuk menampilkan notifikasi.

        setTimeout(() => el.classList.remove('show'), durasi); // Menghilangkan notifikasi setelah durasi tertentu.
    },
    setLoadingButton: function(loading = true) { // Fungsi untuk mengatur status loading pada tombol login.
        const btn = document.querySelector('.btn-login'); // Mendapatkan elemen tombol login.

        if (!btn) return; // Jika tombol tidak ditemukan, hentikan fungsi.
        btn.classList.toggle('loading', loading); // Menambah/menghapus kelas 'loading' pada tombol.
        btn.disabled = loading; // Menonaktifkan tombol saat loading.
    },
    redirectDenganTransisi: function(url, delay = 1000) { // Fungsi untuk mengalihkan halaman dengan efek transisi.
        document.body.style.transition = 'opacity 0.5s ease-out'; // Mengatur transisi CSS pada body.
        document.body.style.opacity = '0'; // Membuat body menjadi transparan (efek fade-out).

        setTimeout(() => window.location.href = url, delay); // Mengalihkan ke URL baru setelah delay.
    }
};


// ===== APLIKASI UTAMA LOGIN =====

const aplikasiLogin = { // Objek utama yang mengelola semua logika di halaman login.
    status: { sedangLogin: false }, // Menyimpan status aplikasi, misalnya apakah sedang dalam proses login.

    inisialisasi: function() { // Fungsi yang dijalankan pertama kali saat halaman dimuat.
        console.log('🚀 Memulai Aplikasi Login...'); // Log untuk debugging.
        modulTema.inisialisasi(); // Menginisialisasi tema (gelap/terang).
        this.setupEventListeners(); // Menyiapkan semua event listener (misal: klik tombol).
        this.cekSessionTersimpan(); // Memeriksa apakah ada sesi login yang masih aktif.
    },

    setupEventListeners: function() { // Fungsi untuk mendaftarkan semua event listener.
        document.getElementById('tombolTheme').addEventListener('click', modulTema.toggleTema); // Event listener untuk tombol ganti tema.
        document.getElementById('formLogin').addEventListener('submit', this.prosesLogin.bind(this)); // Event listener untuk saat form login disubmit.
    },

    cekSessionTersimpan: function() { // Fungsi untuk memeriksa sesi yang tersimpan di browser.
        const dataWaiter = modulPenyimpanan.ambilDataWaiter(); // Mengambil data waiter dari storage.

        if (dataWaiter) { // Jika data waiter ditemukan.

            if (confirm(`Session ditemukan untuk ${dataWaiter.nama}. Lanjutkan ke menu?`)) { // Tampilkan konfirmasi kepada pengguna.
                modulAntarmuka.tampilkanNotifikasi('Melanjutkan session...', 'info', 1500); // Tampilkan notifikasi.
                setTimeout(() => modulAntarmuka.redirectDenganTransisi('menu.html', 500), 1000); // Arahkan ke halaman menu.

            } else { // Jika pengguna memilih untuk tidak melanjutkan.
                modulPenyimpanan.hapusDataWaiter(); // Hapus data sesi yang lama.
                modulAntarmuka.tampilkanNotifikasi('Session lama dihapus. Silakan login ulang.', 'info'); // Beri tahu pengguna.

            }
        }
    },

    prosesLogin: async function(event) { // Fungsi yang dijalankan saat tombol login ditekan.

        // --- berikut adalah (kode validasi) ---
        
        event.preventDefault(); // Mencegah form dari perilaku default (reload halaman).
        if (this.status.sedangLogin) return; // Jika sedang dalam proses login, jangan lakukan apa-apa (mencegah klik ganda).

        this.status.sedangLogin = true; // Set status menjadi sedang login.
        modulAntarmuka.setLoadingButton(true); // Tampilkan loading pada tombol.

        const dataForm = { // Mengambil nilai dari setiap input di form.
            nama: document.getElementById('namaWaiter').value, // Ambil nama waiter.
            shift: document.getElementById('shiftWaiter').value, // Ambil shift kerja.
            kodeWaiter: document.getElementById('kodeWaiter').value || '' // Ambil kode waiter (jika ada).
        };

        const hasilValidasi = modulValidasi.validasiFormLengkap(dataForm); // Memvalidasi data yang diinput pengguna.

        if (!hasilValidasi.valid) { // Jika validasi gagal.
            modulAntarmuka.tampilkanNotifikasi(hasilValidasi.errors.join(', '), 'error'); // Tampilkan pesan error.
            this.resetLoginState(); // Kembalikan tombol ke keadaan normal.
            return; // Hentikan proses login.
        }

        try { // Blok untuk menangani proses yang mungkin gagal (seperti koneksi ke server).

            // --- ini lokasi pemanggilan API POST (untuk validasi) ---

            await modulAPIRestoran.simulasiValidasiServer(hasilValidasi.data); // Simulasi validasi data ke server.
            const hasilSimpan = modulPenyimpanan.simpanDataWaiter(hasilValidasi.data); // Simpan data waiter ke session storage.

            if (hasilSimpan.success) { // Jika penyimpanan berhasil.
                modulAntarmuka.tampilkanNotifikasi(`Selamat datang, ${hasilValidasi.data.nama}!`, 'success', 2000); // Tampilkan pesan selamat datang.
                
                setTimeout(() => modulAntarmuka.redirectDenganTransisi('menu.html', 500), 1500); // Arahkan ke halaman menu setelah beberapa saat.
            } else { // Jika penyimpanan gagal.
                throw new Error(hasilSimpan.error || 'Gagal menyimpan data login'); // Lemparkan error.
            }
        } catch (error) { // Jika terjadi error di dalam blok 'try'.
            modulAntarmuka.tampilkanNotifikasi(`Login gagal: ${error.message}`, 'error'); // Tampilkan pesan error dari server atau proses lainnya.
            this.resetLoginState(); // Kembalikan tombol ke keadaan normal.
        }
    },

    resetLoginState: function() { // Fungsi untuk mengembalikan status login ke keadaan semula.
        this.status.sedangLogin = false; // Set status tidak sedang login.
        modulAntarmuka.setLoadingButton(false); // Matikan loading pada tombol.
    }
};

// ===== EVENT LISTENER UTAMA =====
document.addEventListener('DOMContentLoaded', () => { // Event yang dijalankan setelah seluruh halaman HTML selesai dimuat.
    aplikasiLogin.inisialisasi(); // Memulai aplikasi login.
});
