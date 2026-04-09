import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Calendar, MapPin, AlignLeft, Tag } from 'lucide-react';
import './CreateEvent.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventType: 'Concert',
    date: '',
    adress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsSuccess(false);
    try {
      await api.createEvent(formData);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2500); // Wait 2.5s before redirect
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de l\'événement.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      if (!isSuccess) setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="create-event-container animate-fade-in flex items-center justify-center">
        <div className="create-event-card glass-panel flex-col items-center justify-center text-center animate-scale-in" style={{ padding: '4rem 2rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'inline-flex' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }} className="text-accent-color">Événement Créé !</h2>
          <p className="text-muted">Votre événement a été publié avec succès.</p>
          <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>Redirection vers l'accueil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-event-container animate-fade-in">
      <div className="create-event-card glass-panel">
        <div className="header-section">
          <h1 className="text-accent-color">Créer un événement</h1>
          <p>Organisez votre prochain événement en quelques étapes.</p>
        </div>

        {error && <div className="auth-error animate-shake">{error}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="input-group">
            <label className="input-label" htmlFor="name">Nom de l'événement</label>
            <div className="input-icon-wrapper">
              <input
                type="text"
                id="name"
                name="name"
                className="input-field"
                placeholder="Ex: Mega Concert 2026"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="eventType">Type d'événement</label>
            <div className="input-icon-wrapper">
              <Tag className="input-icon" size={18} />
              <select
                id="eventType"
                name="eventType"
                className="input-field with-icon"
                value={formData.eventType}
                onChange={handleChange}
              >
                <option value="Concert">Concert</option>
                <option value="Evangelisation">Evangelisation</option>
                <option value="Other">Autre</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="date">Date et heure</label>
            <div className="input-icon-wrapper">
              <Calendar className="input-icon" size={18} />
              <input
                type="datetime-local"
                id="date"
                name="date"
                className="input-field with-icon"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="adress">Adresse complète</label>
            <div className="input-icon-wrapper">
              <MapPin className="input-icon" size={18} />
              <input
                type="text"
                id="adress"
                name="adress"
                className="input-field with-icon"
                placeholder="Ex: 5 Avenue de la République, Paris"
                value={formData.adress}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="description">Description</label>
            <div className="input-icon-wrapper">
              <AlignLeft className="input-icon" size={18} style={{ alignItems: 'flex-start', marginTop: '10px' }} />
              <textarea
                id="description"
                name="description"
                className="input-field with-icon textarea"
                placeholder="Décrivez votre événement..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-actions mt-8 text-right">
             <button type="button" onClick={() => navigate(-1)} className="btn btn-outline mr-4" disabled={loading}>
               Annuler
             </button>
             <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading ? 'Création en cours...' : 'Publier l\'événement'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
