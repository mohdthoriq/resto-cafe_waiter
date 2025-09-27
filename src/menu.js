// c:\projectku\belajar\project 2\waiters\src\menu.js

import { modulTema } from './modules/tema.js'; // Mengimpor modul untuk mengelola tema (gelap/terang).
import { modulPenyimpanan } from './modules/penyimpanan.js'; // Mengimpor modul untuk menyimpan dan mengambil data dari storage.
import { modulNotifikasi } from './modules/notifikasi.js'; // Mengimpor modul untuk menampilkan notifikasi toast.
import { modulAPIRestoran } from './modules/api.js'; // Mengimpor modul untuk simulasi panggilan API ke server.

const aplikasiMenu = { // Objek utama yang mengelola semua logika di halaman menu.
    state: { // Objek untuk menyimpan semua data dinamis (state) dari aplikasi.
        dataWaiter: null, // Menyimpan data waiter yang sedang login.
        semuaMenu: [], // Menyimpan semua data menu dari server.
        menuTampil: [], // Menyimpan data menu yang sedang ditampilkan (setelah difilter/dicari).
        keranjang: [], // Menyimpan item-item yang ada di keranjang.
        filterKategori: 'semua', // Menyimpan kategori filter yang sedang aktif.
        kataKunciPencarian: '' // Menyimpan kata kunci yang sedang digunakan untuk pencarian.
    },

    inisialisasi: async function() { // Fungsi yang dijalankan pertama kali saat halaman menu dimuat.
        console.log('🚀 Memulai aplikasi menu...'); // Log untuk debugging.
        modulTema.inisialisasi(); // Menginisialisasi tema.
        modulNotifikasi.inisialisasi(); // Menginisialisasi container untuk notifikasi toast.

        this.state.dataWaiter = modulPenyimpanan.ambilDataWaiter(); // Mengambil data waiter dari session storage.
        if (!this.state.dataWaiter) { // Jika tidak ada data waiter (sesi tidak valid).
            alert('Sesi Anda tidak valid. Anda akan dikembalikan ke halaman login.'); // Tampilkan peringatan.
            window.location.href = 'index.html'; // Arahkan kembali ke halaman login.
            return; // Hentikan eksekusi fungsi.
        }

        this.updateInfoWaiter(); // Memperbarui tampilan informasi waiter di header.
        this.setupEventListeners(); // Menyiapkan semua event listener.
        await this.muatMenu(); // Memuat data menu dari server (proses asinkron).
        this.muatKeranjang(); // Memuat data keranjang dari local storage.

        setTimeout(() => { // Setelah jeda singkat, sembunyikan layar loading.
            document.getElementById('loadingScreen').classList.add('fade-out'); // Tambahkan efek fade-out ke layar loading.
            document.getElementById('mainContainer').classList.remove('hidden'); // Tampilkan konten utama.
        }, 500); // Jeda 500 milidetik.
    },

    setupEventListeners: function() { // Fungsi untuk mendaftarkan semua event listener di halaman menu.
        document.getElementById('tombolTheme').addEventListener('click', modulTema.toggleTema); // Event untuk tombol ganti tema.
        document.getElementById('tombolLogout').addEventListener('click', this.logout.bind(this)); // Event untuk tombol logout.
        document.getElementById('tombolHistory').addEventListener('click', this.tampilkanHistory.bind(this)); // Event untuk tombol history pesanan.
        document.querySelector('.filter-buttons').addEventListener('click', this.handleFilter.bind(this)); // Event untuk tombol filter kategori.
        document.getElementById('inputPencarian').addEventListener('input', this.debounce(this.handlePencarian.bind(this), 300)); // Event untuk input pencarian dengan debounce.
        document.getElementById('clearSearch').addEventListener('click', this.bersihkanPencarian.bind(this)); // Event untuk tombol hapus teks pencarian.
        document.getElementById('daftarMenu').addEventListener('click', this.handleAksiMenu.bind(this)); // Event delegation untuk tombol 'Tambah' pada setiap kartu menu.
        document.getElementById('tombolCheckout').addEventListener('click', this.tampilkanModalCheckout.bind(this)); // Event untuk tombol checkout.
        document.getElementById('tombolBersihkanKeranjang').addEventListener('click', this.bersihkanKeranjang.bind(this)); // Event untuk tombol kosongkan keranjang.
        document.getElementById('daftarKeranjang').addEventListener('click', this.handleAksiKeranjang.bind(this)); // Event delegation untuk tombol +/- di keranjang.
        document.getElementById('konfirmasiCheckout').addEventListener('click', this.prosesCheckout.bind(this)); // Event untuk tombol konfirmasi checkout di modal.
        document.getElementById('tombolCobaLagi').addEventListener('click', this.muatMenu.bind(this)); // Event untuk tombol "Coba Lagi" saat menu gagal dimuat.
        document.querySelector('.history-filters').addEventListener('click', this.handleFilterHistory.bind(this)); // Event untuk filter di modal history.
        
        // Modal listeners
        document.querySelectorAll('.modal-close, .btn-cancel, .modal-overlay').forEach(el => { // Dapatkan semua elemen untuk menutup modal.
            el.addEventListener('click', (e) => { // Tambahkan event listener klik pada setiap elemen.
                const modal = e.target.closest('.modal'); // Cari elemen modal terdekat dari elemen yang diklik.
                if(modal) this.tutupModal(modal.id); // Jika modal ditemukan, tutup modal tersebut.
            });
        });
    },

    muatMenu: async function() { // Fungsi untuk memuat data menu dari API.
        this.tampilkanStatusMenu('loading'); // Tampilkan status loading.

        // --- ini adalah lokasi pemganggilan API GET ---
    
        const hasil = await modulAPIRestoran.ambilDaftarMenu(); // Panggil API untuk mengambil menu.
        if (hasil.success) { // Jika berhasil.
            this.state.semuaMenu = hasil.data.filter(item => item.available); // Simpan menu yang tersedia ke state.
            this.filterDanRenderMenu(); // Filter dan render menu ke layar.
            this.tampilkanStatusMenu('success'); // Sembunyikan status loading.
        } else { // Jika gagal.
            this.tampilkanStatusMenu('error'); // Tampilkan status error.
        }
    },

    muatKeranjang: function() { // Fungsi untuk memuat data keranjang dari local storage.
        this.state.keranjang = modulPenyimpanan.ambilKeranjang(); // Ambil data keranjang.
        this.renderKeranjang(); // Render keranjang ke layar.
    },

    filterDanRenderMenu: function() { // Fungsi untuk memfilter dan merender menu.
        let menu = [...this.state.semuaMenu]; // Salin semua data menu agar tidak mengubah data asli.
        if (this.state.filterKategori !== 'semua') { // Jika filter kategori bukan 'semua'.
            menu = menu.filter(item => item.category === this.state.filterKategori); // Filter menu berdasarkan kategori.
        }
        if (this.state.kataKunciPencarian) { // Jika ada kata kunci pencarian.
            const keyword = this.state.kataKunciPencarian.toLowerCase(); // Ubah kata kunci ke huruf kecil.
            menu = menu.filter(item => item.name.toLowerCase().includes(keyword)); // Filter menu berdasarkan nama.
        }
        this.state.menuTampil = menu; // Simpan hasil filter ke state.
        this.renderMenu(); // Render menu yang sudah difilter.
    },

    renderMenu: function() { // Fungsi untuk menampilkan daftar menu ke DOM.
        const container = document.getElementById('daftarMenu'); // Dapatkan elemen kontainer menu.
        container.innerHTML = ''; // Kosongkan kontainer.
        if (this.state.menuTampil.length === 0) { // Jika tidak ada menu yang akan ditampilkan.
            this.tampilkanStatusMenu('empty'); // Tampilkan status 'kosong'.
            return; // Hentikan fungsi.
        }
        this.tampilkanStatusMenu('success'); // Pastikan area menu terlihat.
        const fragment = document.createDocumentFragment(); // Buat DocumentFragment untuk efisiensi DOM manipulation.
        this.state.menuTampil.forEach(item => { // Loop untuk setiap item menu yang akan ditampilkan.
            const card = document.createElement('div'); // Buat elemen div baru untuk kartu menu.
            card.className = 'card-menu'; // Atur kelas CSS.
            card.dataset.id = item.menu_id; // Simpan ID menu di dataset.
            card.innerHTML = `
                <div class="menu-image-container">
                    <img src="${item.image}" alt="${item.name}" class="menu-image" loading="lazy">
                </div>
                <div class="menu-content">
                    <div class="menu-header"><div class="menu-info">
                        <h3 class="menu-nama">${item.name}</h3>
                        <p class="menu-deskripsi">${item.description}</p>
                        <span class="menu-kategori">${item.category.replace('_', ' ')}</span>
                    </div></div>
                </div>
                <div class="menu-footer">
                    <span class="menu-harga">Rp ${item.price.toLocaleString('id-ID')}</span>
                    <button class="btn-tambah" data-id="${item.menu_id}"><i class="fas fa-plus"></i> Tambah</button>
                </div>`; // Isi HTML untuk kartu menu.
            fragment.appendChild(card); // Tambahkan kartu ke fragment.
        });
        container.appendChild(fragment); // Tambahkan semua kartu dari fragment ke DOM sekaligus.
    },

    renderKeranjang: function() { // Fungsi untuk menampilkan isi keranjang dan total harga.
        const daftarEl = document.getElementById('daftarKeranjang'); // Dapatkan elemen kontainer item keranjang.
        daftarEl.querySelector('.keranjang-kosong').style.display = this.state.keranjang.length === 0 ? 'block' : 'none'; // Tampilkan/sembunyikan pesan 'keranjang kosong'.
        daftarEl.querySelectorAll('.item-keranjang').forEach(item => item.remove()); // Hapus semua item keranjang yang ada untuk di-render ulang.

        let subtotal = 0; // Inisialisasi subtotal.
        const fragment = document.createDocumentFragment(); // Buat fragment untuk efisiensi.
        this.state.keranjang.forEach(item => { // Loop untuk setiap item di keranjang.
            subtotal += item.price * item.quantity; // Hitung subtotal.
            const itemEl = document.createElement('div'); // Buat elemen div untuk item keranjang.
            itemEl.className = 'item-keranjang'; // Atur kelas CSS.
            itemEl.dataset.id = item.menu_id; // Simpan ID menu di dataset.
            itemEl.innerHTML = `
                <div class="item-info">
                    <div class="item-nama">${item.name}</div>
                    <div class="item-harga">Rp ${item.price.toLocaleString('id-ID')}</div>
                </div>
                <div class="quantity-controls">
                    <button class="btn-quantity" data-action="decrease" data-id="${item.menu_id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="btn-quantity" data-action="increase" data-id="${item.menu_id}">+</button>
                </div>`; // Isi HTML untuk item keranjang.
            fragment.appendChild(itemEl); // Tambahkan item ke fragment.
        });
        daftarEl.appendChild(fragment); // Tambahkan semua item dari fragment ke DOM.

        const pajak = subtotal * 0.10; // Hitung pajak 10%.
        const total = subtotal + pajak; // Hitung total harga.
        document.getElementById('jumlahItem').textContent = this.state.keranjang.reduce((sum, item) => sum + item.quantity, 0); // Update jumlah total item.
        document.getElementById('subtotalHarga').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`; // Update tampilan subtotal.
        document.getElementById('pajakHarga').textContent = `Rp ${pajak.toLocaleString('id-ID')}`; // Update tampilan pajak.
        document.getElementById('totalHarga').innerHTML = `<strong>Rp ${total.toLocaleString('id-ID')}</strong>`; // Update tampilan total harga.
        document.getElementById('tombolCheckout').disabled = this.state.keranjang.length === 0; // Aktifkan/nonaktifkan tombol checkout.
        modulPenyimpanan.simpanKeranjang(this.state.keranjang); // Simpan state keranjang terbaru ke local storage.
    },

    tambahKeKeranjang: function(menuId) { // Fungsi untuk menambahkan item ke keranjang.
        const menu = this.state.semuaMenu.find(m => m.menu_id === menuId); // Cari data menu berdasarkan ID.
        if (!menu) return; // Jika menu tidak ditemukan, hentikan.
        const itemDiKeranjang = this.state.keranjang.find(item => item.menu_id === menuId); // Cek apakah item sudah ada di keranjang.
        if (itemDiKeranjang) { // Jika sudah ada.
            itemDiKeranjang.quantity++; // Tambah kuantitasnya.
        } else { // Jika belum ada.
            this.state.keranjang.push({ menu_id: menu.menu_id, name: menu.name, price: menu.price, quantity: 1 }); // Tambahkan item baru ke keranjang.
        }
        modulNotifikasi.tampilkanToast('Ditambahkan', `${menu.name} masuk ke keranjang.`, 'success'); // Tampilkan notifikasi.
        this.renderKeranjang(); // Render ulang keranjang.
    },

    updateKuantitasKeranjang: function(menuId, action) { // Fungsi untuk mengubah kuantitas item di keranjang.
        const itemIndex = this.state.keranjang.findIndex(item => item.menu_id === menuId); // Cari index item di keranjang.
        if (itemIndex === -1) return; // Jika tidak ditemukan, hentikan.
        if (action === 'increase') { // Jika aksinya adalah 'increase'.
            this.state.keranjang[itemIndex].quantity++; // Tambah kuantitas.
        } else if (action === 'decrease') { // Jika aksinya adalah 'decrease'.
            this.state.keranjang[itemIndex].quantity--; // Kurangi kuantitas.
            if (this.state.keranjang[itemIndex].quantity === 0) { // Jika kuantitas menjadi 0.
                this.state.keranjang.splice(itemIndex, 1); // Hapus item dari keranjang.
            }
        }
        this.renderKeranjang(); // Render ulang keranjang.
    },

    bersihkanKeranjang: function() { // Fungsi untuk mengosongkan keranjang.
        if (this.state.keranjang.length > 0 && confirm('Anda yakin ingin mengosongkan keranjang?')) { // Jika keranjang tidak kosong dan pengguna mengonfirmasi.
            this.state.keranjang = []; // Kosongkan array keranjang.
            this.renderKeranjang(); // Render ulang keranjang.
            modulNotifikasi.tampilkanToast('Info', 'Keranjang berhasil dikosongkan.', 'info'); // Tampilkan notifikasi.
        }
    },

    prosesCheckout: async function() { // Fungsi untuk memproses checkout.
        const pesanan = { // Buat objek pesanan.
            waiter: this.state.dataWaiter.nama, // Nama waiter.
            items: this.state.keranjang, // Item yang dipesan.
            subtotal: this.state.keranjang.reduce((sum, item) => sum + item.price * item.quantity, 0), // Hitung subtotal.
            pajak: this.state.keranjang.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.10, // Hitung pajak.
            total: this.state.keranjang.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.10, // Hitung total.
            status: 'served' // Atur status pesanan.
        };
        const hasil = await modulAPIRestoran.simpanPesanan(pesanan); // Kirim pesanan ke server (simulasi).
        if (hasil.success) { // Jika berhasil.
            pesanan.orderId = hasil.orderId; // Tambahkan ID pesanan dari server ke objek pesanan.
            modulPenyimpanan.simpanHistory(pesanan); // Simpan pesanan ke riwayat (history).
            this.state.keranjang = []; // Kosongkan keranjang.
            this.renderKeranjang(); // Render ulang keranjang.
            this.tutupModal('modalCheckout'); // Tutup modal checkout.
            modulNotifikasi.tampilkanToast('Berhasil', `Pesanan ${hasil.orderId} telah dikonfirmasi.`, 'success', 5000); // Tampilkan notifikasi sukses.
        } else { // Jika gagal.
            modulNotifikasi.tampilkanToast('Gagal', hasil.error, 'error'); // Tampilkan notifikasi error.
        }
    },

    logout: function() { // Fungsi untuk logout.
        if (confirm('Anda yakin ingin logout?')) { // Minta konfirmasi.
            modulPenyimpanan.bersihkanSemuaData(); // Hapus semua data dari storage.
            window.location.href = 'index.html'; // Arahkan ke halaman login.
        }
    },

    // Handlers & Helpers
    handleFilter: function(e) { // Handler untuk klik pada tombol filter kategori.
        const target = e.target.closest('.btn-filter'); // Dapatkan tombol filter yang diklik.
        if (!target) return; // Jika bukan tombol filter, hentikan.
        document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active')); // Hapus kelas 'active' dari semua tombol.
        target.classList.add('active'); // Tambahkan kelas 'active' ke tombol yang diklik.
        this.state.filterKategori = target.dataset.kategori; // Update state filter kategori.
        this.filterDanRenderMenu(); // Filter dan render ulang menu.
    },
    handlePencarian: function(e) { // Handler untuk input pada kolom pencarian.
        this.state.kataKunciPencarian = e.target.value; // Update state kata kunci pencarian.
        document.getElementById('clearSearch').style.display = e.target.value ? 'flex' : 'none'; // Tampilkan/sembunyikan tombol 'clear'.
        this.filterDanRenderMenu(); // Filter dan render ulang menu.
    },
    bersihkanPencarian: function() { // Handler untuk tombol 'clear' pada pencarian.
        const input = document.getElementById('inputPencarian'); // Dapatkan elemen input.
        input.value = ''; // Kosongkan nilai input.
        this.state.kataKunciPencarian = ''; // Kosongkan state kata kunci.
        document.getElementById('clearSearch').style.display = 'none'; // Sembunyikan tombol 'clear'.
        this.filterDanRenderMenu(); // Filter dan render ulang menu.
        input.focus(); // Fokuskan kembali ke input.
    },
    handleAksiMenu: function(e) { // Handler untuk aksi pada daftar menu (event delegation).
        const target = e.target.closest('.btn-tambah'); // Cek apakah yang diklik adalah tombol 'tambah'.
        if (target) this.tambahKeKeranjang(parseInt(target.dataset.id, 10)); // Jika ya, panggil fungsi tambahKeKeranjang.
    },
    handleAksiKeranjang: function(e) { // Handler untuk aksi pada keranjang (event delegation).
        const target = e.target.closest('.btn-quantity'); // Cek apakah yang diklik adalah tombol kuantitas (+/-).
        if (target) this.updateKuantitasKeranjang(parseInt(target.dataset.id, 10), target.dataset.action); // Jika ya, panggil fungsi updateKuantitas.
    },
    updateInfoWaiter: function() { // Fungsi untuk memperbarui info waiter di header.
        document.getElementById('namaWaiterTampil').textContent = this.state.dataWaiter.nama; // Set nama waiter.
        document.getElementById('shiftWaiterTampil').textContent = `Shift ${this.state.dataWaiter.shift}`; // Set shift waiter.
    },
    tampilkanStatusMenu: function(status) { // Fungsi untuk menampilkan status saat memuat menu (loading, error, empty).
        document.getElementById('statusLoading').classList.toggle('hidden', status !== 'loading'); // Tampilkan/sembunyikan status loading.
        document.getElementById('statusError').classList.toggle('hidden', status !== 'error'); // Tampilkan/sembunyikan status error.
        document.getElementById('statusKosong').classList.toggle('hidden', status !== 'empty'); // Tampilkan/sembunyikan status kosong.
        document.getElementById('daftarMenu').classList.toggle('hidden', status !== 'success'); // Tampilkan/sembunyikan daftar menu.
    },
    tutupModal: (modalId) => document.getElementById(modalId).classList.remove('show'), // Fungsi singkat untuk menutup modal.
    bukaModal: (modalId) => document.getElementById(modalId).classList.add('show'), // Fungsi singkat untuk membuka modal.
    tampilkanModalCheckout: function() { // Fungsi untuk menampilkan modal konfirmasi checkout.
        if (this.state.keranjang.length === 0) return; // Jika keranjang kosong, hentikan.
        document.getElementById('checkoutWaiter').textContent = this.state.dataWaiter.nama; // Isi nama waiter.
        document.getElementById('checkoutOrderId').textContent = 'ORD-' + Date.now(); // Buat ID order sementara.
        document.getElementById('checkoutWaktu').textContent = new Date().toLocaleString('id-ID'); // Isi waktu checkout.
        const ringkasanContainer = document.getElementById('ringkasanPesanan'); // Dapatkan kontainer ringkasan.
        ringkasanContainer.innerHTML = this.state.keranjang.map(item => `
            <div class="ringkasan-item">
                <div class="ringkasan-info"><h4>${item.name}</h4><span class="ringkasan-detail">${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</span></div>
                <span class="ringkasan-harga">Rp ${(item.quantity * item.price).toLocaleString('id-ID')}</span>
            </div>`).join(''); // Buat HTML untuk setiap item dan gabungkan.
        document.getElementById('checkoutSubtotal').textContent = document.getElementById('subtotalHarga').textContent; // Salin subtotal.
        document.getElementById('checkoutPajak').textContent = document.getElementById('pajakHarga').textContent; // Salin pajak.
        document.getElementById('checkoutTotal').innerHTML = document.getElementById('totalHarga').innerHTML; // Salin total.
        this.bukaModal('modalCheckout'); // Tampilkan modal.
    },

    tampilkanHistory: function() { // Fungsi untuk menampilkan modal history.
        this.renderHistory(); // Render isi history.
        this.bukaModal('modalHistory'); // Tampilkan modal history.
    },

    renderHistory: function(filterHari = 'semua') { // Fungsi untuk merender daftar riwayat pesanan.
        const historyData = modulPenyimpanan.ambilHistory(); // Ambil data history dari storage.
        const container = document.getElementById('daftarHistory'); // Dapatkan kontainer history.
        container.innerHTML = ''; // Kosongkan kontainer.

        // Logika filter bisa dikembangkan di sini berdasarkan `filterHari`

        if (historyData.length === 0) { // Jika tidak ada data history.
            container.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-muted);">Belum ada riwayat pesanan.</p>'; // Tampilkan pesan kosong.
            return; // Hentikan fungsi.
        }

        const fragment = document.createDocumentFragment(); // Buat fragment untuk efisiensi.
        historyData.forEach(order => { // Loop untuk setiap pesanan di history.
            const itemEl = document.createElement('div'); // Buat elemen div untuk item history.
            itemEl.className = 'history-item'; // Atur kelas CSS.
            itemEl.innerHTML = `
                <div class="history-header">
                    <span class="history-id">${order.orderId}</span>
                    <span class="history-status status-${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="history-waktu">${new Date(order.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                <div class="history-items">${order.items.length} item oleh ${order.waiter}</div>
                <div class="history-total">Rp ${order.total.toLocaleString('id-ID')}</div>
            `; // Isi HTML untuk item history.
            fragment.appendChild(itemEl); // Tambahkan item ke fragment.
        });
        container.appendChild(fragment); // Tambahkan semua item dari fragment ke DOM.
    },

    handleFilterHistory: function(e) { // Handler untuk filter pada modal history.
        const target = e.target.closest('.filter-history'); // Dapatkan tombol filter yang diklik.
        if (!target) return; // Jika bukan tombol filter, hentikan.

        document.querySelectorAll('.filter-history').forEach(btn => btn.classList.remove('active')); // Hapus kelas 'active' dari semua tombol.
        target.classList.add('active'); // Tambahkan kelas 'active' ke tombol yang diklik.

        const filter = target.dataset.hari; // Dapatkan nilai filter dari dataset.
        this.renderHistory(filter); // Render ulang history dengan filter yang dipilih.
        modulNotifikasi.tampilkanToast('Filter Riwayat', `Menampilkan riwayat untuk: ${target.textContent}`, 'info'); // Tampilkan notifikasi.
    },

    debounce: function(func, wait) { // Utilitas untuk menunda eksekusi fungsi (misal: saat mengetik di pencarian).
        let timeout; // Variabel untuk menyimpan ID timeout.
        return function(...args) { // Kembalikan fungsi baru.
            clearTimeout(timeout); // Hapus timeout sebelumnya jika ada.
            timeout = setTimeout(() => func.apply(this, args), wait); // Set timeout baru untuk menjalankan fungsi setelah 'wait' milidetik.
        };
    }
};

document.addEventListener('DOMContentLoaded', () => { // Event yang dijalankan setelah seluruh halaman HTML selesai dimuat.
    aplikasiMenu.inisialisasi(); // Memulai aplikasi menu.
});
