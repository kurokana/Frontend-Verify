import React from 'react';

interface BalasanPklSheetProps {
  content: Record<string, any>;
  formatDate: (dateStr: string | null) => string;
  formatCurrency: (amount: number) => string;
}

export const BalasanPklSheet: React.FC<BalasanPklSheetProps> = ({
  content,
  formatDate,
  formatCurrency,
}) => {
  return (
    <div className="balasan-pkl-details">
      <table className="doc-meta-table">
        <tbody>
          <tr>
            <td><strong>Universitas / Institusi</strong></td>
            <td>: {content.tujuan_universitas}</td>
          </tr>
          <tr>
            <td><strong>Program Studi</strong></td>
            <td>: {content.prodi}</td>
          </tr>
          <tr>
            <td><strong>Jumlah Mahasiswa</strong></td>
            <td>: {content.jumlah_mahasiswa} Orang</td>
          </tr>
          <tr>
            <td><strong>Periode Praktik</strong></td>
            <td>: {content.tgl_mulai ? formatDate(content.tgl_mulai) : '-'} s/d {content.tgl_selesai ? formatDate(content.tgl_selesai) : '-'} ({content.lama_praktik_bulan} Bulan)</td>
          </tr>
          <tr>
            <td><strong>Surat Masuk Terkait</strong></td>
            <td>: {content.nomor_surat_masuk || '-'} {content.tgl_surat_masuk ? `(${formatDate(content.tgl_surat_masuk)})` : ''}</td>
          </tr>
          <tr>
            <td><strong>Direktur Penandatangan</strong></td>
            <td>: {content.nama_direktur || 'dr. Rachmawati, MPH'}</td>
          </tr>
        </tbody>
      </table>

      <h5 className="section-title" style={{ marginTop: '1.2rem' }}>Rincian Biaya Praktik:</h5>
      <table className="items-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Keterangan</th>
            <th className="text-center">Jumlah Siswa</th>
            <th className="text-center">Lama Praktik</th>
            <th className="text-right">Total Biaya</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Biaya Izin Praktik ({formatCurrency(content.snap_biaya_praktik || 0)} / org / bln)</td>
            <td className="text-center">{content.jumlah_mahasiswa} Orang</td>
            <td className="text-center">{content.lama_praktik_bulan} Bulan</td>
            <td className="text-right">{formatCurrency(content.total_biaya_praktik || 0)}</td>
          </tr>
          {Number(content.snap_biaya_orientasi) > 0 && (
            <tr>
              <td>2</td>
              <td>Biaya Orientasi ({formatCurrency(content.snap_biaya_orientasi || 0)} / org)</td>
              <td className="text-center">{content.jumlah_mahasiswa} Orang</td>
              <td className="text-center">-</td>
              <td className="text-right">{formatCurrency(content.total_biaya_orientasi || 0)}</td>
            </tr>
          )}
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
            <td colSpan={4} style={{ textAlign: 'right' }}>GRAND TOTAL</td>
            <td className="text-right" style={{ color: '#047857' }}>{formatCurrency(content.grand_total_biaya || 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
