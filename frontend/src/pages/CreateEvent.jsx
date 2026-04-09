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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createEvent(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de l\'événement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container animate-fade-in">
      <div className="create-event-card glass-panel">
        <div className="header-section">
          <h1 className="text-accent-color">Créer un événement</h1>
          <p>Organisez votre prochain événement en quelques étapes.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

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
             <button type="button" onClick={() => navigate(-1)} className="btn btn-outline mr-4">
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
