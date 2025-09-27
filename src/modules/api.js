// c:\projectku\belajar\project 2\waiters\src\modules\api.js

import { dataMenuRestoran } from './config.js'; // Mengimpor data menu statis dari file config.

// Simulasi fetch menu dari server
async function ambilDaftarMenu() { // Fungsi asinkron untuk mensimulasikan pengambilan data menu dari server.
    try { // Blok untuk menangani kemungkinan error.
        console.log('🌐 Mengambil daftar menu dari server (simulasi)...'); // Log untuk debugging.
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulasi jeda waktu (delay) jaringan selama 1.2 detik.

        if (Math.random() < 0.1) throw new Error('Gagal terhubung ke server menu.'); // Simulasi 10% kemungkinan gagal.
        console.log('✅ Daftar menu berhasil diambil.'); // Log jika berhasil.
        
        return { success: true, data: dataMenuRestoran }; // Kembalikan status sukses dan data menu.
    } catch (error) { // Jika terjadi error (misalnya dari 'throw new Error').
        console.error('❌ Gagal mengambil daftar menu:', error); // Log error.
        return { success: false, error: error.message }; // Kembalikan status gagal dan pesan error.
    }
}

// Simulasi menyimpan pesanan
async function simpanPesanan(pesanan) { // Fungsi asinkron untuk mensimulasikan penyimpanan pesanan ke server.
    try { // Blok untuk menangani kemungkinan error.
        console.log('💾 Menyimpan pesanan ke server (simulasi)...', pesanan); // Log untuk debugging.
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulasi jeda waktu jaringan selama 0.8 detik.
        if (Math.random() < 0.05) throw new Error('Gagal menyimpan pesanan, coba lagi.'); // Simulasi 5% kemungkinan gagal.
        const orderId = 'ORD-' + Date.now(); // Buat ID pesanan unik berdasarkan timestamp.
        console.log(`✅ Pesanan berhasil disimpan dengan ID: ${orderId}`); // Log jika berhasil.
        return { success: true, orderId: orderId }; // Kembalikan status sukses dan ID pesanan yang baru dibuat.
    } catch (error) { // Jika terjadi error.
        console.error('❌ Gagal menyimpan pesanan:', error); // Log error.
        return { success: false, error: error.message }; // Kembalikan status gagal dan pesan error.
    }
}

// Simulasi validasi server untuk login
function simulasiValidasiServer(dataWaiter) { // Fungsi untuk mensimulasikan validasi login di sisi server.
    return new Promise((resolve, reject) => { // Menggunakan Promise untuk menangani operasi asinkron.
        setTimeout(() => { // Simulasi jeda waktu jaringan.
            const random = Math.random(); // Hasilkan angka acak.
            if (random > 0.95) { // 5% kemungkinan error server.
                reject(new Error('Server tidak dapat dijangkau. Coba lagi nanti.')); // Kirim status gagal (reject).
            } else if (dataWaiter.kodeWaiter === 'TEST123') { // Jika kode waiter adalah 'TEST123' (untuk testing).
                reject(new Error('Kode waiter tidak valid atau sudah digunakan.')); // Kirim status gagal.
            } else { // Jika tidak ada masalah.
                resolve({ status: 'authorized' }); // Kirim status berhasil (resolve).
            }
        }, Math.random() * 1000 + 500); // Jeda waktu acak antara 0.5 - 1.5 detik.
    });
}

export const modulAPIRestoran = { // Mengekspor semua fungsi simulasi API.
    ambilDaftarMenu, // Ekspor fungsi ambilDaftarMenu.
    simpanPesanan, // Ekspor fungsi simpanPesanan.
    simulasiValidasiServer // Ekspor fungsi simulasiValidasiServer.
};
