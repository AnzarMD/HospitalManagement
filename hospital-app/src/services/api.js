const BASE = "http://localhost:3001/api";

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

// ── Base fetch wrapper ────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    login: (username, password) =>
      request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
    me: () => request("/auth/me"),
  },

  // ── Patients ────────────────────────────────────────────────────────────────
  patients: {
    list:   (params = {}) => request("/patients?" + new URLSearchParams(params)),
    get:    (id)          => request(`/patients/${id}`),
    create: (data)        => request("/patients",     { method: "POST",   body: JSON.stringify(data) }),
    update: (id, data)    => request(`/patients/${id}`,{ method: "PUT",   body: JSON.stringify(data) }),
    delete: (id)          => request(`/patients/${id}`,{ method: "DELETE" }),
  },

  // ── Staff ────────────────────────────────────────────────────────────────────
  staff: {
    list:   ()         => request("/staff"),
    create: (data)     => request("/staff",     { method: "POST",   body: JSON.stringify(data) }),
    update: (id, data) => request(`/staff/${id}`,{ method: "PUT",   body: JSON.stringify(data) }),
    delete: (id)       => request(`/staff/${id}`,{ method: "DELETE" }),
  },

  // ── Appointments ─────────────────────────────────────────────────────────────
  appointments: {
    list:         ()   => request("/appointments"),
    create:       (data) => request("/appointments", { method: "POST", body: JSON.stringify(data) }),
    toggleStatus: (id)   => request(`/appointments/${id}/status`, { method: "PATCH" }),
    delete:       (id)   => request(`/appointments/${id}`, { method: "DELETE" }),
  },

  // ── Inventory ────────────────────────────────────────────────────────────────
  inventory: {
    list:        (params = {}) => request("/inventory?" + new URLSearchParams(params)),
    create:      (data)        => request("/inventory",      { method: "POST",   body: JSON.stringify(data) }),
    update:      (id, data)    => request(`/inventory/${id}`,{ method: "PUT",    body: JSON.stringify(data) }),
    updateStock: (id, delta)   => request(`/inventory/${id}/stock`, { method: "PATCH", body: JSON.stringify({ delta }) }),
    delete:      (id)          => request(`/inventory/${id}`,{ method: "DELETE" }),
  },
};
