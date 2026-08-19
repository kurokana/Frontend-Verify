import React, { useState } from 'react';

interface PdfUploadIslandProps {
  onSubmit: (file: File) => void;
  loading: boolean;
}

export const PdfUploadIsland: React.FC<PdfUploadIslandProps> = ({ onSubmit, loading }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pdfFile) {
      onSubmit(pdfFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pdf-form">
      <div className="form-group">
        <label htmlFor="pdf-input">UNGGAH FILE SURAT PDF (.PDF)</label>
        <input
          id="pdf-input"
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={loading || !pdfFile}>
        {loading ? 'Memverifikasi Berkas PDF...' : 'Verifikasi Keaslian Berkas PDF'}
      </button>
    </form>
  );
};
