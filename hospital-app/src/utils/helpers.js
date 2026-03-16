export const statusColor = (s) =>
  ({
    Critical: "#ef4444",
    Stable: "#10b981",
    Recovering: "#f59e0b",
    "On Leave": "#f59e0b",
    Active: "#10b981",
    Confirmed: "#10b981",
    Pending: "#f59e0b",
    Inactive: "#64748b",
  })[s] || "#94a3b8";

export const generateId = (prefix, list) =>
  `${prefix}-${String(list.length + 1).padStart(3, "0")}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const avatarColor = (name) => `hsl(${name.charCodeAt(0) * 7},55%,30%)`;

export const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
