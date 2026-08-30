import React from 'react';
import type { VerificationResult } from '../types';

interface VerificationResultIslandProps {
  result: VerificationResult;
}

export const VerificationResultIsland: React.FC<VerificationResultIslandProps> = ({ result }) => {
  const isCancelled =
    result.verification_status === 'DIBATALKAN' ||
    result.verification_detail === 'docstore_cancelled' ||
    result.document?.status === 'cancelled' ||
    result.document?.status === 'dibatalkan' ||
    result.document?.status === 'batal';

  const isRejected = 
    result.verification_status === 'DITOLAK' || 
    result.verification_detail === 'docstore_rejected' ||
    result.document?.status === 'rejected' ||
    result.document?.status === 'ditolak';

  const isPending = 
    !isCancelled &&
    !isRejected &&
    (result.verification_status === 'PENDING' || 
     result.verification_status === 'PROSES' || 
     result.verification_status === 'MENUNGGU PERSETUJUAN' || 
     result.verification_detail === 'docstore_pending_approval' ||
     result.verification_detail === 'docstore_in_process' ||
     result.verification_detail === 'in_process' ||
     result.document?.status === 'pending' ||
     result.document?.status === 'waiting');

  const isValid = (result.is_valid || result.verification_status === 'VALID' || result.verification_status === 'DISETUJUI MANUAL') && !isPending && !isRejected && !isCancelled;

  return (
    <div className="verification-results">
      {/* Banner Notifikasi Utama */}
      <div className={`status-banner ${isValid ? 'success' : isPending ? 'warning' : 'danger'}`}>
        <div className="banner-icon">
          {isValid ? (
            <svg style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          ) : isPending ? (
            <svg style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : isCancelled ? (
            <svg style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          ) : (
            <svg style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="banner-content">
          <h3>
            {isValid
              ? 'DOKUMEN VALID & TERDAFTAR RESMI'
              : isCancelled
                ? 'DOKUMEN TELAH DIBATALKAN RESMI (TIDAK BERLAKU)'
                : isPending
                  ? 'DOKUMEN DRAF / MENUNGGU PERSETUJUAN (PENDING)'
                  : isRejected
                    ? 'DOKUMEN DITOLAK / TIDAK BERLAKU'
                    : 'DOKUMEN TIDAK VALID / TELAH DIMODIFIKASI'}
          </h3>
          <p>
            {result.message ||
              (isValid
                ? 'Berkas ini terverifikasi secara sah dan tercatat di Bank Surat RS Bintang Amin.'
                : isCancelled
                  ? 'Peringatan: Dokumen surat ini telah DIBATALKAN RESMI oleh RS Bintang Amin dan dinyatakan TIDAK BERLAKU LAGI.'
                  : isPending
                    ? 'Peringatan: Dokumen ini terdaftar di Bank Surat RS Bintang Amin namun MASIH MENUNGGU PERSETUJUAN & TTD DIGITAL dari Pejabat Berwenang. Dokumen ini belum sah digunakan sebagai surat resmi.'
                    : isRejected
                      ? 'Dokumen ini telah ditolak oleh pejabat yang berwenang dan tidak sah digunakan.'
                      : 'Peringatan: Tanda tangan digital atau berkas telah dimodifikasi secara tidak sah!')}
          </p>
        </div>
      </div>

      {/* Main Status Box */}
      <div className={`result-card ${isValid ? 'valid' : isPending ? 'warning' : 'danger'}`}>
        <div className="result-header">
          <span className={`status-badge ${isValid ? 'valid' : isPending ? 'process' : 'invalid'}`}>
            {isValid ? 'VALID' : isCancelled ? 'DIBATALKAN' : isPending ? 'MENUNGGU PERSETUJUAN' : isRejected ? 'DITOLAK' : 'INVALID'}
          </span>
          <h4>
            {isValid
              ? 'Dokumen Resmi RS Bintang Amin'
              : isCancelled
                ? 'Dokumen Telah Dibatalkan Resmi'
                : isPending
                  ? 'Dokumen Belum Disahkan (Draf)'
                  : isRejected
                    ? 'Dokumen Ditolak oleh Pejabat'
                    : 'Dokumen TIDAK VALID'}
          </h4>
        </div>
        <p className="result-desc">
          {isValid
            ? 'Dokumen ini terdaftar resmi dan terlindungi oleh mekanisme penandatanganan digital kriptografi.'
            : isCancelled
              ? 'Surat/dokumen ini telah dibatalkan resmi oleh RS Bintang Amin dan tidak lagi berlaku sebagai dokumen sah.'
              : isPending
                ? 'Dokumen telah diarsipkan pada sistem registrasi surat, namun tanda tangan digital belum dibubuhkan oleh pejabat terkait.'
                : result.cryptographic_error || 'Dokumen tidak ditemukan atau data biner telah berubah.'}
        </p>
      </div>
    </div>
  );
};
