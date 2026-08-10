import React, { useState } from 'react';

interface ManualHashIslandProps {
  onSubmit: (hash: string) => void;
  loading: boolean;
}

export const ManualHashIsland: React.FC<ManualHashIslandProps> = ({ onSubmit, loading }) => {
  const [manualHash, setManualHash] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualHash.trim()) {
      onSubmit(manualHash.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="manual-form">
      <div className="form-group">
        <label htmlFor="hash-input">Kode Hash QR Surat (UUID / SHA256)</label>
        <input
          id="hash-input"
          type="text"
          placeholder="Tempelkan docstore key (UUID) atau QR hash dari surat..."
          value={manualHash}
          onChange={(e) => setManualHash(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Memverifikasi...' : 'Verifikasi Kode QR'}
      </button>
    </form>
  );
};
