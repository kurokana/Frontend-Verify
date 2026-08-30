# 🔍 Verify — Portal Web Verifikasi Dokumen Publik RSBA

<p align="center">
  <img src="https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/qrcode.svg" width="70" height="70" alt="Verify Logo" />
</p>

<p align="center">
  <b>Portal Web Responsif untuk Verifikasi Keaslian & Integritas Dokumen Fisik Ber-QR Code TTE</b><br>
  <i>Rumah Sakit Bintang Amin (RSBA) Lampung</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/QR_Scanner-html5--qrcode-00C853?style=for-the-badge" alt="QR Scanner" />
</p>

---

## 🏛️ Ikhtisar Aplikasi

**Frontend-Verify** adalah aplikasi web publik berbasis React + TypeScript yang diperuntukkan bagi masyarakat, instansi eksternal, atau auditor untuk memverifikasi keaslian dokumen resmi terbitan **Rumah Sakit Bintang Amin** (seperti Surat Cuti Pegawai, Surat Perintah Tugas, Surat Balasan Permohonan Riset/PKL, dan Dokumen SP3).

Pengguna dapat memindai QR Code yang tercetak pada lembar fisik dokumen atau memasukkan kode hash/nomor surat secara manual untuk memperoleh informasi sertifikat penandatangan dan preview dokumen resmi secara transparan.

---

## 🛠️ Tech Stack & Modul Utama

- **UI Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool / Bundler:** [Vite 8](https://vite.dev/)
- **Camera QR Scanner:** [`html5-qrcode`](https://github.com/mebjas/html5-qrcode) (Akses kamera smartphone/desktop)
- **Styling:** Custom Vanilla CSS Modern (Responsif Mobile-First & Glassmorphism Badge Status)
- **Default Dev Port:** `http://localhost:5174`

---

## 🔑 Fitur Unggulan

1. **Pemindaian QR Code Kamera Realtime**:
   - Integrasi kamera HP/Browser dengan auto-focus, pergantian kamera depan/belakang, dan deteksi kode QR otomatis tanpa delay.
2. **Pencarian Manual Hash & Nomor Surat**:
   - Input tab alternatif untuk memasukkan string hash SHA-256 tanda tangan digital atau nomor surat resmi.
3. **Status Keaslian Kriptografis Visual**:
   - Menghubungi endpoint `GET /api/verify?hash={hash}` pada service `Docstore`.
   - Menampilkan status dokumen yang terstandarisasi:
     - 🟢 **VALID / ASLI**: Dokumen resmi dan tanda tangan digital sah terdaftar pada sistem.
     - 🟡 **PROSES**: Dokumen masih dalam proses otorisasi berjenjang pejabat terkait.
     - 🔴 **INVALID / TIDAK VALID**: Hash dokumen tidak ditemukan atau terdapat indikasi perubahan isi dokumen.
4. **Preview Kop Surat Resmi**:
   - Menampilkan preview kop surat resmi RS Bintang Amin, tanggal penandatanganan, nama lengkap pejabat, NIP/SIP, serta jabatan penandatangan.

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Instalasi Dependensi
```bash
# Masuk ke direktori Frontend-Verify
cd Frontend-Verify

# Install dependencies Node.js
npm install
```

### 2. Konfigurasi Lingkungan (`.env`)
Buat file `.env` di root direktori `Frontend-Verify` jika ingin mengarahkan endpoint API:
```ini
VITE_API_URL=http://localhost:8000/api
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:5174`.

### 4. Build untuk Production
```bash
npm run build
```
File bundle static HTML, JS, dan CSS yang teroptimasi akan dihasilkan pada direktori `dist/` dan siap dideploy pada web server (Nginx/Apache).

---

## 📄 Lisensi
Dikembangkan untuk ekosistem **RS Bintang Amin Lampung** di bawah lisensi [MIT License](https://opensource.org/licenses/MIT).
