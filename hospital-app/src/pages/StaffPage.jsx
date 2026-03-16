import { useState } from "react";
import { Badge, Modal, FormField, SaveButton, ActionButton, AddButton } from "../components/UI";
import { DEPARTMENTS, SHIFTS } from "../data/mockData";
import { avatarColor, initials } from "../utils/helpers";
import { api } from "../services/api";

export default function StaffPage({ staffList, setStaffList }) {
  const [modal,  setModal]  = useState(null);
  const [form,   setForm]   = useState({});
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const setField = (key) => (val) => setForm(p => ({ ...p, [key]: val }));

  const openAdd  = () => { setForm({ name:"", role:"", dept:"Cardiology", shift:"Morning", status:"Active" }); setError(""); setModal("add"); };
  const openEdit = (s) => { setForm({ ...s }); setError(""); setModal(s); };

  const save = async () => {
    if (!form.name || !form.role) { setError("Name and role are required"); return; }
    setSaving(true); setError("");
    try {
      if (modal === "add") {
        const created = await api.staff.create(form);
        setStaffList(prev => [created, ...prev]);
      } else {
        const updated = await api.staff.update(form.id, form);
        setStaffList(prev => prev.map(s => s.id === form.id ? updated : s));
      }
      setModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteStaff = async (id) => {
    if (!confirm("Delete this staff member?")) return;
    try {
      await api.staff.delete(id);
      setStaffList(prev => prev.filter(s => s.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
        <AddButton label="+ Add Staff" onClick={openAdd} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
        {staffList.map(s => (
          <div key={s.id} className="card-hover" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:22 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div style={{ width:46, height:46, borderRadius:"50%", background:avatarColor(s.name), display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, flexShrink:0 }}>
                {initials(s.name)}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700 }}>{s.name}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>{s.role}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              {[["Dept",s.dept],["Shift",s.shift],["ID",s.id],["Since",s.joined]].map(([k,v]) => (
                <div key={k} style={{ background:"rgba(255,255,255,0.03)", borderRadius:7, padding:"6px 10px" }}>
                  <div style={{ fontSize:10, color:"#475569", fontWeight:600, textTransform:"uppercase", letterSpacing:0.8 }}>{k}</div>
                  <div style={{ fontSize:12, fontWeight:500, marginTop:2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <Badge label={s.status} />
              <div style={{ display:"flex", gap:6 }}>
                <ActionButton label="Edit" onClick={() => openEdit(s)} variant="primary" />
                <ActionButton label="Del"  onClick={() => deleteStaff(s.id)} variant="danger" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal==="add"?"Add Staff Member":"Edit Staff"} onClose={() => setModal(null)}>
          {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#fca5a5", marginBottom:14 }}>{error}</div>}
          <FormField label="Full Name"   value={form.name||""}  onChange={setField("name")}  required />
          <FormField label="Role / Title" value={form.role||""} onChange={setField("role")}  required />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <FormField label="Department" value={form.dept||"Cardiology"} onChange={setField("dept")}  options={DEPARTMENTS} />
            <FormField label="Shift"      value={form.shift||"Morning"}   onChange={setField("shift")} options={SHIFTS} />
          </div>
          <FormField label="Status" value={form.status||"Active"} onChange={setField("status")} options={["Active","On Leave","Inactive"]} />
          <SaveButton label={saving?"Saving…":"Save"} onClick={save} />
        </Modal>
      )}
    </div>
  );
}
