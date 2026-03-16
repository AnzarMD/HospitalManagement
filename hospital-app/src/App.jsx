import { useState, useEffect } from "react";
import "./index.css";

import { api, getToken, setToken, clearToken } from "./services/api";

import Sidebar    from "./components/Sidebar";
import Topbar     from "./components/Topbar";
import LoginPage  from "./pages/LoginPage";
import Dashboard  from "./pages/Dashboard";
import PatientsPage      from "./pages/PatientsPage";
import AppointmentsPage  from "./pages/AppointmentsPage";
import StaffPage         from "./pages/StaffPage";
import InventoryPage     from "./pages/InventoryPage";
import ReportsPage       from "./pages/ReportsPage";

export default function App() {
  const [session, setSession]           = useState(null);
  const [activePage, setActivePage]     = useState("dashboard");
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [authLoading, setAuthLoading]   = useState(true);

  // Shared state loaded from API
  const [patients,     setPatients]     = useState([]);
  const [staffList,    setStaffList]    = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inventory,    setInventory]    = useState([]);

  // ── Restore session from token on mount ─────────────────────────────────────
  useEffect(() => {
    if (!getToken()) { setAuthLoading(false); return; }
    api.auth.me()
      .then(({ user }) => setSession(user))
      .catch(() => clearToken())
      .finally(() => setAuthLoading(false));
  }, []);

  // ── Load all data when logged in ────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    refreshAll();
  }, [session]);

  const refreshAll = () => {
    api.patients.list()         .then(setPatients).catch(console.error);
    api.appointments.list()     .then(setAppointments).catch(console.error);
    api.inventory.list()        .then(setInventory).catch(console.error);
    if (session?.role === "admin") {
      api.staff.list()          .then(setStaffList).catch(console.error);
    }
  };

  // ── Auth handlers ────────────────────────────────────────────────────────────
  const handleLogin = async (username, password) => {
    const { token, user } = await api.auth.login(username, password);
    setToken(token);
    setSession(user);
    setActivePage("dashboard");
  };

  const handleSignOut = () => {
    clearToken();
    setSession(null);
    setPatients([]); setStaffList([]); setAppointments([]); setInventory([]);
  };

  // ── Loading splash ───────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#030b17", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", fontFamily: "'DM Sans',sans-serif", fontSize: 16 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✚</div>
          <div>Loading MediCore…</div>
        </div>
      </div>
    );
  }

  if (!session) return <LoginPage onLogin={handleLogin} />;

  const isAdmin = session.role === "admin";

  const pages = {
    dashboard:    <Dashboard    patients={patients} staff={staffList} appointments={appointments} inventory={inventory} isAdmin={isAdmin} />,
    patients:     <PatientsPage patients={patients} setPatients={setPatients} isAdmin={isAdmin} />,
    appointments: <AppointmentsPage appointments={appointments} setAppointments={setAppointments} />,
    staff:        <StaffPage    staffList={staffList} setStaffList={setStaffList} />,
    inventory:    <InventoryPage inventory={inventory} setInventory={setInventory} isAdmin={isAdmin} />,
    reports:      <ReportsPage  patients={patients} appointments={appointments} inventory={inventory} />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#030b17", overflow: "hidden" }}>
      <Sidebar session={session} activePage={activePage} setActivePage={setActivePage} sidebarOpen={sidebarOpen} onSignOut={handleSignOut} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar activePage={activePage} isAdmin={isAdmin} onToggleSidebar={() => setSidebarOpen(p => !p)} />
        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {pages[activePage] ?? pages.dashboard}
        </main>
      </div>
    </div>
  );
}
