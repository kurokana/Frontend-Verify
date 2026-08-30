import React from 'react';

interface DisposisiSheetProps {
  content: Record<string, any>;
  formatDate: (dateStr: string | null) => string;
}

const formatOnlyDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const DisposisiSheet: React.FC<DisposisiSheetProps> = ({ content, formatDate }) => {
  const recipients = content.recipients || content.details || [];

  return (
    <div className="disposisi-details" style={{ marginTop: '0.5rem' }}>
      <table className="doc-meta-table" style={{ width: '100%', marginBottom: '1.5rem', borderCollapse: 'collapse', fontSize: '13px' }}>
        <tbody>
          <tr>
            <td style={{ width: '18%', padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>NO. AGENDA</td>
            <td style={{ width: '32%', padding: '6px 0' }}>: <span className="font-mono font-bold" style={{ color: '#4f46e5', fontSize: '14px' }}>{content.no_agenda || '-'}</span></td>
            <td style={{ width: '18%', padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>TGL SURAT</td>
            <td style={{ width: '32%', padding: '6px 0' }}>: {formatOnlyDate(content.tgl_surat)}</td>
          </tr>
          <tr>
            <td style={{ padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>NO. SURAT</td>
            <td style={{ padding: '6px 0' }}>: <span style={{ fontWeight: 600, color: '#1e293b' }}>{content.no_surat || '-'}</span></td>
            <td style={{ padding: '6px 0', color: '#64748b', fontWeight: 'bold' }}>ASAL SURAT</td>
            <td style={{ padding: '6px 0' }}>: <span style={{ fontWeight: 600, color: '#1e293b' }}>{content.asal_surat || '-'}</span></td>
          </tr>
          <tr>
            <td style={{ padding: '6px 0', color: '#64748b', fontWeight: 'bold', verticalAlign: 'top' }}>PERIHAL</td>
            <td colSpan={3} style={{ padding: '6px 0' }}>: <strong style={{ color: '#0f172a' }}>{content.perihal || '-'}</strong></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginBottom: '0.75rem', fontSize: '12px', fontWeight: 'bold', color: '#334155', letterSpacing: '0.05em' }}>
        KEPADA YTH (PENERIMA & STATUS TINDAK LANJUT)
      </div>

      <table className="items-table" style={{ width: '100%', marginBottom: '1.5rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <th className="text-center" style={{ width: '40px', padding: '8px' }}>NO</th>
            <th style={{ padding: '8px' }}>KEPADA YTH</th>
            <th className="text-center" style={{ width: '60px', padding: '8px' }}>INFO</th>
            <th className="text-center" style={{ width: '60px', padding: '8px' }}>ACTION</th>
            <th className="text-center" style={{ width: '60px', padding: '8px' }}>ARSIP</th>
            <th className="text-center" style={{ width: '120px', padding: '8px' }}>PARAF & STATUS</th>
          </tr>
        </thead>
        <tbody>
          {recipients.length > 0 ? (
            recipients.map((item: any, idx: number) => {
              const name = item.nama || item.nama_tujuan || item.jabatan || `Penerima #${idx + 1}`;
              const isInfo = item.is_info ? '✓' : '-';
              const isAction = item.is_action ? '✓' : '-';
              const isArsip = item.is_arsip ? '✓' : '-';
              const isDone = item.status === 'done' || item.status === 'disetujui' || item.status === 'SIGNED';

              return (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="text-center" style={{ padding: '8px' }}>{idx + 1}</td>
                  <td style={{ padding: '8px' }}><strong>{name}</strong></td>
                  <td className="text-center" style={{ padding: '8px', color: item.is_info ? '#4f46e5' : '#cbd5e1', fontWeight: 'bold' }}>{isInfo}</td>
                  <td className="text-center" style={{ padding: '8px', color: item.is_action ? '#059669' : '#cbd5e1', fontWeight: 'bold' }}>{isAction}</td>
                  <td className="text-center" style={{ padding: '8px', color: item.is_arsip ? '#d97706' : '#cbd5e1', fontWeight: 'bold' }}>{isArsip}</td>
                  <td className="text-center" style={{ padding: '8px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: isDone ? '#dcfce7' : '#fef3c7',
                        color: isDone ? '#166534' : '#92400e',
                        display: 'inline-block'
                      }}
                    >
                      {isDone ? 'Paraf / Done' : 'Pending'}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center" style={{ color: '#94a3b8', padding: '1.2rem' }}>
                (Daftar penerima disposisi tidak tersedia)
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginBottom: '1.2rem' }}>
        <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', marginBottom: '6px', letterSpacing: '0.05em' }}>
          CATATAN / INSTRUKSI DIREKTUR
        </strong>
        <div style={{
          padding: '14px 16px',
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '10px',
          fontSize: '13px',
          color: '#1e293b',
          whiteSpace: 'pre-line',
          lineHeight: '1.5'
        }}>
          {content.catatan || 'Tidak ada catatan khusus.'}
        </div>
      </div>

      {(content.diterima_oleh || content.tgl_diterima) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '10px',
          marginTop: '1rem'
        }}>
          <div>Diterima Oleh: <strong>{content.diterima_oleh || '-'}</strong></div>
          <div>Tanggal: <strong>{content.tgl_diterima ? formatDate(content.tgl_diterima) : '-'}</strong> {content.jam_diterima ? `(${content.jam_diterima})` : ''}</div>
        </div>
      )}
    </div>
  );
};
