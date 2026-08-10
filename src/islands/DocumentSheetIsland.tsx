import React from 'react';
import type { VerificationResult } from '../types';
import { SignaturesGridIsland } from './SignaturesGridIsland';

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

  return (
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
          {doc.type === 'sp3'
            ? 'SURAT PERINTAH PENGERJAAN PEMBELIAN (SP3)'
            : doc.type === 'cuti'
            ? 'SURAT PERMOHONAN PENGAJUAN CUTI'
            : 'DOKUMEN SURAT TANDA TANGAN DIGITAL (MEKARI VAULT)'}
        </h4>
        <p className="doc-num">Nomor: {doc.number}</p>
      </div>

      {/* Render Content Specific */}
      <div className="document-content">
        {doc.type === 'sp3' && (
          <div className="sp3-details">
            <table className="doc-meta-table">
              <tbody>
                <tr>
                  <td><strong>Tahun Anggaran</strong></td>
                  <td>: {content.tahun}</td>
                </tr>
                <tr>
                  <td><strong>Tanggal Surat</strong></td>
                  <td>: {content.tgl ? formatDate(content.tgl) : '-'}</td>
                </tr>
                <tr>
                  <td><strong>Rekanan / Pihak Ketiga</strong></td>
                  <td>: {content.rekanan}</td>
                </tr>
                <tr>
                  <td><strong>Metode Pembayaran</strong></td>
                  <td>: {content.bayar === 'trf' ? 'Transfer Bank' : content.bayar === 'tunai' ? 'Tunai' : 'Giro'}</td>
                </tr>
                <tr>
                  <td><strong>Keterangan Utama</strong></td>
                  <td>: {content.keterangan || '-'}</td>
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
                {content.items && content.items.map((item: any, idx: number) => (
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

        {doc.type === 'cuti' && (
          <div className="cuti-details">
            <p>Dengan hormat, saya yang mengajukan permohonan izin cuti sebagai berikut:</p>

            <table className="doc-meta-table">
              <tbody>
                <tr>
                  <td><strong>Nama Karyawan</strong></td>
                  <td>: {content.karyawan_name}</td>
                </tr>
                <tr>
                  <td><strong>NIP Karyawan</strong></td>
                  <td>: {content.karyawan_nip}</td>
                </tr>
                <tr>
                  <td><strong>Jabatan Karyawan</strong></td>
                  <td>: {content.karyawan_jabatan}</td>
                </tr>
                <tr>
                  <td><strong>No. Telepon Aktif</strong></td>
                  <td>: {content.karyawan_hp}</td>
                </tr>
                <tr>
                  <td><strong>Jenis Cuti yang Diambil</strong></td>
                  <td>: <span className="urgency-badge">{content.jenis_cuti || content.urgensi}</span></td>
                </tr>
                <tr>
                  <td><strong>Periode Cuti</strong></td>
                  <td>
                    : {content.tgl_mulai ? formatDate(content.tgl_mulai) : '-'} s/d{' '}
                    {content.tgl_akhir ? formatDate(content.tgl_akhir) : '-'}
                    <strong> ({content.lama_cuti} hari)</strong>
                  </td>
                </tr>
                <tr>
                  <td><strong>Tanggal Cuti Terjadwal</strong></td>
                  <td>: {content.tgl_cuti}</td>
                </tr>
                <tr>
                  <td><strong>Alamat Selama Cuti</strong></td>
                  <td>: {content.alamat}</td>
                </tr>
                <tr>
                  <td><strong>Alasan Pengajuan</strong></td>
                  <td>: {content.keterangan || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Digital Signature PDF Specific */}
        {(doc.type === 'digital_signature' || !['sp3', 'cuti'].includes(doc.type)) && (
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
        )}
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
