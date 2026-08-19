import React from 'react';

interface BalasanPenelitianSheetProps {
  content: Record<string, any>;
  formatDate: (dateStr: string | null) => string;
  formatCurrency: (amount: number) => string;
}

export const BalasanPenelitianSheet: React.FC<BalasanPenelitianSheetProps> = ({
  content,
  formatDate,
  formatCurrency,
}) => {
  return (
    <div className="balasan-penelitian-details">
      <table className="doc-meta-table">
        <tbody>
          <tr>
            <td><strong>Fakultas / Universitas</strong></td>
            <td>: Fakultas {content.tujuan_fakultas} – Universitas {content.tujuan_universitas}</td>
          </tr>
          <tr>
            <td><strong>Perihal Surat</strong></td>
            <td>: {content.perihal_surat_masuk}</td>
          </tr>
          <tr>
            <td><strong>Nomor Surat Masuk</strong></td>
            <td>: {content.nomor_surat_masuk || '-'} {content.tgl_surat_masuk ? `(${formatDate(content.tgl_surat_masuk)})` : ''}</td>
          </tr>
          <tr>
            <td><strong>Direktur Penandatangan</strong></td>
            <td>: {content.nama_direktur || 'dr. Rachmawati, MPH'}</td>
          </tr>
        </tbody>
      </table>

      {/* List Mahasiswa */}
      {content.mahasiswa && content.mahasiswa.length > 0 && (
        <>
          <h5 className="section-title" style={{ marginTop: '1.2rem' }}>Daftar Mahasiswa / Peneliti:</h5>
          <table className="items-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Mahasiswa</th>
                <th className="text-center">NPM</th>
                <th>Fakultas / PT</th>
                <th>Judul / Topik Penelitian</th>
              </tr>
            </thead>
            <tbody>
              {content.mahasiswa.map((mhs: any, idx: number) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td><strong>{mhs.nama}</strong></td>
                  <td className="text-center font-mono">{mhs.npm || '-'}</td>
                  <td>{mhs.fakultas_pt}</td>
                  <td>{mhs.judul_penelitian || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Rincian Biaya */}
      {content.biaya && content.biaya.length > 0 && (
        <>
          <h5 className="section-title" style={{ marginTop: '1.2rem' }}>Rincian Biaya Penelitian & Pendidikan:</h5>
          <table className="items-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Keterangan</th>
                <th className="text-right">Jasa Sarana</th>
                <th className="text-right">Jasa Pelayanan</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {content.biaya.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{item.keterangan}</strong>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>
                      {item.jumlah_orang} orang
                    </span>
                  </td>
                  <td className="text-right">{formatCurrency(item.jasa_sarana || 0)}</td>
                  <td className="text-right">{formatCurrency(item.jasa_pelayanan || 0)}</td>
                  <td className="text-right">{formatCurrency(item.subtotal || item.total || 0)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                <td colSpan={4} style={{ textAlign: 'right' }}>TOTAL BIAYA</td>
                <td className="text-right" style={{ color: '#047857' }}>{formatCurrency(content.total_biaya || 0)}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
