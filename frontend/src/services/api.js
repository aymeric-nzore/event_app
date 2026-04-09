const API_URL = import.meta.env.VITE_API_URL || "https://event-app-9hw2.onrender.com";

// Helper to get headers
const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // --- AUTH ---
  async login(UsernameOrEmail, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UsernameOrEmail, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error);
    return data;
  },
  
  async register(username, email, password) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error);
    return data;
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error);
    return data.events;
  },

  async createEvent(eventData) {
    const res = await fetch(`${API_URL}/api/events/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(eventData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error);
    return data;
  },

  async joinEvent(eventId) {
    const res = await fetch(`${API_URL}/api/events/${eventId}/join`, {
      method: "POST",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error);
    return data;
  },

  async getExpectedUsers(eventId) {
    const res = await fetch(`${API_URL}/api/events/${eventId}/usersAttendus`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error);
    return data;
  },

  // --- TICKETS ---
  async scanTicket(ticketID) {
    const res = await fetch(`${API_URL}/api/ticket/scan`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ ticketID }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error);
    return data;
  }
};
