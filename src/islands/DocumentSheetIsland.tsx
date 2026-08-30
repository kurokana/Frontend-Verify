import React from 'react';
import type { VerificationResult } from '../types';
import { SignaturesGridIsland } from './SignaturesGridIsland';
import { CutiSheet } from './sheets/CutiSheet';
import { Sp3Sheet } from './sheets/Sp3Sheet';
import { BalasanPklSheet } from './sheets/BalasanPklSheet';
import { BalasanPenelitianSheet } from './sheets/BalasanPenelitianSheet';
import { PerintahTugasSheet } from './sheets/PerintahTugasSheet';
import { DisposisiSheet } from './sheets/DisposisiSheet';
import { DigitalSignatureSheet } from './sheets/DigitalSignatureSheet';

interface DocumentSheetIslandProps {
  result: VerificationResult;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string | null) => string;
}

export const DocumentSheetIsland: React.FC<DocumentSheetIslandProps> = ({
  result,
  formatCurrency,
  formatDate,
}) => {
  if (!result.document) return null;

  const doc = result.document;
  const content = doc.content || {};

  const getDocumentTitle = () => {
    switch (doc.type) {
      case 'sp3':
        return 'SURAT PERINTAH PENGERJAAN PEMBELIAN (SP3)';
      case 'cuti':
        return 'SURAT PERMOHONAN PENGAJUAN CUTI';
      case 'balasan_pkl':
        return 'SURAT BALASAN PRAKTEK KERJA LAPANGAN (PKL)';
      case 'balasan_penelitian':
        return 'SURAT BALASAN PENELITIAN';
      case 'perintah_tugas':
        return 'SURAT PERINTAH TUGAS';
      case 'surat_disposisi':
      case 'disposisi':
        return 'LEMBAR PENERUS / DISPOSISI';
      default:
        return 'DOKUMEN SURAT TANDA TANGAN DIGITAL & QR VERIFIKASI';
    }
  };

  const renderContentSheet = () => {
    switch (doc.type) {
      case 'sp3':
        return <Sp3Sheet content={content} formatDate={formatDate} formatCurrency={formatCurrency} />;
      case 'cuti':
        return <CutiSheet content={content} formatDate={formatDate} />;
      case 'balasan_pkl':
        return <BalasanPklSheet content={content} formatDate={formatDate} formatCurrency={formatCurrency} />;
      case 'balasan_penelitian':
        return <BalasanPenelitianSheet content={content} formatDate={formatDate} formatCurrency={formatCurrency} />;
      case 'perintah_tugas':
        return <PerintahTugasSheet content={content} />;
      case 'surat_disposisi':
      case 'disposisi':
        return <DisposisiSheet content={content} formatDate={formatDate} />;
      default:
        return <DigitalSignatureSheet doc={doc} content={content} result={result} />;
    }
  };

  return (
    <div className="document-sheet shadow-lg">
      <div className="sheet-border-top"></div>

      {/* Visual Kop Surat */}
      <div className="kop-surat">
        <h2>RS BINTANG AMIN</h2>
        <p>Jl. Pramuka No.27, Kemiling Permai, Kec. Kemiling, Kota Bandar Lampung, Lampung 35151</p>
        <p className="kop-telp">Telp: (0721) 273601 | Email: cs@rspba.co.id / sdm@rspba.co.id</p>
        <div className="kop-divider"></div>
      </div>

      <div className="document-title">
        <h4>{getDocumentTitle()}</h4>
        {doc.type === 'surat_disposisi' || doc.type === 'disposisi' ? (
          <p className="doc-num" style={{ fontWeight: 'bold', color: '#4f46e5', marginTop: '2px' }}>
            RS BINTANG AMIN - DIREKTUR
          </p>
        ) : (
          <p className="doc-num">Nomor: {doc.number}</p>
        )}
      </div>

      {/* Render Content Specific */}
      <div className="document-content">
        {renderContentSheet()}
      </div>

      <div className="sheet-divider"></div>

      {/* Signatures List Island */}
      <SignaturesGridIsland
        signatures={result.all_signatures || result.signatures || []}
        formatDate={formatDate}
      />
    </div>
  );
};
