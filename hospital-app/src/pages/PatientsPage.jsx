import { useState } from "react";
import { Badge, Modal, FormField, SaveButton, ActionButton, SearchBar, AddButton } from "../components/UI";
import { WARDS, BLOOD_GROUPS } from "../data/mockData";
import { api } from "../services/api";

export default function PatientsPage({ patients, setPatients, isAdmin }) {
  const [search,       setSearch]       = useState("");
  const [modal,        setModal]        = useState(null);
  const [form,         setForm]         = useState({});
  const [filterStatus, setFilterStatus] = useState("All");
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState("");

  const filtered = patients.filter(p =>
    (filterStatus === "All" || p.status === filterStatus) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.id.includes(search) ||
     p.ward.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd  = () => { setForm({ name:"", age:"", gender:"Male", ward:"Cardiology", doctor:"", status:"Stable", bloodGroup:"A+", phone:"" }); setError(""); setModal("add"); };
  const openEdit = (p) => { setForm({ ...p }); setError(""); setModal(p); };
  const setField = (key) => (val) => setForm(p => ({ ...p, [key]: val }));

  const savePatient = async () => {
    if (!form.name || !form.doctor) { setError("Name and doctor are required"); return; }
    setSaving(true); setError("");
    try {
      if (modal === "add") {
        const created = await api.patients.create(form);
        setPatients(prev => [created, ...prev]);
      } else {
        const updated = await api.patients.update(form.id, form);
        setPatients(prev => prev.map(p => p.id === form.id ? updated : p));
      }
      setModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePatient = async (id) => {
    if (!confirm("Delete this patient?")) return;
    try {
      await api.patients.delete(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search patients…" />
        {["All","Stable","Critical","Recovering"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding: "9px 16px", background: filterStatus===s?"rgba(14,165,233,0.2)":"rgba(255,255,255,0.04)", border: `1px solid ${filterStatus===s?"#0ea5e9":"rgba(255,255,255,0.1)"}`, borderRadius: 10, color: filterStatus===s?"#38bdf8":"#64748b", fontSize: 12, fontWeight: 600 }}>
            {s}
          </button>
        ))}
        {isAdmin && <AddButton label="+ Add Patient" onClick={openAdd} />}
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["ID","Patient","Age/Gender","Ward","Doctor","Status","Admitted", isAdmin?"Actions":""].filter(Boolean).map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="table-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{p.id}</td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: `hsl(${p.name.charCodeAt(0)*7},55%,35%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{p.name[0]}</div>
                    <div><div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 11, color: "#64748b" }}>{p.bloodGroup}</div></div>
                  </div>
                </td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#94a3b8" }}>{p.age} · {p.gender}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#94a3b8" }}>{p.ward}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#94a3b8" }}>{p.doctor}</td>
                <td style={{ padding: "13px 16px" }}><Badge label={p.status} /></td>
                <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748b" }}>{p.admitted}</td>
                {isAdmin && (
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <ActionButton label="Edit" onClick={() => openEdit(p)} variant="primary" />
                      <ActionButton label="Del"  onClick={() => deletePatient(p.id)} variant="danger" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#475569", fontSize: 14 }}>No patients found</div>}
      </div>

      {modal && (
        <Modal title={modal==="add"?"Add New Patient":"Edit Patient"} onClose={() => setModal(null)}>
          {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#fca5a5", marginBottom:14 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn:"1/-1" }}><FormField label="Full Name" value={form.name||""} onChange={setField("name")} required /></div>
            <FormField label="Age"        value={form.age||""}        onChange={setField("age")}        type="number" />
            <FormField label="Gender"     value={form.gender||"Male"} onChange={setField("gender")}     options={["Male","Female","Other"]} />
            <FormField label="Ward"       value={form.ward||"Cardiology"} onChange={setField("ward")}   options={WARDS} />
            <FormField label="Blood Group" value={form.bloodGroup||"A+"} onChange={setField("bloodGroup")} options={BLOOD_GROUPS} />
            <div style={{ gridColumn:"1/-1" }}><FormField label="Doctor" value={form.doctor||""} onChange={setField("doctor")} required /></div>
            <FormField label="Status" value={form.status||"Stable"} onChange={setField("status")} options={["Stable","Critical","Recovering"]} />
            <FormField label="Phone"  value={form.phone||""}        onChange={setField("phone")} />
          </div>
          <SaveButton label={saving ? "Saving…" : modal==="add"?"Add Patient":"Save Changes"} onClick={savePatient} />
        </Modal>
      )}
    </div>
  );
}
