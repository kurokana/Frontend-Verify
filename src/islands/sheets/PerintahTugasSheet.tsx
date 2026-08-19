import React from 'react';

interface PerintahTugasSheetProps {
  content: Record<string, any>;
}

export const PerintahTugasSheet: React.FC<PerintahTugasSheetProps> = ({ content }) => {
  return (
    <div className="perintah-tugas-details">
      <div className="doc-section-body" style={{ marginBottom: '1rem' }}>
        <p style={{ marginBottom: '0.5rem' }}><strong>Saya yang bertandatangan di bawah ini:</strong></p>
        <table className="doc-meta-table" style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
          <tbody>
            <tr>
              <td style={{ width: '130px' }}><strong>Nama</strong></td>
              <td>: {content.nama_direktur || 'dr. Rachmawati, MPH'}</td>
            </tr>
            <tr>
              <td><strong>NIP</strong></td>
              <td>: {content.nip_direktur || '24170002'}</td>
            </tr>
            <tr>
              <td><strong>Jabatan</strong></td>
              <td>: Direktur Rumah Sakit</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginBottom: '0.5rem' }}><strong>Menugaskan Saudara:</strong></p>
      </div>

      {/* List Karyawan Tugas */}
      {content.karyawan && content.karyawan.length > 0 ? (
        <table className="items-table" style={{ marginBottom: '1.2rem' }}>
          <thead>
            <tr>
              <th className="text-center" style={{ width: '40px' }}>No</th>
              <th>Nama Karyawan</th>
              <th className="text-center" style={{ width: '140px' }}>NIP</th>
              <th>Jabatan</th>
            </tr>
          </thead>
          <tbody>
            {content.karyawan.map((k: any, idx: number) => (
              <tr key={idx}>
                <td className="text-center">{idx + 1}</td>
                <td><strong>{k.nama && k.nama !== '-' ? k.nama : `Karyawan #${idx + 1}`}</strong></td>
                <td className="text-center font-mono">{k.nip || '-'}</td>
                <td>{k.jabatan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ fontStyle: 'italic', color: '#64748b', marginBottom: '1rem' }}>
          (Daftar karyawan tugas terlampir)
        </p>
      )}

      <div className="doc-section-body">
        <p style={{ textAlign: 'justify', marginBottom: '1rem', lineHeight: '1.5' }}>
          <strong>Perihal / Perintah Tugas:</strong> {content.perihal || '-'}
        </p>

        <table className="doc-meta-table" style={{ marginLeft: '1rem', marginBottom: '1.2rem' }}>
          <tbody>
            <tr>
              <td style={{ width: '130px' }}><strong>Hari / Tanggal</strong></td>
              <td>: {content.hari_tanggal || '-'}</td>
            </tr>
            <tr>
              <td><strong>Waktu</strong></td>
              <td>: {content.waktu || 'Selesai'}</td>
            </tr>
            <tr>
              <td><strong>Tempat</strong></td>
              <td>: {content.tempat || '-'}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ textAlign: 'justify', fontSize: '0.9rem', color: '#475569', marginTop: '1rem' }}>
          Demikian Surat Perintah Tugas ini dikeluarkan agar dilaksanakan dengan penuh rasa tanggung jawab.
        </p>
      </div>
    </div>
  );
};
