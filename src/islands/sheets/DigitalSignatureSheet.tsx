import React from 'react';
import type { VerificationResult, DocumentItem } from '../../types';

interface DigitalSignatureSheetProps {
  doc: DocumentItem;
  content: Record<string, any>;
  result: VerificationResult;
}

export const DigitalSignatureSheet: React.FC<DigitalSignatureSheetProps> = ({
  doc,
  content,
  result,
}) => {
  return (
    <div className="digital-signature-details">
      <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Dokumen ini adalah berkas PDF Tanda Tangan Digital resmi yang terdaftar di Docstore Bank Surat RS Bintang Amin.
      </p>

      <table className="doc-meta-table">
        <tbody>
          {content.title && (
            <tr>
              <td><strong>Judul Surat</strong></td>
              <td>: {content.title}</td>
            </tr>
          )}
          <tr>
            <td><strong>Nomor Dokumen</strong></td>
            <td>: {doc.number}</td>
          </tr>
          {content.uploader_name && (
            <tr>
              <td><strong>Penandatangan / Super Admin</strong></td>
              <td>: {content.uploader_name}</td>
            </tr>
          )}
          {result.byte_counter && (
            <tr>
              <td><strong>Metric ByteCounter SHA-256</strong></td>
              <td style={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.82rem' }}>
                : {result.byte_counter.byte_counter_hash}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
