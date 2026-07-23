# Verify - Portal Web Verifikasi Dokumen Publik

Sub-project `verify` adalah aplikasi web berbasis React + TypeScript yang diperuntukkan bagi publik/masyarakat untuk memverifikasi keaslian surat fisik keluaran RS Bintang Amin (seperti Surat Permohonan Cuti dan Surat Perintah Pengerjaan Pembelian / SP3).

---

## 🛠️ Tech Stack & Dev Server

- **Framework:** React 19 + TypeScript + Vite
- **QR Scanner:** `html5-qrcode`
- **Styling:** Custom Responsive CSS (Kop Surat Preview & Status Cards)
- **Dev Port:** `http://localhost:5174`

---

## 🔑 Fitur Utama

1. **Pemindaian Kode QR Kamera**:
   - Menggunakan modul kamera HP/Browser (`html5-qrcode`) untuk memindai QR code tanda tangan digital pada lembar dokumen fisik.
2. **Input Manual Hash / Nomor Surat**:
   - Tab alternatif untuk memasukkan string hash tanda tangan digital atau nomor surat secara manual.
3. **Status Verifikasi & Rincian Kriptografi**:
   - Memanggil `GET http://localhost:8000/api/verify?hash={hash}` ke service `docstore`.
   - Menampilkan badge status keaslian (`VALID`, `PROSES`, `INVALID`), detail sertifikat penandatangan, tanggal penandatanganan, serta preview Kop Surat resmi RS Bintang Amin.

---

## 🚀 Cara Jalankan di Development

1. **Instalasi Dependencies**:
   ```bash
   npm install
   ```
2. **Jalankan Dev Server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5174`.

3. **Build untuk Production**:
   ```bash
   npm run build
   ```
   Hasil kompilasi file static HTML/JS akan tersimpan di folder `dist/` untuk di-deploy ke Nginx server.

---

## 📚 Referensi Arsitektur

- 🗺️ **[PROJECT_MAP.md](file:///d:/Intern/RSBA%20-%20Kerja%20Praktik/DMS/Tahap%201/PROJECT_MAP.md)**
- 🚀 **[HANDOVER_RUNNING_GUIDE.md](file:///d:/Intern/RSBA%20-%20Kerja%20Praktik/DMS/Tahap%201/HANDOVER_RUNNING_GUIDE.md)**
