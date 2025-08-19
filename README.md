# Aplikasi Pengacakan Giliran Peserta

Aplikasi web real-time untuk mengacak giliran peserta dengan animasi bergaya Matrix dan sinkronisasi antar perangkat.

## 🚀 Fitur Utama

### Tampilan Narasumber (Admin)
- **Upload File CSV**: Import daftar peserta dari file CSV
- **Input Manual**: Masukkan nama peserta secara manual (satu per baris)
- **Pengacakan Real-time**: Animasi Matrix-style dengan efek visual menarik
- **Download Data**: Ekspor hasil pengacakan dalam format CSV
- **Reset Data**: Hapus semua data dan mulai dari awal

### Tampilan Peserta (Viewer)
- **Animasi Sinkron**: Melihat pengacakan secara real-time
- **Status Peserta**: Daftar peserta yang sudah dan belum terpilih
- **Timestamp**: Waktu terpilih untuk setiap peserta

### Fitur Teknis
- **Real-time Sync**: Menggunakan Socket.io untuk sinkronisasi
- **Responsive Design**: Optimized untuk desktop, tablet, dan mobile
- **Matrix Animation**: Efek visual bergaya Matrix dengan CSS animations
- **Data Persistence**: Data tersimpan selama sesi berlangsung
- **Error Handling**: Validasi input dan penanganan error

## 📋 Persyaratan Sistem

- Node.js (versi 14 atau lebih baru)
- Browser modern (Chrome, Firefox, Safari, Edge)
- Koneksi internet untuk sinkronisasi real-time

## 🛠️ Instalasi

1. **Clone atau download** project ini
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Jalankan server**:
   ```bash
   npm start
   ```
4. **Buka browser** dan akses:
   - Tampilan Narasumber: `http://localhost:3000`
   - Tampilan Peserta: `http://localhost:3000/participant`

## 📖 Cara Penggunaan

### Untuk Narasumber (Admin)

1. **Persiapan Data Peserta**:
   - **Opsi 1**: Upload file CSV dengan format:
     ```csv
     Nama
     Ahmad Wijaya
     Siti Nurhaliza
     Budi Santoso
     ```
   - **Opsi 2**: Ketik manual di text area (satu nama per baris)

2. **Load Data**:
   - Klik tombol "📋 Muat Daftar Peserta"
   - Sistem akan memvalidasi dan memuat data peserta

3. **Mulai Pengacakan**:
   - Klik tombol "🎯 Mulai Pengacakan"
   - Nikmati animasi Matrix-style selama 3 detik
   - Nama terpilih akan ditampilkan dengan efek khusus

4. **Download Hasil**:
   - Klik "💾 Download Data CSV" untuk mendapatkan file hasil
   - File berisi status semua peserta dan timestamp terpilih

5. **Reset Data**:
   - Gunakan "🔄 Reset Semua" untuk memulai sesi baru

### Untuk Peserta (Viewer)

1. **Akses Tampilan Peserta**:
   - Buka `http://localhost:3000/participant`
   - Atau klik link "Tampilan Peserta" di halaman admin

2. **Monitoring Real-time**:
   - Lihat animasi pengacakan secara langsung
   - Monitor daftar peserta yang sudah/belum terpilih
   - Lihat timestamp setiap peserta terpilih

## 📁 Struktur File

```
project/
├── server.js           # Server Node.js dengan Socket.io
├── package.json        # Dependencies dan scripts
├── index.html          # Tampilan Narasumber (Admin)
├── participant.html    # Tampilan Peserta (Viewer)
├── app.js             # Logika client-side JavaScript
├── style.css          # Styling dengan tema Matrix
└── README.md          # Dokumentasi ini
```

## 🎨 Desain dan Tema

- **Tema Matrix**: Warna hijau neon pada background gelap
- **Animasi Smooth**: CSS animations untuk transisi halus
- **Typography**: Font Orbitron untuk header, Inter untuk body text
- **Responsive**: Grid layout yang menyesuaikan layar
- **Visual Effects**: Glow effects, shadows, dan micro-interactions

## 🔧 Konfigurasi

### Environment Variables
```env
PORT=3000                    # Port server (default: 3000)
```

### Customisasi CSS
Edit `style.css` untuk mengubah:
- Skema warna (CSS variables di `:root`)
- Durasi animasi
- Font families
- Layout breakpoints

### Server Configuration
Edit `server.js` untuk:
- Mengubah durasi animasi pengacakan
- Menambah validasi data
- Memodifikasi format timestamp

## 🐛 Troubleshooting

### Error: "EADDRINUSE: address already in use"
- Port 3000 sudah digunakan aplikasi lain
- Ubah PORT di environment variables atau terminate aplikasi lain

### File CSV tidak terbaca
- Pastikan encoding file UTF-8
- Periksa format: satu kolom berisi nama peserta
- Hapus baris header jika ada

### Sinkronisasi tidak berjalan
- Refresh halaman peserta
- Periksa koneksi internet
- Restart server jika perlu

### Animasi tidak smooth
- Pastikan menggunakan browser modern
- Disable extension browser yang mengganggu CSS
- Periksa hardware acceleration di browser

## 📊 Format Data CSV

### Input Format
```csv
Nama
Ahmad Wijaya
Siti Nurhaliza
Budi Santoso
Maria Christina
```

### Output Format
```csv
Nama,Status,Tanggal Terpilih
Ahmad Wijaya,Terpilih,05/01/2025 14:30
Siti Nurhaliza,Belum Terpilih,
Budi Santoso,Terpilih,05/01/2025 14:32
Maria Christina,Belum Terpilih,
```

## 🔐 Keamanan

- Input sanitization untuk nama peserta
- Validasi file upload (hanya CSV)
- Rate limiting untuk pengacakan
- No persistent storage (session-only)

## 🚀 Pengembangan Lanjutan

Ide untuk enhancement:
- Database persistence (MongoDB/PostgreSQL)
- User authentication untuk multiple sessions
- Export ke format lain (Excel, PDF)
- Custom animation themes
- Mobile app dengan React Native
- Analytics dan reporting
- Multiple randomization modes
- Integration dengan Google Sheets

## 📝 Lisensi

Project ini bersifat open source untuk penggunaan personal dan komersial.

## 👨‍💻 Kontributor

Dikembangkan dengan teknologi:
- **Backend**: Node.js, Express.js, Socket.io
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Design**: Matrix-inspired theme dengan modern CSS

---

**Selamat menggunakan aplikasi pengacakan giliran peserta!** 🎲✨