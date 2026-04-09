import { useState } from 'react';
import { api } from '../services/api';
import './Dashboard.css';
import { Scan, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const [ticketId, setTicketId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!ticketId) return;
    
    setLoading(true);
    setScanResult(null);
    try {
      const res = await api.scanTicket(ticketId);
      setScanResult({ success: true, message: res.message || 'Ticket validé avec succès!' });
      setTicketId('');
    } catch (err) {
      setScanResult({ success: false, message: err.message || 'Ticket invalide ou déjà scanné.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header text-center mb-8">
        <h1 className="text-accent-color">Tableau de Bord Créateur</h1>
        <p className="text-muted">Gérez vos événements et scannez les billets d'entrée.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card glass-panel text-center">
          <h3>Scanner un billet</h3>
          <p className="text-muted mb-4">Entrez l'ID du billet pour valider l'entrée d'un visiteur.</p>

          <form onSubmit={handleScan} className="scan-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="ID du Billet (ex: 1234-abcd...)"
                className="input-field text-center"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full mt-2" disabled={loading}>
              <Scan size={18} />
              <span>{loading ? 'Validation...' : 'Valider'}</span>
            </button>
          </form>

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
