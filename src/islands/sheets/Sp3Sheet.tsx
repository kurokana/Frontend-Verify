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
            <td>: {content.tahun || new Date().getFullYear()}</td>
          </tr>
          <tr>
            <td><strong>Tanggal Surat</strong></td>
            <td>: {content.tgl ? formatDate(content.tgl) : '-'}</td>
          </tr>
          <tr>
            <td><strong>Rekanan / Pihak Ketiga</strong></td>
            <td>: {content.rekanan || '-'}</td>
          </tr>
          {content.bayar && (
            <tr>
              <td><strong>Metode Pembayaran</strong></td>
              <td>: {content.bayar === 'trf' ? 'Transfer Bank' : content.bayar === 'tunai' ? 'Tunai' : 'Giro'}</td>
            </tr>
          )}
          <tr>
            <td><strong>Keterangan Utama</strong></td>
            <td>: {content.keterangan || '-'}</td>
          </tr>
        </tbody>
      </table>

      <h5 className="section-title" style={{ marginTop: '1.2rem' }}>Rincian Barang / Layanan (SP3):</h5>
      <table className="items-table">
        <thead>
          <tr>
            <th className="text-center" style={{ width: '40px' }}>No</th>
            <th>Keterangan Item</th>
            <th className="text-center" style={{ width: '80px' }}>Jumlah</th>
            <th className="text-right">Harga Satuan</th>
            <th className="text-right">Total Harga</th>
          </tr>
        </thead>
        <tbody>
          {content.items && content.items.length > 0 ? (
            content.items.map((item: any, idx: number) => {
              const rincian = item.rincian || item.keterangan || `- Item ${idx + 1}`;
              const jumlah = item.jumlah || 1;
              const hargaSatuan = item.harga_satuan || 0;
              const total = item.total_harga || item.nominal || (jumlah * hargaSatuan);

              return (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td><strong>{rincian}</strong></td>
                  <td className="text-center">{jumlah}</td>
                  <td className="text-right">{hargaSatuan > 0 ? formatCurrency(hargaSatuan) : '-'}</td>
                  <td className="text-right">{formatCurrency(total)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>1</td>
              <td><strong>{content.keterangan || 'SP3 Terlampir'}</strong></td>
              <td className="text-center">1</td>
              <td className="text-right">-</td>
              <td className="text-right">{formatCurrency(content.total || 0)}</td>
            </tr>
          )}
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
            <td colSpan={4} style={{ textAlign: 'right' }}>GRAND TOTAL</td>
            <td className="text-right" style={{ color: '#047857' }}>{formatCurrency(content.total || 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
