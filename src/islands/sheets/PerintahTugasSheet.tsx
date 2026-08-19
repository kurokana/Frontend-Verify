import React from 'react';

interface PerintahTugasSheetProps {
  content: Record<string, any>;
}

export const PerintahTugasSheet: React.FC<PerintahTugasSheetProps> = ({ content }) => {
  return (
    <div className="perintah-tugas-details">
      <table className="doc-meta-table">
        <tbody>
          <tr>
            <td><strong>Perihal Tugas</strong></td>
            <td>: {content.perihal}</td>
          </tr>
          <tr>
            <td><strong>Hari / Tanggal</strong></td>
            <td>: {content.hari_tanggal}</td>
          </tr>
          <tr>
            <td><strong>Waktu</strong></td>
            <td>: {content.waktu}</td>
          </tr>
          <tr>
            <td><strong>Tempat</strong></td>
            <td>: {content.tempat}</td>
          </tr>
          <tr>
            <td><strong>Pemberi Tugas</strong></td>
            <td>: {content.nama_direktur || 'dr. Rachmawati, MPH'} (Direktur)</td>
          </tr>
        </tbody>
      </table>

      {/* List Karyawan Tugas */}
      {content.karyawan && content.karyawan.length > 0 && (
        <>
          <h5 className="section-title" style={{ marginTop: '1.2rem' }}>Daftar Karyawan yang Ditugaskan:</h5>
          <table className="items-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Karyawan</th>
                <th className="text-center">NIP</th>
                <th>Jabatan</th>
              </tr>
            </thead>
            <tbody>
              {content.karyawan.map((k: any, idx: number) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td><strong>{k.nama}</strong></td>
                  <td className="text-center font-mono">{k.nip || '-'}</td>
                  <td>{k.jabatan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
