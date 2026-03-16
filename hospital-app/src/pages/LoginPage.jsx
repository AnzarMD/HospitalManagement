import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await onLogin(username.trim(), password);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#e2e8f0", fontSize: 14, outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030b17", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,0.07),transparent 70%)", top: -200, right: -200, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.06),transparent 70%)", bottom: -200, left: -200, pointerEvents: "none" }} />

      <div style={{ width: 420, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "48px 40px", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✚</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22 }}>MediCore HMS</div>
            <div style={{ fontSize: 12, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase" }}>Hospital Management</div>
          </div>
        </div>

        <div style={{ fontSize: 24, fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: 8 }}>Welcome back</div>
        <div style={{ fontSize: 14, color: "#64748b", marginBottom: 32 }}>Sign in to your account to continue</div>

        {[{ label: "Username", val: username, set: setUsername, type: "text", placeholder: "admin or staff" },
          { label: "Password", val: password, set: setPassword, type: "password", placeholder: "••••••••" }].map(f => (
          <div key={f.label} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{f.label}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} type={f.type} placeholder={f.placeholder}
              onKeyDown={e => e.key === "Enter" && handleLogin()} style={inputStyle} />
          </div>
        ))}

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#fca5a5", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button className="btn-primary" onClick={handleLogin} disabled={loading}
          style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, marginTop: 4 }}>
          {loading ? "Signing in…" : "Sign In →"}
        </button>

        <div style={{ marginTop: 24, padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Demo Credentials</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Admin: <span style={{ color: "#38bdf8" }}>admin</span> / <span style={{ color: "#38bdf8" }}>admin123</span></div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Staff: <span style={{ color: "#34d399" }}>staff</span> / <span style={{ color: "#34d399" }}>staff123</span></div>
        </div>
      </div>
    </div>
  );
}
