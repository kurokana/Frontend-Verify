import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface ScannerIslandProps {
  onScanSuccess: (decodedText: string) => void;
}

export const ScannerIsland: React.FC<ScannerIslandProps> = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleStartScan = async () => {
    setCameraError(null);
    setIsScanning(true);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          handleStopScan();
        },
        () => {}
      );
    } catch (err: any) {
      console.error('Failed to start camera', err);
      setCameraError(err.message || 'Gagal mengakses kamera. Pastikan izin kamera telah diberikan.');
      setIsScanning(false);
    }
  };

  const handleStopScan = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.error('Failed to stop camera', err);
      } finally {
        setIsScanning(false);
        html5QrCodeRef.current = null;
      }
    }
  };

  return (
    <div className="camera-section">
      <div className="scanner-wrapper">
        <div id="qr-reader" className={isScanning ? 'scanning' : ''}></div>
        {!isScanning && (
          <div className="scanner-placeholder">
            <svg className="qr-big-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0a8 8 0 11-16 0 8 8 0 0116 0z"></path>
            </svg>
            <p>Kamera belum aktif. Arahkan kamera ke Kode QR pada surat dan klik tombol di bawah.</p>
          </div>
        )}
      </div>

      <div className="scanner-controls">
        {!isScanning ? (
          <button className="btn btn-primary" onClick={handleStartScan}>
            Mulai Scanner Kamera
          </button>
        ) : (
          <button className="btn btn-danger" onClick={handleStopScan}>
            Hentikan Scanner
          </button>
        )}
      </div>

      {cameraError && <div className="alert alert-warning mt-3">{cameraError}</div>}
    </div>
  );
};
