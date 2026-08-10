import React, { useEffect, useRef, useState } from 'react';

interface PdfViewerWithStampProps {
  pdfBase64: string;
  stampX?: number;
  stampY?: number;
  stampScale?: number;
  signerName?: string;
  signedAt?: string;
  byteHash?: string;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const PdfViewerWithStamp: React.FC<PdfViewerWithStampProps> = ({
  pdfBase64,
  stampX = 70,
  stampY = 75,
  stampScale = 100,
  signerName = 'Super Admin',
  signedAt = 'Valid & Registered',
  byteHash = 'Docstore Vault'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPdfJs = async () => {
      if (!window.pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            renderPdf();
          }
        };
        script.onerror = () => {
          if (isMounted) setError('Gagal memuat pustaka PDF.js');
        };
        document.body.appendChild(script);
      } else {
        renderPdf();
      }
    };

    const renderPdf = async () => {
      if (!containerRef.current || !pdfBase64) return;

      try {
        setLoading(true);
        const binaryString = atob(pdfBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const loadingTask = window.pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;

        if (!isMounted || !containerRef.current) return;
        containerRef.current.innerHTML = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });
          const pageAspectRatio = viewport.height / viewport.width;

          const pageDiv = document.createElement('div');
          pageDiv.style.position = 'relative';
          pageDiv.style.margin = '0 auto 20px auto';
          pageDiv.style.width = '100%';
          pageDiv.style.maxWidth = '850px';
          pageDiv.style.aspectRatio = `1 / ${pageAspectRatio}`;
          pageDiv.style.boxShadow = '0 6px 24px rgba(0,0,0,0.25)';
          pageDiv.style.borderRadius = '4px';
          pageDiv.style.overflow = 'hidden';
          pageDiv.style.background = '#ffffff';

          const canvas = document.createElement('canvas');
          canvas.style.display = 'block';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          pageDiv.appendChild(canvas);

          // Note: Hard-stamped PDF files already contain the Mekari Vault Seal directly inside Page 1 PDF stream.
          // Optional dynamic overlay is available for legacy fallback.
          if (pageNum === 1 && (stampX === -1)) {
            const stampDiv = document.createElement('div');
            stampDiv.style.position = 'absolute';
            stampDiv.style.left = `${stampX}%`;
            stampDiv.style.top = `${stampY}%`;
            
            setTimeout(() => {
              const currentWidth = pageDiv.clientWidth || 850;
              stampDiv.style.transform = `scale(${(stampScale / 100) * (currentWidth / 850)})`;
            }, 0);

            stampDiv.style.transformOrigin = 'top left';
            stampDiv.style.background = 'rgba(255, 255, 255, 0.96)';
            stampDiv.style.padding = '10px 12px';
            stampDiv.style.borderRadius = '12px';
            stampDiv.style.border = '2px solid #10b981';
            stampDiv.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15), 0 0 0 3px rgba(16, 185, 129, 0.15)';
            stampDiv.style.width = '190px';
            stampDiv.style.zIndex = '20';
            stampDiv.style.pointerEvents = 'none';

            const displayDate = signedAt.includes('WIB') ? signedAt : `${signedAt} WIB`;

            stampDiv.innerHTML = `
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #d1fae5; padding-bottom: 4px; margin-bottom: 4px;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <div style="width: 14px; height: 14px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: 900; flex-shrink: 0;">✓</div>
                  <span style="font-size: 8.5px; font-weight: 900; text-transform: uppercase; color: #065f46; letter-spacing: 0.05em;">SIGNED BY MEKARI VAULT</span>
                </div>
              </div>
              <div style="font-size: 11px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${signerName}</div>
              <div style="font-size: 8.5px; color: #64748b; font-family: monospace; margin-top: 2px;">${displayDate}</div>
              <div style="font-size: 8px; font-family: monospace; color: #4338ca; margin-top: 3px; background: #eef2ff; padding: 2px 5px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                SHA: ${byteHash.substring(0, 14)}...
              </div>
            `;
            pageDiv.appendChild(stampDiv);
          }

          containerRef.current.appendChild(pageDiv);

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
        }

        if (isMounted) setLoading(false);
      } catch (err: any) {
        console.error('PDF.js render error:', err);
        if (isMounted) {
          setError('Gagal merekonstruksi halaman PDF.');
          setLoading(false);
        }
      }
    };

    loadPdfJs();

    return () => {
      isMounted = false;
    };
  }, [pdfBase64, stampX, stampY, stampScale, signerName, signedAt, byteHash]);

  return (
    <div style={{ marginTop: '1.5rem', width: '100%' }}>
      <h5 className="section-title">Pratinjau Berkas PDF Terdaftar:</h5>
      <div 
        style={{
          width: '100%',
          maxHeight: '650px',
          overflow: 'auto',
          background: '#0f172a',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #334155',
          marginTop: '0.5rem'
        }}
      >
        {loading && (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px', fontSize: '0.9rem' }}>
            Memuat dan Merekonstruksi Halaman PDF + Stempel Mekari Vault...
          </div>
        )}
        {error && (
          <div style={{ color: '#f87171', textAlign: 'center', padding: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
        <div ref={containerRef} style={{ display: loading ? 'none' : 'block' }}></div>
      </div>
    </div>
  );
};
