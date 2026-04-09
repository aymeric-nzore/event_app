import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(formData.usernameOrEmail, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || "Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h1 className="text-accent-color">Bienvenue</h1>
          <p>Connectez-vous pour retrouver vos événements.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="usernameOrEmail">Email ou Nom d'utilisateur</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              className="input-field"
              placeholder="Ex: jean.dupont@email.com"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full mt-4"
            disabled={loading}
          >
            {loading ? 'Connexion...' : (
              <>
                <LogIn size={20} />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Pas encore de compte ? <Link to="/register" className="auth-link">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
