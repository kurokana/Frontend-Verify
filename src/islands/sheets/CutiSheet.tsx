import React from 'react';

interface CutiSheetProps {
  content: Record<string, any>;
  formatDate: (dateStr: string | null) => string;
}

export const CutiSheet: React.FC<CutiSheetProps> = ({ content, formatDate }) => {
  return (
    <div className="cuti-details">
      <p>Dengan hormat, saya yang mengajukan permohonan izin cuti sebagai berikut:</p>

      <table className="doc-meta-table">
        <tbody>
          <tr>
            <td><strong>Nama Karyawan</strong></td>
            <td>: {content.karyawan_name}</td>
          </tr>
          {content.karyawan_nip && (
            <tr>
              <td><strong>NIP Karyawan</strong></td>
              <td>: {content.karyawan_nip}</td>
            </tr>
          )}
          <tr>
            <td><strong>Jabatan Karyawan</strong></td>
            <td>: {content.karyawan_jabatan}</td>
          </tr>
          {content.karyawan_hp && (
            <tr>
              <td><strong>No. Telepon Aktif</strong></td>
              <td>: {content.karyawan_hp}</td>
            </tr>
          )}
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
          {content.tgl_cuti && (
            <tr>
              <td><strong>Tanggal Cuti Terjadwal</strong></td>
              <td>: {content.tgl_cuti}</td>
            </tr>
          )}
          {content.alamat && (
            <tr>
              <td><strong>Alamat Selama Cuti</strong></td>
              <td>: {content.alamat}</td>
            </tr>
          )}
          <tr>
            <td><strong>Alasan Pengajuan</strong></td>
            <td>: {content.keterangan || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
