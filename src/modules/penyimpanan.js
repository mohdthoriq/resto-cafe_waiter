// c:\projectku\belajar\project 2\waiters\src\modules\penyimpanan.js

const kunci = { // Objek untuk menyimpan semua kunci (key) yang digunakan di localStorage dan sessionStorage.
    waiter: 'dataWaiter_v2', // Kunci untuk data sesi waiter.
    keranjang: 'keranjangPesanan_v2', // Kunci untuk data keranjang belanja.
    history: 'historyPesanan_v2', // Kunci untuk riwayat pesanan.
    backup: 'backupWaiter' // Kunci untuk backup data waiter di localStorage.
};

// Enkripsi sederhana
function enkripsiSederhana(text) { // Fungsi untuk mengenkripsi teks secara sederhana.
    const shifted = text.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 7)).join(''); // Geser setiap karakter (Caesar cipher).
    return btoa(shifted); // Encode hasilnya ke Base64 agar aman disimpan.
}

// Dekripsi sederhana
function dekripsiSederhana(encodedText) { // Fungsi untuk mendekripsi teks yang dienkripsi oleh fungsi di atas.
    
    //langkah 1:  mengembalikan dari base64 ke teks geseran
    const decoded = atob(encodedText); // Decode dari Base64.
    
    // langkah 2 : menggeser setiap karak ter keposisi semula
    return decoded.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 7)).join(''); // Geser kembali setiap karakter.
}

// Hapus data waiter
function hapusDataWaiter() { // Fungsi untuk menghapus data sesi waiter.
    sessionStorage.removeItem(kunci.waiter); // Hapus dari sessionStorage.
    localStorage.removeItem(kunci.backup); // Hapus juga backup-nya dari localStorage.
}

// Ambil data waiter
function ambilDataWaiter() { // Fungsi untuk mengambil data waiter yang sedang login.
    try { // Gunakan try-catch untuk menangani kemungkinan error saat parsing JSON atau dekripsi.
        let dataEnkripsi = sessionStorage.getItem(kunci.waiter); // Coba ambil dari sessionStorage terlebih dahulu.
        if (!dataEnkripsi) { // Jika tidak ada di sessionStorage (misal: tab ditutup lalu dibuka lagi).
            const backup = localStorage.getItem(kunci.backup); // Coba ambil dari backup di localStorage.
            if (backup) { // Jika backup ada.
                const backupObj = JSON.parse(backup); // Ubah string JSON menjadi objek.
                if (Date.now() < backupObj.expiry) { // Cek apakah backup belum kedaluwarsa.
                    dataEnkripsi = backupObj.data; // Ambil data terenkripsi dari backup.
                    sessionStorage.setItem(kunci.waiter, dataEnkripsi); // Kembalikan ke sessionStorage.
                } else { // Jika backup sudah kedaluwarsa.
                    localStorage.removeItem(kunci.backup); // Hapus backup tersebut.
                }
            }
        }
        if (!dataEnkripsi) return null; // Jika data tetap tidak ditemukan, kembalikan null.
        
        const dataString = dekripsiSederhana(dataEnkripsi); // Dekripsi data yang ditemukan.
        return JSON.parse(dataString); // Ubah string JSON hasil dekripsi menjadi objek dan kembalikan.
    } catch (error) { // Jika terjadi error.
        console.error('❌ Gagal mengambil data waiter:', error); // Tampilkan error di konsol.
        hapusDataWaiter(); // Hapus data yang mungkin rusak.
        return null; // Kembalikan null.
    }
}

// Simpan data waiter
function simpanDataWaiter(dataWaiter) { // Fungsi untuk menyimpan data waiter saat login.
    try { // Gunakan try-catch untuk menangani error.
        const dataLengkap = { // Buat objek data yang lebih lengkap.
            ...dataWaiter, // Salin semua properti dari dataWaiter (nama, shift, dll).
            waiterId: 'W' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5), // Buat ID unik untuk waiter.
            waktuLogin: new Date().toISOString(), // Catat waktu login.
            sessionId: 'S' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9), // Buat ID sesi unik.
            versi: '2.0' // Versi data.
        };
        const dataEnkripsi = enkripsiSederhana(JSON.stringify(dataLengkap)); // Ubah objek menjadi string JSON, lalu enkripsi.
        sessionStorage.setItem(kunci.waiter, dataEnkripsi); // Simpan ke sessionStorage (data hilang saat browser ditutup).
        
        const backupData = { // Buat objek untuk backup.
            data: dataEnkripsi, // Data yang sama.
            timestamp: Date.now(), // Waktu backup dibuat.
            expiry: Date.now() + (24 * 60 * 60 * 1000) // Waktu kedaluwarsa (24 jam dari sekarang).
        };
        localStorage.setItem(kunci.backup, JSON.stringify(backupData)); // Simpan backup ke localStorage (data tetap ada).
        
        return { success: true, data: dataLengkap }; // Kembalikan status sukses dan data lengkap.
    } catch (error) { // Jika terjadi error.
        console.error('❌ Gagal menyimpan data waiter:', error); // Tampilkan error di konsol.
        return { success: false, error: error.message }; // Kembalikan status gagal dan pesan error.
    }
}

// Simpan keranjang
function simpanKeranjang(keranjang) { // Fungsi untuk menyimpan data keranjang ke localStorage.
    try { // Gunakan try-catch.
        const dataKeranjang = { items: keranjang, timestamp: Date.now(), version: '2.0' }; // Buat objek keranjang dengan metadata.
        localStorage.setItem(kunci.keranjang, JSON.stringify(dataKeranjang)); // Ubah ke string JSON dan simpan.
        return true; // Kembalikan true jika berhasil.
    } catch (error) { // Jika gagal.
        console.error('❌ Gagal menyimpan keranjang:', error); // Tampilkan error.
        return false; // Kembalikan false.
    }
}

// Ambil keranjang
function ambilKeranjang() { // Fungsi untuk mengambil data keranjang dari localStorage.
    try { // Gunakan try-catch.
        const dataString = localStorage.getItem(kunci.keranjang); // Ambil data string dari localStorage.
        if (!dataString) return []; // Jika tidak ada data, kembalikan array kosong.
        const dataKeranjang = JSON.parse(dataString); // Ubah string JSON menjadi objek.
        return dataKeranjang.items || []; // Kembalikan array 'items' dari objek, atau array kosong jika tidak ada.
    } catch (error) { // Jika gagal.
        console.error('❌ Gagal mengambil keranjang:', error); // Tampilkan error.
        return []; // Kembalikan array kosong.
    }
}

// Simpan history pesanan
function simpanHistory(pesanan) { // Fungsi untuk menyimpan pesanan yang sudah selesai ke riwayat.
    try { // Gunakan try-catch.
        let history = ambilHistory(); // Ambil data riwayat yang sudah ada.
        history.unshift({ ...pesanan, timestamp: Date.now() }); // Tambahkan pesanan baru di awal array, beserta timestamp.
        if (history.length > 50) history = history.slice(0, 50); // Batasi jumlah riwayat hingga 50 entri.
        localStorage.setItem(kunci.history, JSON.stringify({ data: history, version: '2.0' })); // Simpan kembali ke localStorage.
        return true; // Kembalikan true jika berhasil.
    } catch (error) { // Jika gagal.
        console.error('❌ Gagal menyimpan history:', error); // Tampilkan error.
        return false; // Kembalikan false.
    }
}

// Ambil history pesanan
function ambilHistory() { // Fungsi untuk mengambil riwayat pesanan dari localStorage.
    try { // Gunakan try-catch.
        const dataString = localStorage.getItem(kunci.history); // Ambil data string dari localStorage.
        if (!dataString) return []; // Jika tidak ada, kembalikan array kosong.
        const dataHistory = JSON.parse(dataString); // Ubah string JSON menjadi objek.
        return dataHistory.data || []; // Kembalikan array 'data' dari objek, atau array kosong jika tidak ada.
    } catch (error) { // Jika gagal.
        console.error('❌ Gagal mengambil history:', error); // Tampilkan error.
        return []; // Kembalikan array kosong.
    }
}

// Bersihkan semua data
function bersihkanSemuaData() { // Fungsi untuk membersihkan semua data aplikasi dari browser (saat logout).
    Object.values(kunci).forEach(k => { // Loop melalui semua nilai kunci yang terdaftar.
        localStorage.removeItem(k); // Hapus item dari localStorage.
        sessionStorage.removeItem(k); // Hapus item dari sessionStorage.
    });
    console.log('🗑️ Semua data berhasil dibersihkan'); // Log untuk debugging.
}

export const modulPenyimpanan = { // Mengekspor semua fungsi agar bisa digunakan di file lain.
    ambilDataWaiter, // Ekspor fungsi ambilDataWaiter.
    simpanDataWaiter, // Ekspor fungsi simpanDataWaiter.
    hapusDataWaiter, // Ekspor fungsi hapusDataWaiter.
    simpanKeranjang, // Ekspor fungsi simpanKeranjang.
    ambilKeranjang, // Ekspor fungsi ambilKeranjang.
    simpanHistory, // Ekspor fungsi simpanHistory.
    ambilHistory, // Ekspor fungsi ambilHistory.
    bersihkanSemuaData // Ekspor fungsi bersihkanSemuaData.
};
