// c:\projectku\belajar\project 2\waiters\src\modules\config.js

export const dataMenuRestoran = [ // Mengekspor array yang berisi data menu restoran (simulasi database).
    { // Setiap objek merepresentasikan satu item menu.
        menu_id: 1, // ID unik untuk setiap menu.
        name: "Nasi Gudeg Jogja Special", // Nama menu.
        description: "Gudeg khas Yogyakarta dengan kuah santan kental, dilengkapi ayam, telur, dan krecek", // Deskripsi singkat menu.
        price: 28000, // Harga menu dalam Rupiah.
        category: "main_course", // Kategori menu (makanan utama, hidangan pembuka, dll).
        image: "assets/img/menu/nasi-gudeg.jpg", // Path ke gambar menu
        available: true, // Status ketersediaan menu (true jika tersedia).
        prep_time: 15, // Waktu persiapan dalam menit (data tambahan).
        spicy_level: 1 // Tingkat kepedasan (data tambahan).
    },
    {
        menu_id: 2,
        name: "Sate Klathak Pak Pong",
        description: "Sate kambing bakar khas Bantul dengan bumbu kecap manis dan lombok",
        price: 35000,
        category: "main_course",
        image: "assets/img/menu/sate-klathak.jpg",
        available: true,
        prep_time: 20,
        spicy_level: 2
    },
    {
        menu_id: 3,
        name: "Gado-Gado Jakarta",
        description: "Sayuran segar dengan bumbu kacang kental dan kerupuk",
        price: 18000,
        category: "appetizer",
        image: "assets/img/menu/gado2.jpg",
        available: true,
        prep_time: 10,
        spicy_level: 1
    },
    {
        menu_id: 4,
        name: "Es Dawet Ayu Banjarnegara",
        description: "Minuman tradisional dengan santan, gula merah, dan dawet kenyal",
        price: 12000,
        category: "beverages",
        image: "assets/img/menu/dawet.jpg",
        available: true,
        prep_time: 5,
        spicy_level: 0
    },
    {
        menu_id: 5,
        name: "Bakpia Pathok Original",
        description: "Kue tradisional Yogyakarta dengan isi kacang hijau manis",
        price: 15000,
        category: "dessert",
        image: "assets/img/menu/bakpia.jpg",
        available: true,
        prep_time: 5,
        spicy_level: 0
    },
    {
        menu_id: 6,
        name: "Ayam Goreng Kalasan",
        description: "Ayam goreng bumbu kalasan dengan nasi putih dan lalapan",
        price: 32000,
        category: "main_course",
        image: "assets/img/menu/ayam.jpg",
        available: true,
        prep_time: 18,
        spicy_level: 2
    },
    {
        menu_id: 7,
        name: "Wedang Ronde Jahe",
        description: "Minuman hangat dengan bola-bola tepung berisi kacang dan jahe",
        price: 10000,
        category: "beverages",
        image: "assets/img/menu/wedang-ronde.jpg",
        available: true,
        prep_time: 8,
        spicy_level: 1
    },
    {
        menu_id: 8,
        name: "Pecel Lele Lamongan",
        description: "Ikan lele goreng dengan sambal pecel dan nasi hangat",
        price: 22000,
        category: "main_course",
        image: "assets/img/menu/lele.jpg",
        available: true,
        prep_time: 12,
        spicy_level: 3
    },
    {
        menu_id: 9,
        name: "Rujak Cingur Surabaya",
        description: "Rujak tradisional dengan cingur, tahu, tempe dan bumbu petis",
        price: 16000,
        category: "appetizer",
        image: "assets/img/menu/rujak-cingur.jpg",
        available: false, // Contoh menu yang tidak tersedia.
        prep_time: 8,
        spicy_level: 2
    },
    {
        menu_id: 10,
        name: "Es Teh Manis Dingin",
        description: "Teh manis segar dengan es batu, sempurna untuk cuaca panas",
        price: 6000,
        category: "beverages",
        image: "assets/img/menu/teh-manis.jpg",
        available: true,
        prep_time: 3,
        spicy_level: 0
    },
    {
        menu_id: 11,
        name: "Klepon Pandan",
        description: "Kue tradisional pandan dengan isian gula merah dan kelapa parut",
        price: 12000,
        category: "dessert",
        image: "assets/img/menu/klepon.jpg",
        available: true,
        prep_time: 5,
        spicy_level: 0
    },
    {
        menu_id: 12,
        name: "Soto Ayam Lamongan",
        description: "Soto ayam kuah bening dengan telur, koya, dan kerupuk udang",
        price: 24000,
        category: "main_course",
        image: "assets/img/menu/soto.jpg",
        available: true,
        prep_time: 15,
        spicy_level: 1
    },
    {
        menu_id: 13,
        name: "Rawon Surabaya",
        description: "Sup daging sapi dengan kuah hitam khas Jawa Timur, disajikan dengan tauge dan telur asin",
        price: 28000,
        category: "main_course",
        image: "assets/img/menu/rawon.jpg",
        available: true,
        prep_time: 20,
        spicy_level: 1
    },
    {
        menu_id: 14,
        name: "Pempek Palembang",
        description: "Ikan tenggiri giling dicampur sagu, digoreng, dan disajikan dengan cuko asam pedas",
        price: 18000,
        category: "main_course",
        image: "assets/img/menu/Pempek.jpg",
        available: true,
        prep_time: 10,
        spicy_level: 2
    },
    {
        menu_id: 15,
        name: "Gudeg Jogja",
        description: "Nangka muda dimasak santan, disajikan dengan telur, ayam, dan sambal krecek",
        price: 27000,
        category: "main_course",
        image: "assets/img/menu/gudeg.jpg",
        available: true,
        prep_time: 25,
        spicy_level: 1
    },
    {
        menu_id: 16,
        name: "Kerak Telor",
        description: "Telur bebek dengan ketan, ebi, dan bawang goreng khas Betawi",
        price: 15000,
        category: "dessert",
        image: "assets/img/menu/Kerak-Telor.jpg",
        available: true,
        prep_time: 12,
        spicy_level: 1
    },
    {
        menu_id: 17,
        name: "Es Campur",
        description: "Minuman segar campuran buah, cincau, kolang-kaling, sirup, dan susu kental manis",
        price: 14000,
        category: "beverages",
        image: "assets/img/menu/es-campur.jpg",
        available: true,
        prep_time: 5,
        spicy_level: 0
    },
    {
        menu_id: 18,
        name: "Sop Buntut",
        description: "Sup iga sapi buntut dengan wortel, kentang, dan bumbu rempah",
        price: 32000,
        category: "main_course",
        image: "assets/img/menu/SopBuntut.jpg",
        available: true,
        prep_time: 25,
        spicy_level: 1
    },
    {
        menu_id: 19,
        name: "Kopi Tubruk",
        description: "Kopi hitam khas Indonesia dengan ampas yang kental",
        price: 8000,
        category: "beverages",
        image: "assets/img/menu/kopi.jpg",
        available: true,
        prep_time: 3,
        spicy_level: 0
    },
    {
        menu_id: 20,
        name: "Lumpia Semarang",
        description: "Kulit tipis berisi rebung, ayam, dan udang goreng renyah",
        price: 16000,
        category: "dessert",
        image: "assets/img/menu/lumpia.jpg",
        available: true,
        prep_time: 7,
        spicy_level: 1
    },
    {
        menu_id: 21,
        name: "Perkedel Kentang",
        description: "Kentang tumbuk dibentuk bulat, digoreng garing dengan bumbu bawang dan seledri",
        price: 10000,
        category: "appetizer",
        image: "assets/img/menu/perkedel.jpg",
        available: true,
        prep_time: 6,
        spicy_level: 0
    },
    {
        menu_id: 22,
        name: "Tahu Isi",
        description: "Tahu goreng isi sayuran dengan sambal kacang pedas",
        price: 8000,
        category: "appetizer",
        image: "assets/img/menu/tahu-isi.jpg",
        available: true,
        prep_time: 7,
        spicy_level: 1
    },
    {
        menu_id: 23,
        name: "Pisang Goreng",
        description: "Pisang kepok goreng renyah disajikan dengan taburan gula halus",
        price: 9000,
        category: "appetizer",
        image: "assets/img/menu/pisang-goreng.jpg",
        available: true,
        prep_time: 5,
        spicy_level: 0
    },
    {
        menu_id: 24,
        name: "Tempe Mendoan",
        description: "Tempe tipis digoreng setengah matang dengan balutan tepung berbumbu",
        price: 7000,
        category: "appetizer",
        image: "assets/img/menu/tempe.jpg",
        available: true,
        prep_time: 4,
        spicy_level: 0
    },
    {
        menu_id: 25,
        name: "Otak-Otak Goreng",
        description: "Ikan tenggiri halus dibungkus daun pisang, dipanggang, lalu digoreng",
        price: 12000,
        category: "appetizer",
        image: "assets/img/menu/Otak-otak.jpg",
        available: true,
        prep_time: 8,
        spicy_level: 1
    }


];
