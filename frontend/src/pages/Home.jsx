import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './Home.css';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event, onJoin, joinLoading }) => {
  const date = new Date(event.date).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="event-card glass-panel">
      <div className="event-type-badge">{event.eventType}</div>
      <div className="event-content">
        <h3 className="event-title">{event.name}</h3>
        <p className="event-desc">{event.description}</p>

        <div className="event-details">
          <div className="detail-item flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span>{date}</span>
          </div>
          <div className="detail-item flex items-center gap-2">
            <MapPin size={16} className="text-accent" />
            <span>{event.adress}</span>
          </div>
        </div>

        <button
          onClick={() => onJoin(event._id)}
          className="btn btn-primary btn-full mt-4"
          disabled={joinLoading === event._id}
        >
          {joinLoading === event._id ? 'Inscription...' : (
            <>
              <Ticket size={18} />
              <span>Participer</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinLoading, setJoinLoading] = useState(null);
  const [location, setLocation] = useState({ lat: 5.359951, lng: -4.008256 }); // Default Abidjan
  const { user } = useAuth();
  const [joinedMsg, setJoinedMsg] = useState(null);

  useEffect(() => {
    // Demander la localisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          fetchEvents(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Si refusé, utiliser défaut
          fetchEvents(location.lat, location.lng);
        }
      );
    } else {
      fetchEvents(location.lat, location.lng);
    }
    // eslint-disable-next-line
  }, []);

  const fetchEvents = async (lat, lng) => {
    try {
      setLoading(true);
      const data = await api.getNearbyEvents(lat, lng, 20000); // 20000km pour tester sans rater d'événements
      setEvents(data || []);
    } catch (err) {
      setError("Impossible de charger les événements.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (eventId) => {
    if (!user) {
      alert("Vous devez être connecté pour participer à un événement.");
      return;
    }
    try {
      setJoinLoading(eventId);
      const res = await api.joinEvent(eventId);
      setJoinedMsg(`Inscrit à l'événement ! Un QR code vous a été envoyé par e-mail.`);
      setTimeout(() => setJoinedMsg(null), 5000);
    } catch (err) {
      alert(err.message || "Erreur lors de l'inscription.");
    } finally {
      setJoinLoading(null);
    }
  };

  return (
    <div className="home-container animate-fade-in">
      <div className="home-header">
        <h1 className="main-title">Découvrez des <span className="text-accent-color">événements exceptionnels</span></h1>
        <p className="subtitle">Trouvez les meilleurs concerts, conférences et rencontres autour de vous.</p>
      </div>

      {joinedMsg && (
        <div className="success-banner glass-panel flex items-center justify-center">
          {joinedMsg}
        </div>
      )}

      {loading ? (
        <div className="loader-container flex justify-center mt-8">
          <div className="loader"></div>
          <p>Recherche d'événements...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : events.length === 0 ? (
        <div className="empty-state text-center">
          <Users size={48} className="text-muted mx-auto mb-4" />
          <h3>Aucun événement proche</h3>
          <p className="text-muted">Créez-en un pour commencer !</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((evt) => (
            <EventCard
              key={evt._id}
              event={evt}
              onJoin={handleJoin}
              joinLoading={joinLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
