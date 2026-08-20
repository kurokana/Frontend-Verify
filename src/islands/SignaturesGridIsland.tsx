import React from 'react';
import type { DocumentSignatureItem } from '../types';

interface SignaturesGridIslandProps {
  signatures: DocumentSignatureItem[];
  formatDate: (dateStr: string | null) => string;
}

export const SignaturesGridIsland: React.FC<SignaturesGridIslandProps> = ({ signatures, formatDate }) => {
  return (
    <div className="signatures-section">
      <h5>Daftar Tanda Tangan Digital & Approval Dokumen:</h5>
      <div className="signatures-grid">
        {signatures.map((sig, idx) => {
          const statusLower = (sig.status || '').toLowerCase();
          const isSigManual = sig.is_manual || ['manual', 'approved manual', 'disetujui manual'].includes(statusLower);
          const isApproved = ['approved', 'valid', 'signed', 'disetujui'].includes(statusLower);
          const isRejected = ['rejected', 'ditolak'].includes(statusLower);

          return (
            <div key={idx} className={`sig-box ${sig.is_current_scanned ? 'highlight' : ''} ${isSigManual ? 'manual-sig' : ''} ${isRejected ? 'rejected-sig' : ''}`}>
              <div className="sig-status">
                <span className={`sig-dot ${isSigManual ? 'manual' : (isApproved ? 'approved' : (isRejected ? 'rejected' : 'pending'))}`}></span>
                <span className="sig-status-text">
                  {isSigManual ? '✍️ MANUAL (TTD BASAH)' : (isApproved ? 'DISETUJUI' : (isRejected ? 'DITOLAK' : sig.status))}
                </span>
              </div>
              <div className="sig-user">
                <strong>{sig.signer_name}</strong>
                <p>{sig.signer_role || 'Pejabat Otorisasi'}</p>
              </div>
              <div className="sig-date">
                Tanggal: {sig.signed_at ? formatDate(sig.signed_at) : '-'}
              </div>
              {isRejected && sig.original_data && sig.original_data !== 'N/A' && (
                <div className="rejection-feedback-box text-rose-600 text-xs mt-2 font-mono p-2 bg-rose-50 rounded border border-rose-200">
                  <strong>Catatan Penolakan:</strong> "{sig.original_data}"
                </div>
              )}
              {sig.is_current_scanned && (
                <div className="scanned-tag">Sedang Di-scan</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
