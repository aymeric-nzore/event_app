import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './QRScanner.css';

const QRScanner = ({ onScanSuccess }) => {

  useEffect(() => {
    // Eviter de créer plusieurs scanners (utile en React strict mode)
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0] // qr code only
      },
      /* verbose= */ false
    );

    const onScan = (decodedText) => {
      // Empêche le scanner de relire en boucle pendant le traitement
      scanner.pause(true);
      onScanSuccess(decodedText, () => {
         // callback de reprise (resume) après le scan
         scanner.resume();
      });
    };

    const onError = (errorMessage) => {
      // Silencieux (il y a trop d'erreurs logguées à chaque frame non détectée)
    };

    scanner.render(onScan, onError);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="qr-wrapper">
      <div id="qr-reader"></div>
      <p className="scanner-instruction text-muted mt-2">Placez le QR Code de l'invité devant la caméra</p>
    </div>
  );
};

export default QRScanner;
