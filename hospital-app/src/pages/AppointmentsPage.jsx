import { useState } from "react";
import { Badge, Modal, FormField, SaveButton, AddButton } from "../components/UI";
import { APPOINTMENT_TYPES } from "../data/mockData";
import { api } from "../services/api";

export default function AppointmentsPage({ appointments, setAppointments }) {
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState({ patient:"", doctor:"", date:"", time:"", type:"Consultation" });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  const setField = (key) => (val) => setForm(p => ({ ...p, [key]: val }));

  const addAppointment = async () => {
    if (!form.patient || !form.doctor || !form.date) { setError("Patient, doctor and date are required"); return; }
    setSaving(true); setError("");
    try {
      const created = await api.appointments.create(form);
      setAppointments(prev => [...prev, created]);
      setModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const updated = await api.appointments.toggleStatus(id);
      setAppointments(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) { alert(err.message); }
  };

  const deleteAppt = async (id) => {
    if (!confirm("Delete this appointment?")) return;
    try {
      await api.appointments.delete(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <AddButton label="+ Schedule Appointment"
          onClick={() => { setForm({ patient:"", doctor:"", date:"", time:"", type:"Consultation" }); setError(""); setModal(true); }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {appointments.map(a => (
          <div key={a.id} className="card-hover" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#475569" }}>{a.id}</span>
              <Badge label={a.status} />
            </div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>{a.patient}</div>
            <div style={{ fontSize:13, color:"#64748b", marginBottom:12 }}>{a.doctor}</div>
            <div style={{ display:"flex", gap:12, fontSize:12, color:"#94a3b8" }}>
              <span>📅 {a.date}</span><span>🕐 {a.time}</span>
            </div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:6, background:"rgba(255,255,255,0.04)", borderRadius:6, padding:"4px 8px", display:"inline-block" }}>{a.type}</div>
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <button onClick={() => toggleStatus(a.id)}
                style={{ flex:1, padding:"7px 0", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:8, color:"#34d399", fontSize:11, fontWeight:600 }}>
                {a.status==="Pending"?"✓ Confirm":"↩ Revert"}
              </button>
              <button onClick={() => deleteAppt(a.id)}
                style={{ padding:"7px 14px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, color:"#ef4444", fontSize:11 }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title="Schedule Appointment" onClose={() => setModal(false)}>
          {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#fca5a5", marginBottom:14 }}>{error}</div>}
          <FormField label="Patient Name" value={form.patient} onChange={setField("patient")} required />
          <FormField label="Doctor"       value={form.doctor}  onChange={setField("doctor")}  required />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <FormField label="Date" value={form.date} onChange={setField("date")} type="date" required />
            <FormField label="Time" value={form.time} onChange={setField("time")} type="time" />
          </div>
          <FormField label="Type" value={form.type} onChange={setField("type")} options={APPOINTMENT_TYPES} />
          <SaveButton label={saving?"Saving…":"Schedule"} onClick={addAppointment} />
        </Modal>
      )}
    </div>
  );
}
