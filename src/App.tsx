import { useState, useCallback, useEffect } from 'react';
import './App.css';
import type { VerificationResult } from './types';
import { HeaderIsland } from './islands/HeaderIsland';
import { ScannerIsland } from './islands/ScannerIsland';
import { ManualHashIsland } from './islands/ManualHashIsland';
import { PdfUploadIsland } from './islands/PdfUploadIsland';
import { VerificationResultIsland } from './islands/VerificationResultIsland';
import { DocumentSheetIsland } from './islands/DocumentSheetIsland';

const DOCSTORE_API = 'http://localhost:8000/api';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SHA256_PATTERN = /^[0-9a-f]{64}$/i;

function detectAndExtractKey(input: string): { type: 'uuid' | 'hash' | 'unknown'; key: string } {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const keyParam = url.searchParams.get('key');
    if (keyParam && UUID_PATTERN.test(keyParam)) {
      return { type: 'uuid', key: keyParam };
    }
  } catch {}

  if (UUID_PATTERN.test(trimmed)) {
    return { type: 'uuid', key: trimmed };
  }
  if (SHA256_PATTERN.test(trimmed)) {
    return { type: 'hash', key: trimmed };
  }
  return { type: 'unknown', key: trimmed };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
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
    });
  } catch (e) {
    return dateStr;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual' | 'pdf'>('camera');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const verifyHash = useCallback(async (hashText: string) => {
    if (!hashText || !hashText.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    const detected = detectAndExtractKey(hashText);

    if (detected.type === 'unknown') {
      setErrorMsg('Format Kode QR Hash / Key tidak valid. Masukkan Kode UUID Docstore atau Scan QR Code resmi.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = detected.type === 'uuid'
        ? `${DOCSTORE_API}/documents/${detected.key}`
        : `${DOCSTORE_API}/verify?hash=${encodeURIComponent(detected.key)}`;

      const response = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();

      if (response.ok && data.is_valid !== false) {
        setResult(data);
      } else {
        setResult(data);
        setErrorMsg(data.message || 'Dokumen PDF / QR Code tidak terdaftar di Bank Surat docstore.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal terhubung ke server verifikasi docstore.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePdfSubmit = useCallback(async (pdfFile: File) => {
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('pdf_file', pdfFile);

      const response = await fetch(`${DOCSTORE_API}/verify-pdf`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.is_valid) {
        setResult(data);
      } else {
        setResult(data);
        setErrorMsg(data.message || 'Dokumen PDF tidak terdaftar (ByteCounter mismatch).');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal terhubung ke server verifikasi docstore.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto verify if ?key= URL parameter is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get('key');
    if (keyParam) {
      verifyHash(keyParam);
    }
  }, [verifyHash]);

  return (
    <div className="verify-app">
      {/* Header Island */}
      <HeaderIsland />

      <main className="verify-main">
        <div className="container">
          <section className="verify-card shadow-lg">
            <h2>Verifikasi Keaslian Surat</h2>
            <p className="card-subtitle">
              Pindai Kode QR atau unggah berkas PDF untuk memverifikasi keaslian dan validitas dokumen secara resmi via ByteCounter.
            </p>

            {/* Navigation Tabs Island */}
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('camera');
                  setErrorMsg(null);
                  setResult(null);
                }}
              >
                <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0a8 8 0 11-16 0 8 8 0 0116 0z" />
                </svg>
                Pindai QR Code
              </button>
              <button
                className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('manual');
                  setErrorMsg(null);
                  setResult(null);
                }}
              >
                <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Input Kode QR Hash
              </button>
              <button
                className={`tab-btn ${activeTab === 'pdf' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('pdf');
                  setErrorMsg(null);
                  setResult(null);
                }}
              >
                <svg className="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Upload File PDF (ByteCounter)
              </button>
            </div>

            {/* Tab Contents Islands */}
            <div className="tab-content">
              {activeTab === 'camera' && (
                <ScannerIsland onScanSuccess={verifyHash} />
              )}

              {activeTab === 'manual' && (
                <ManualHashIsland onSubmit={verifyHash} loading={loading} />
              )}

              {activeTab === 'pdf' && (
                <PdfUploadIsland onSubmit={handlePdfSubmit} loading={loading} />
              )}
            </div>

            {/* Global Error Alert */}
            {errorMsg && (
              <div className="alert alert-danger mt-4">
                <strong>Verifikasi Gagal:</strong> {errorMsg}
              </div>
            )}
          </section>

          {/* Result Islands */}
          {result && (
            <div className="result-section mt-5">
              <VerificationResultIsland result={result} />

              <DocumentSheetIsland
                result={result}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
