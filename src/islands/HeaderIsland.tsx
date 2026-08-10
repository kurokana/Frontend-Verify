import React from 'react';

export const HeaderIsland: React.FC = () => {
  return (
    <header className="verify-header">
      <div className="header-container">
        <div className="logo-section">
          <img src="/logo-fallback.png" alt="Logo RSBA" className="logo-img" />
          <div className="logo-text">
            <h1>RS Bintang Amin</h1>
            <p>Portal Verifikasi Dokumen Digital Resmi</p>
          </div>
        </div>
      </div>
    </header>
  );
};
