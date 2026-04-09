import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music, MapPin, Plus, LogOut, User as UserIcon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-content flex justify-between items-center">
        <Link to="/" className="navbar-logo flex items-center gap-2">
          <div className="logo-icon flex items-center justify-center">
            <Music size={20} />
          </div>
          <span className="text-accent-color">EventHub</span>
        </Link>

        <div className="navbar-links flex items-center gap-6">
          <Link to="/" className="nav-link flex items-center gap-1">
            <MapPin size={18} />
            <span>À proximité</span>
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link flex items-center gap-1">
                <span>Dashboard</span>
              </Link>
              <Link to="/create" className="btn btn-primary sm-btn flex items-center gap-1">
                <Plus size={18} />
                <span>Créer un événement</span>
              </Link>
              
              <div className="user-menu flex items-center gap-4">
                <div className="user-profile flex items-center gap-2">
                  <div className="avatar flex items-center justify-center">
                    <UserIcon size={16} />
                  </div>
                  <span className="username">{user.username}</span>
                </div>
                
                <button onClick={handleLogout} className="btn-icon text-muted" title="Déconnexion">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links flex items-center gap-4">
              <Link to="/login" className="nav-link">Connexion</Link>
              <Link to="/register" className="btn btn-primary bg-primary mb-0">S'inscrire</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
