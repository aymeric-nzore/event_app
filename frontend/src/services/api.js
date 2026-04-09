const API_URL = import.meta.env.VITE_API_URL || "https://event-app-9hw2.onrender.com";

// Helper to get headers
const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Global response handler to catch 401 Expired Token
const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }
  
  if (!res.ok) {
    // Si le token a expiré (401), on vide le cache et on redirige pour forcer la reconnexion
    if (res.status === 401 && (data.error === "Token invalide" || data.message === "Token invalide")) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    throw new Error(data.message || data.error || "Une erreur est survenue");
  }
  return data;
};

export const api = {
  // --- AUTH ---
  async login(UsernameOrEmail, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UsernameOrEmail, password }),
    });
    return handleResponse(res);
  },
  
  async register(username, email, password) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(res);
  },

  async logout(refreshToken) {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || data.error);
    }
    return true;
  },

  // --- EVENTS ---
  async getNearbyEvents(lat, lng, km = 50) {
    const res = await fetch(`${API_URL}/api/events/nearby?lat=${lat}&lng=${lng}&km=${km}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await handleResponse(res);
    return data.events;
  },

  async createEvent(eventData) {
    const res = await fetch(`${API_URL}/api/events/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(eventData),
    });
    return handleResponse(res);
  },

  async joinEvent(eventId) {
    const res = await fetch(`${API_URL}/api/events/${eventId}/join`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getExpectedUsers(eventId) {
    const res = await fetch(`${API_URL}/api/events/${eventId}/usersAttendus`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // --- TICKETS ---
  async scanTicket(ticketID) {
    const res = await fetch(`${API_URL}/api/ticket/scan`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ ticketID }),
    });
    return handleResponse(res);
  }
};
