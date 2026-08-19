import React from 'react';

interface Sp3SheetProps {
  content: Record<string, any>;
  formatDate: (dateStr: string | null) => string;
  formatCurrency: (amount: number) => string;
}

export const Sp3Sheet: React.FC<Sp3SheetProps> = ({ content, formatDate, formatCurrency }) => {
  return (
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
  );
};
