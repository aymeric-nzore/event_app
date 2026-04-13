import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import './Dashboard.css';
import { Scan, CheckCircle, XCircle, Camera, Users, TicketCheck } from 'lucide-react';
import QRScanner from '../components/QRScanner';

const Dashboard = () => {
  const [ticketId, setTicketId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ expectedUsers: 0, scannedUsers: 0 });
  const lastScannedTicketRef = useRef("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      if (data.success) {
        setStats({ expectedUsers: data.expectedUsers, scannedUsers: data.scannedUsers });
      }
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  };

  const handleQRCapture = async (decodedText, resumeScan) => {
    if (loading) return; 

    // Vérification rapide Front-End :
    // Si le QR code scanné ne ressemble pas du tout à un Token JWT (3 blocs séparés par des points),
    // on l'ignore silencieusement ou on le rejette sans même déranger le backend
    const isJwtFormat = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(decodedText);
    
    setTicketId(decodedText);
    setLoading(true);
    setScanResult(null);

    if (!isJwtFormat) {
      setScanResult({ success: false, message: 'Ce QR Code ne vient pas de notre plateforme.' });
      setLoading(false);
      lastScannedTicketRef.current = decodedText;
      setTimeout(() => {
         setScanResult(null);
         setTicketId('');
         resumeScan();
      }, 3500);
      return;
    }

    if (decodedText === lastScannedTicketRef.current) {
      setScanResult({ success: false, message: 'Action bloquée: Ticket déjà scanné à l\'instant.' });
      setLoading(false);
      setTimeout(() => {
         setScanResult(null);
         setTicketId('');
         resumeScan();
      }, 3500);
      return;
    }

    try {
      const res = await api.scanTicket(decodedText);
      setScanResult({ success: true, message: res.message || 'Ticket validé avec succès!' });
      lastScannedTicketRef.current = decodedText;
      fetchStats();
    } catch (err) {
      setScanResult({ success: false, message: err.message || 'Ticket invalide ou déjà scanné.' });
      lastScannedTicketRef.current = decodedText;
    } finally {
      setLoading(false);
      // Efface le résultat et reprend le scan après 3 secondes
      setTimeout(() => {
         setScanResult(null);
         setTicketId('');
         resumeScan();
      }, 3500);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header text-center mb-8">
        <h1 className="text-accent-color">Tableau de Bord Créateur</h1>
        <p className="text-muted">Gérez vos événements et scannez les billets d'entrée.</p>
      </div>

      <div className="stats-container flex gap-4 justify-center mb-8">
        <div className="stat-card glass-panel flex-1 text-center p-4">
          <Users size={32} className="text-accent-color mx-auto mb-2"/>
          <h2 className="text-2xl font-bold">{stats.expectedUsers}</h2>
          <p className="text-muted">Attendus</p>
        </div>
        <div className="stat-card glass-panel flex-1 text-center p-4">
          <TicketCheck size={32} className="text-success mx-auto mb-2"/>
          <h2 className="text-2xl font-bold">{stats.scannedUsers}</h2>
          <p className="text-muted">Présents</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card glass-panel text-center">
          <h3>Scanner un billet</h3>
          <p className="text-muted mb-4">Pointez la caméra vers le code QR de l'invité.</p>

          <div className="camera-container mx-auto">
             {loading && <p className="text-accent-color font-bold animate-pulse mb-3">Validation en cours...</p>}
             <QRScanner onScanSuccess={handleQRCapture} />
          </div>

          {scanResult && (
            <div className={`scan-result ${scanResult.success ? 'success' : 'error'} mt-4 p-4 rounded`}>
              {scanResult.success ? <CheckCircle size={24} className="mb-2" /> : <XCircle size={24} className="mb-2" />}
              <p>{scanResult.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
