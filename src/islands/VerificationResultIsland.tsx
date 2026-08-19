import React from 'react';
import type { VerificationResult } from '../types';

interface VerificationResultIslandProps {
  result: VerificationResult;
}

export const VerificationResultIsland: React.FC<VerificationResultIslandProps> = ({ result }) => {
  const isRejected = result.verification_status === 'DITOLAK' || result.verification_detail === 'docstore_rejected';
  const isInProcess = result.verification_status === 'PROSES' || result.verification_detail === 'in_process';

  return (
    <div className="verification-results">
      {/* Banner Notifikasi Utama */}
      <div className={`status-banner ${result.is_valid ? 'success' : isRejected ? 'danger' : isInProcess ? 'warning' : 'danger'}`}>
        <div className="banner-icon">
          {result.is_valid ? (
            <svg style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="banner-content">
          <h3>
            {result.is_valid
              ? 'DOKUMEN VALID & TERDAFTAR RESMI'
              : isRejected
                ? 'DOKUMEN DITOLAK / TIDAK BERLAKU'
                : isInProcess
                  ? 'DOKUMEN MASIH DALAM PROSES'
                  : 'DOKUMEN TIDAK VALID / TELAH DIMODIFIKASI'}
          </h3>
          <p>
            {result.message ||
              (result.is_valid
                ? 'Berkas ini terverifikasi secara sah dan tercatat di Bank Surat RS Bintang Amin.'
                : 'Peringatan: Tanda tangan digital atau berkas telah dimodifikasi secara tidak sah!')}
          </p>
        </div>
      </div>

      {/* Main Status Box */}
      <div className={`result-card ${result.is_valid ? 'valid' : isRejected ? 'danger' : isInProcess ? 'warning' : 'invalid'}`}>
        <div className="result-header">
          <span className={`status-badge ${result.is_valid ? 'valid' : isRejected ? 'invalid' : isInProcess ? 'process' : 'invalid'}`}>
            {result.is_valid ? 'VALID' : isRejected ? 'DITOLAK' : isInProcess ? 'PROSES' : 'INVALID'}
          </span>
          <h4>
            {result.is_valid
              ? 'Dokumen Resmi RS Bintang Amin'
              : isRejected
                ? 'Dokumen Ditolak oleh Pejabat'
                : isInProcess
                  ? 'Dokumen Belum Selesai Disetujui'
                  : 'Dokumen TIDAK VALID'}
          </h4>
        </div>
        <p className="result-desc">
          {result.is_valid
            ? 'Dokumen ini terdaftar resmi dan terlindungi oleh mekanisme penandatanganan digital.'
            : result.cryptographic_error || 'Dokumen tidak ditemukan atau data biner telah berubah.'}
        </p>
      </div>
    </div>
  );
};
