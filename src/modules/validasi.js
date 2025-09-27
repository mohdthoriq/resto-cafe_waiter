// c:\projectku\belajar\project 2\waiters\src\modules\validasi.js

const aturanValidasi = { // Objek konfigurasi yang berisi semua aturan untuk validasi form.
    nama: { minLength: 2, maxLength: 50, pattern: /^[a-zA-Z\s\-'\.]+$/, required: true }, // Aturan untuk nama: panjang min/max, pola karakter, dan wajib diisi.
    shift: { validValues: ['pagi', 'siang', 'malam'], required: true }, // Aturan untuk shift: harus salah satu dari nilai yang valid dan wajib diisi.
    kodeWaiter: { pattern: /^[A-Z0-9]{3,6}$/, required: true } // Aturan untuk kode waiter: pola karakter dan  wajib diisi.
};

function validasiNama(nama) { // Fungsi untuk memvalidasi input nama.
    const aturan = aturanValidasi.nama; // Ambil aturan validasi untuk nama.
    const errors = []; // Buat array untuk menampung pesan error.
    if (!nama || nama.trim().length === 0) { // Cek jika nama kosong atau hanya spasi.
        if (aturan.required) errors.push('Nama waiter harus diisi'); // Jika wajib diisi, tambahkan pesan error.
        return { valid: false, errors }; // Kembalikan hasil tidak valid.
    }
    const namaBersih = nama.trim(); // Hapus spasi di awal dan akhir nama.
    if (namaBersih.length < aturan.minLength) errors.push(`Nama minimal ${aturan.minLength} karakter`); // Cek panjang minimum.
    if (namaBersih.length > aturan.maxLength) errors.push(`Nama maksimal ${aturan.maxLength} karakter`); // Cek panjang maksimum.
    if (!aturan.pattern.test(namaBersih)) errors.push('Nama hanya boleh mengandung huruf dan spasi'); // Cek pola karakter yang diizinkan.
    return { valid: errors.length === 0, errors, cleaned: namaBersih }; // Kembalikan hasil: valid jika tidak ada error, pesan error, dan nama yang sudah dibersihkan.
}

function validasiShift(shift) { // Fungsi untuk memvalidasi input shift.
    const aturan = aturanValidasi.shift; // Ambil aturan validasi untuk shift.
    const errors = []; // Buat array untuk menampung pesan error.
    if (!shift || shift === '') { // Cek jika shift belum dipilih.
        if (aturan.required) errors.push('Shift kerja harus dipilih'); // Jika wajib, tambahkan pesan error.
    } else if (!aturan.validValues.includes(shift)) { // Cek jika nilai shift tidak ada di dalam daftar yang diizinkan.
        errors.push('Shift yang dipilih tidak valid'); // Tambahkan pesan error.
    }
    return { valid: errors.length === 0, errors }; // Kembalikan hasil: valid jika tidak ada error, dan pesan error.
}

function validasiKodeWaiter(kode) { // Fungsi untuk memvalidasi input kode waiter.
    const aturan = aturanValidasi.kodeWaiter; // Ambil aturan validasi untuk kode.
    if (!kode || kode.trim() === '') {
        if (aturan.required) return { valid: false, errors: ['Kode waiter harus diisi'] }; // Jika wajib diisi
    }
    const kodeBersih = kode.trim().toUpperCase(); // Hapus spasi dan ubah ke huruf besar.
    if (!aturan.pattern.test(kodeBersih)) { // Cek jika kode tidak sesuai pola.
        return { valid: false, errors: ['Kode waiter harus 3-6 karakter (huruf besar dan angka)'] }; // Kembalikan hasil tidak valid dengan pesan error.
    }
    return { valid: true, errors: [], cleaned: kodeBersih }; // Kembalikan hasil valid dan kode yang sudah dibersihkan.
}

function validasiFormLengkap(data) { // Fungsi untuk menjalankan semua validasi sekaligus.
    const hasilNama = validasiNama(data.nama); // Validasi nama.
    const hasilShift = validasiShift(data.shift); // Validasi shift.
    const hasilKode = validasiKodeWaiter(data.kodeWaiter); // Validasi kode waiter.

    const allErrors = [...hasilNama.errors, ...hasilShift.errors, ...hasilKode.errors]; // Gabungkan semua pesan error dari setiap validasi.

    return { // Kembalikan objek hasil validasi lengkap.
        valid: allErrors.length === 0, // Form dianggap valid jika tidak ada error sama sekali.
        errors: allErrors, // Array yang berisi semua pesan error.
        data: { // Data yang sudah dibersihkan.
            nama: hasilNama.cleaned || data.nama, // Gunakan nama yang sudah dibersihkan.
            shift: data.shift, // Shift tidak perlu dibersihkan.
            kodeWaiter: hasilKode.cleaned || data.kodeWaiter // Gunakan kode yang sudah dibersihkan.
        }
    };
}

export const modulValidasi = { // Mengekspor fungsi-fungsi validasi agar bisa digunakan di file lain.
    validasiNama, // Ekspor fungsi validasiNama.
    validasiShift, // Ekspor fungsi validasiShift.
    validasiKodeWaiter, // Ekspor fungsi validasiKodeWaiter.
    validasiFormLengkap // Ekspor fungsi validasiFormLengkap.
};
