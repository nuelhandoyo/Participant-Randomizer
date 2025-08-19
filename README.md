# Aplikasi Pengacakan Giliran Peserta

Aplikasi JavaScript untuk pengacakan giliran peserta dengan animasi bergaya Matrix dan sinkronisasi real-time.

## 🚀 Fitur Utama

### Tampilan Narasumber (Admin)
- **Upload CSV**: Drag & drop atau klik untuk upload file CSV berisi daftar nama
- **Input Manual**: Text area untuk memasukkan nama peserta (satu nama per baris)
- **Animasi Matrix**: Pengacakan nama dengan efek visual yang menarik
- **Export Data**: Download data lengkap dalam format CSV
- **Real-time Control**: Kontrol pengacakan dengan sinkronisasi langsung

### Tampilan Peserta (Viewer)
- **Animasi Sinkron**: Melihat pengacakan secara real-time
- **Status Panels**: Panel "Sudah Terpilih" dan "Belum Terpilih"
- **Timestamp**: Waktu terpilih untuk setiap peserta
- **Responsive**: Tampilan optimal di berbagai ukuran layar

## 📋 Persyaratan Sistem

- Node.js (versi 14 atau lebih baru)
- Browser modern dengan dukungan WebSocket
- Port 3000 (dapat dikonfigurasi)

## 🛠️ Instalasi dan Menjalankan

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Jalankan Server**
   ```bash
   npm start
   ```

3. **Akses Aplikasi**
   - Panel Narasumber: http://localhost:3000
   - Tampilan Peserta: http://localhost:3000/participant.html

## 📁 Struktur File

```
participant-randomizer/
├── server.js              # Server Node.js dengan WebSocket
├── index.html             # Tampilan narasumber (admin)
├── participant.html       # Tampilan peserta (viewer)
├── presenter.js           # Logic client-side narasumber
├── participant.js         # Logic client-side peserta
├── style.css             # Styling dengan efek Matrix
├── package.json          # Konfigurasi npm
└── README.md             # Dokumentasi
```

## 🎯 Cara Penggunaan

### Untuk Narasumber:

1. **Tambah Peserta**
   - Upload file CSV dengan daftar nama, atau
   - Ketik manual di text area (satu nama per baris)
   - Klik "Tambah Peserta"

2. **Mulai Pengacakan**
   - Klik tombol "Mulai Pengacakan"
   - Nikmati animasi Matrix selama 3 detik
   - Lihat hasil pengacakan

3. **Export Data**
   - Klik "Export Data" untuk download CSV
   - File berisi nama, status, dan timestamp

4. **Reset Data**
   - Klik "Reset" untuk mengulang dari awal
   - Konfirmasi untuk menghapus semua data

### Untuk Peserta:

1. **Buka Link Tampilan Peserta**
   - Akses melalui tombol "Tampilan Peserta" atau langsung ke `/participant.html`

2. **Monitor Status**
   - Lihat status koneksi di kanan atas
   - Panel kiri menampilkan yang sudah terpilih
   - Panel kanan menampilkan yang belum terpilih

3. **Saksikan Pengacakan**
   - Animasi akan berjalan otomatis ketika narasumber memulai
   - Hasil langsung tersinkronisasi

## 📊 Format File CSV

### Input CSV:
```csv
Ahmad Budi
Siti Rahma
Joko Susilo
Maria Dewi
```

### Output CSV:
```csv
Nama,Status,Tanggal Terpilih
"Ahmad Budi","Terpilih","12/01/2025 14:30:25"
"Siti Rahma","Belum Terpilih",""
"Joko Susilo","Terpilih","12/01/2025 14:32:10"
"Maria Dewi","Belum Terpilih",""
```

## 🔧 Konfigurasi

### Mengubah Port Server:
```bash
PORT=8080 npm start
```

### Kustomisasi Animasi:
Edit durasi animasi di `server.js`:
```javascript
setTimeout(() => {
    // Ubah 3000 (3 detik) sesuai kebutuhan
}, 3000);
```

## 🎨 Fitur Tambahan

- **Validasi Input**: Otomatis hapus duplikasi dan nama kosong
- **Error Handling**: Notifikasi untuk setiap aksi dan kesalahan
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Animasi Smooth**: Transisi halus dan efek visual menarik
- **Data Persistent**: Data tersimpan selama sesi berlangsung
- **Real-time Sync**: Sinkronisasi langsung antara semua client

## 🚫 Batasan

- Data tidak tersimpan setelah server restart
- Maksimum file upload tergantung konfigurasi server
- Membutuhkan koneksi internet untuk WebSocket
- Nama yang sudah terpilih tidak bisa terpilih lagi dalam sesi yang sama

## 🐛 Troubleshooting

### WebSocket Connection Failed:
- Pastikan server berjalan di port yang benar
- Periksa firewall atau proxy yang mungkin memblokir WebSocket

### File Upload Error:
- Pastikan format file CSV dengan encoding UTF-8
- Periksa ukuran file tidak melebihi batas
- Gunakan ekstensi .csv

### Animasi Tidak Berjalan:
- Pastikan JavaScript enabled di browser
- Periksa console browser untuk error
- Refresh halaman dan coba lagi

## 📝 Lisensi

Aplikasi ini dibuat untuk keperluan edukasi dan dapat digunakan secara bebas.

---

**Selamat menggunakan Aplikasi Pengacakan Giliran Peserta! 🎉**