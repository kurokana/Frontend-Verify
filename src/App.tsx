import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './App.css';

interface Signature {
  signer_name: string;
  signer_role: string;
  status: string;
  signed_at: string | null;
  signature_hash: string;
  is_current_scanned?: boolean;
}

interface DocumentData {
  id: number;
  type: string;
  number: string;
  status: string;
  content: {
    // Common fields
    keterangan?: string;

    // SP3 specific
    no?: number;
    tahun?: number;
    tgl?: string;
    rekanan?: string;
    bayar?: string;
    disetujui?: string;
    jabatan?: string;
    items?: Array<{ keterangan: string; nominal: number }>;

    // Cuti specific
    no_surat?: string;
    tgl_surat?: string;
    tgl_mulai?: string;
    tgl_akhir?: string;
    tgl_cuti?: string;
    lama_cuti?: number;
    urgensi?: string;
    alamat?: string;
    jenis_cuti?: string;
    karyawan_name?: string;
    karyawan_nip?: string;
    karyawan_hp?: string;
    karyawan_jabatan?: string;
  };
}

interface VerifyResponse {
  is_valid: boolean;
  verification_status: string;
  verification_detail?: string;
  cryptographic_error: string | null;
  document: DocumentData;
  scanned_signature: Signature;
  all_signatures: Signature[];
}

function App() {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [manualHash, setManualHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);

  // Camera state
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Cleanup scanning on unmount
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleStartScan = async () => {
    setCameraError(null);
    setErrorMsg(null);
    setResult(null);

    try {
      // Ensure element exists
      const qrEl = document.getElementById('qr-reader');
      if (!qrEl) return;

      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;
      setIsScanning(true);

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback
          // QR code signature hash found
          verifyHash(decodedText);
          handleStopScan();
        },
        () => {
          // Failure callback (e.g. no QR code found in frame, normal during scanning)
        }
      );
    } catch (err: any) {
      console.error('Failed to start camera', err);
      setCameraError(err.message || 'Gagal mengakses kamera. Pastikan izin kamera telah diberikan.');
      setIsScanning(false);
    }
  };

  const handleStopScan = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.error('Failed to stop camera', err);
      } finally {
        setIsScanning(false);
        html5QrCodeRef.current = null;
      }
    }
  };

  const verifyHash = async (hash: string) => {
    const trimmedHash = hash.trim();
    if (!trimmedHash) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const response = await fetch(`http://localhost:8000/api/verify?hash=${encodeURIComponent(trimmedHash)}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setErrorMsg(data.message || 'Verifikasi gagal.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Koneksi gagal. Pastikan server docstore backend aktif.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyHash(manualHash);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="verify-app">
      <header className="verify-header">
        <div className="header-container">
          <div className="logo-section">
            <img src="/logo-fallback.png" alt="Logo RSBA" className="logo-img" />
            <div className="logo-text">
              <h1>RS Bintang Amin</h1>
              <p>Portal Verifikasi Dokumen Digital Resmi</p>
            </div>
          </div>
        </div>
      </header>

      <main className="verify-main">
        <div className="container">
          <section className="verify-card shadow-lg">
            <h2>Verifikasi Keaslian Surat</h2>
            <p className="card-subtitle">
              Pindai kode QR pada surat fisik Anda atau masukkan hash tanda tangan digital secara manual untuk memverifikasi keaslian dokumen.
            </p>

            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('camera');
                  setErrorMsg(null);
                  setResult(null);
                }}
              >
                <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0a8 8 0 11-16 0 8 8 0 0116 0z"></path>
                </svg>
                Pindai QR Code
              </button>
              <button
                className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('manual');
                  handleStopScan();
                  setErrorMsg(null);
                  setResult(null);
                }}
              >
                <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Input Manual Hash
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'camera' && (
                <div className="camera-section">
                  <div className="scanner-wrapper">
                    <div id="qr-reader" className={isScanning ? 'scanning' : ''}></div>
                    {!isScanning && (
                      <div className="scanner-placeholder">
                        <svg className="qr-big-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0a8 8 0 11-16 0 8 8 0 0116 0z"></path>
                        </svg>
                        <p>Kamera belum aktif. Klik tombol di bawah untuk memulai pemindaian.</p>
                      </div>
                    )}
                  </div>

                  <div className="scanner-controls">
                    {!isScanning ? (
                      <button className="btn btn-primary" onClick={handleStartScan}>
                        Mulai Scanner Kamera
                      </button>
                    ) : (
                      <button className="btn btn-danger" onClick={handleStopScan}>
                        Hentikan Scanner
                      </button>
                    )}
                  </div>

                  {cameraError && <div className="alert alert-warning mt-3">{cameraError}</div>}
                </div>
              )}

              {activeTab === 'manual' && (
                <form onSubmit={handleManualSubmit} className="manual-form">
                  <div className="form-group">
                    <label htmlFor="hash-input">Signature Hash / Kode QR</label>
                    <input
                      id="hash-input"
                      type="text"
                      placeholder="Tempelkan (paste) string hash QR di sini..."
                      value={manualHash}
                      onChange={(e) => setManualHash(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? 'Memverifikasi...' : 'Verifikasi Keaslian'}
                  </button>
                </form>
              )}
            </div>

            {loading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Menghubungkan ke pusat arsip dan memverifikasi tanda tangan digital secara kriptografis...</p>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger animation-bounce mt-4">
                <div className="alert-header">
                  <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Verifikasi Gagal</span>
                </div>
                <p>{errorMsg}</p>
              </div>
            )}
          </section>

          {result && (
            <div className="result-section animation-fade-in">
              {/* Validation Status Card */}
              <div className={`status-card ${result.verification_status === 'PROSES' ? 'process' : (result.is_valid ? 'valid' : 'invalid')}`}>
                <div className="status-header">
                  <div className="status-badge">
                    {result.verification_status === 'PROSES' ? (
                      <svg className="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    ) : result.is_valid ? (
                      <svg className="badge-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    ) : (
                      <svg className="badge-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                      </svg>
                    )}
                    <span>{result.verification_status}</span>
                  </div>
                  <div className="status-title">
                    <h3>
                      {result.verification_status === 'PROSES' 
                        ? 'DOKUMEN MASIH DALAM PROSES' 
                        : `Dokumen ${result.is_valid ? 'ASLI & VALID' : 'TIDAK VALID'}`}
                    </h3>
                    <p>
                      {result.verification_status === 'PROSES'
                        ? 'Surat masih dalam proses persetujuan dan belum dapat diverifikasi secara penuh.'
                        : result.is_valid
                          ? 'Tanda tangan digital cocok dengan sertifikat digital terdaftar RS Bintang Amin.'
                          : 'Peringatan: Tanda tangan digital atau berkas telah dimodifikasi secara tidak sah!'}
                    </p>
                  </div>
                </div>

                <div className="status-meta">
                  <div className="meta-row">
                    <span>Penandatangan Scanned:</span>
                    <strong>{result.scanned_signature.signer_name} ({result.scanned_signature.signer_role || 'Staf'})</strong>
                  </div>
                  <div className="meta-row">
                    <span>Tanggal Ditandatangani:</span>
                    <strong>{formatDate(result.scanned_signature.signed_at)}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Hash QR:</span>
                    <code className="hash-code">{result.scanned_signature.signature_hash}</code>
                  </div>
                  {result.is_valid && result.verification_detail && (
                    <div className="crypto-success-detail">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>
                        {result.verification_detail === 'hash_and_openssl_match' && 'Terverifikasi: Hash SHA-256 & tanda tangan digital OpenSSL cocok'}
                        {result.verification_detail === 'hash_match' && 'Terverifikasi: Integritas data (SHA-256) terkonfirmasi'}
                        {result.verification_detail === 'hash_match_openssl_warn' && 'Terverifikasi: Integritas data terkonfirmasi (sertifikat mungkin diperbarui)'}
                        {result.verification_detail === 'openssl_match' && 'Terverifikasi: Tanda tangan digital OpenSSL cocok'}
                        {result.verification_detail === 'document_registered' && 'Terverifikasi: Dokumen terdaftar dalam sistem RSBA'}
                        {result.verification_detail === 'registered_no_crypto_data' && 'Terverifikasi: Dokumen terdaftar (dokumen lama)'}
                      </span>
                    </div>
                  )}
                  {result.cryptographic_error && result.verification_status !== 'PROSES' && (
                    <div className="crypto-error">
                      <strong>Detail Masalah:</strong> {result.cryptographic_error}
                    </div>
                  )}
                </div>
              </div>

              {/* Document Container Sheet */}
              <div className="document-sheet shadow-lg">
                <div className="sheet-border-top"></div>

                {/* Visual Kop Surat */}
                <div className="kop-surat">
                  <h2>RS BINTANG AMIN</h2>
                  <p>Jl. Pramuka No.27, Kemiling Permai, Kec. Kemiling, Kota Bandar Lampung, Lampung 35151</p>
                  <p className="kop-telp">Telp: (0721) 561234 | Email: [sdm.rsbintangamin@gmail.com]</p>
                  <div className="kop-divider"></div>
                </div>

                <div className="document-title">
                  <h4>
                    {result.document.type === 'sp3'
                      ? 'SURAT PERINTAH PENGERJAAN PEMBELIAN (SP3)'
                      : 'SURAT PERMOHONAN PENGAJUAN CUTI'}
                  </h4>
                  <p className="doc-num">Nomor: {result.document.number}</p>
                </div>

                {/* Render Content Specific */}
                <div className="document-content">
                  {result.document.type === 'sp3' && (
                    <div className="sp3-details">
                      <table className="doc-meta-table">
                        <tbody>
                          <tr>
                            <td><strong>Tahun Anggaran</strong></td>
                            <td>: {result.document.content.tahun}</td>
                          </tr>
                          <tr>
                            <td><strong>Tanggal Surat</strong></td>
                            <td>: {result.document.content.tgl ? new Date(result.document.content.tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
                          </tr>
                          <tr>
                            <td><strong>Rekanan / Pihak Ketiga</strong></td>
                            <td>: {result.document.content.rekanan}</td>
                          </tr>
                          <tr>
                            <td><strong>Metode Pembayaran</strong></td>
                            <td>: {result.document.content.bayar === 'trf' ? 'Transfer Bank' : result.document.content.bayar === 'tunai' ? 'Tunai' : 'Giro'}</td>
                          </tr>
                          <tr>
                            <td><strong>Keterangan Utama</strong></td>
                            <td>: {result.document.content.keterangan || '-'}</td>
                          </tr>
                        </tbody>
                      </table>

                      <h5 className="section-title">Rincian Barang / Layanan (SP3):</h5>
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Keterangan Item</th>
                            <th className="text-right">Nominal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.document.content.items && result.document.content.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{item.keterangan}</td>
                              <td className="text-right">{formatCurrency(item.nominal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {result.document.type === 'cuti' && (
                    <div className="cuti-details">
                      <p>Dengan hormat, saya yang mengajukan permohonan izin cuti sebagai berikut:</p>

                      <table className="doc-meta-table">
                        <tbody>
                          <tr>
                            <td><strong>Nama Karyawan</strong></td>
                            <td>: {result.document.content.karyawan_name}</td>
                          </tr>
                          <tr>
                            <td><strong>NIP Karyawan</strong></td>
                            <td>: {result.document.content.karyawan_nip}</td>
                          </tr>
                          <tr>
                            <td><strong>Jabatan Karyawan</strong></td>
                            <td>: {result.document.content.karyawan_jabatan}</td>
                          </tr>
                          <tr>
                            <td><strong>No. Telepon Aktif</strong></td>
                            <td>: {result.document.content.karyawan_hp}</td>
                          </tr>
                          <tr>
                            <td><strong>Jenis Cuti yang Diambil</strong></td>
                            <td>: <span className="urgency-badge">{result.document.content.jenis_cuti || result.document.content.urgensi}</span></td>
                          </tr>
                          <tr>
                            <td><strong>Periode Cuti</strong></td>
                            <td>
                              : {result.document.content.tgl_mulai ? new Date(result.document.content.tgl_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} s/d{' '}
                              {result.document.content.tgl_akhir ? new Date(result.document.content.tgl_akhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                              <strong> ({result.document.content.lama_cuti} hari)</strong>
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Tanggal Cuti Terjadwal</strong></td>
                            <td>: {result.document.content.tgl_cuti}</td>
                          </tr>
                          <tr>
                            <td><strong>Alamat Selama Cuti</strong></td>
                            <td>: {result.document.content.alamat}</td>
                          </tr>
                          <tr>
                            <td><strong>Alasan Pengajuan</strong></td>
                            <td>: {result.document.content.keterangan || '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="sheet-divider"></div>

                {/* Signatures List */}
                <div className="signatures-section">
                  <h5>Daftar Tanda Tangan Digital Dokumen:</h5>
                  <div className="signatures-grid">
                    {result.all_signatures.map((sig, idx) => (
                      <div key={idx} className={`sig-box ${sig.is_current_scanned ? 'highlight' : ''}`}>
                        <div className="sig-status">
                          <span className={`sig-dot ${sig.status === 'approved' ? 'approved' : 'pending'}`}></span>
                          <span className="sig-status-text">{sig.status === 'approved' ? 'DISETUJUI' : sig.status}</span>
                        </div>
                        <div className="sig-user">
                          <strong>{sig.signer_name}</strong>
                          <p>{sig.signer_role || 'Pejabat Otorisasi'}</p>
                        </div>
                        <div className="sig-date">
                          Tanggal: {sig.signed_at ? new Date(sig.signed_at).toLocaleDateString('id-ID') : '-'}
                        </div>
                        {sig.is_current_scanned && (
                          <div className="scanned-tag">Sedang Di-scan</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
