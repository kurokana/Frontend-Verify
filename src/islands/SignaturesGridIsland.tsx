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
          const isSigManual = sig.is_manual || ['manual', 'approved manual', 'disetujui manual'].includes((sig.status || '').toLowerCase());
          const isApproved = ['approved', 'valid', 'signed', 'disetujui'].includes((sig.status || '').toLowerCase());
          return (
            <div key={idx} className={`sig-box ${sig.is_current_scanned ? 'highlight' : ''} ${isSigManual ? 'manual-sig' : ''}`}>
              <div className="sig-status">
                <span className={`sig-dot ${isSigManual ? 'manual' : (isApproved ? 'approved' : 'pending')}`}></span>
                <span className="sig-status-text">
                  {isSigManual ? '✍️ MANUAL (TTD BASAH)' : (isApproved ? 'DISETUJUI' : sig.status)}
                </span>
              </div>
              <div className="sig-user">
                <strong>{sig.signer_name}</strong>
                <p>{sig.signer_role || 'Pejabat Otorisasi'}</p>
              </div>
              <div className="sig-date">
                Tanggal: {sig.signed_at ? formatDate(sig.signed_at) : '-'}
              </div>
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
