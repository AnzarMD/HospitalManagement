import { useState } from "react";
import { Modal, FormField, SaveButton, ActionButton, SearchBar, AddButton } from "../components/UI";
import { INVENTORY_CATEGORIES, INVENTORY_UNITS } from "../data/mockData";
import { api } from "../services/api";

export default function InventoryPage({ inventory, setInventory, isAdmin }) {
  const [modal,  setModal]  = useState(null);
  const [form,   setForm]   = useState({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (key) => (val) => setForm(p => ({ ...p, [key]: val }));

  const openAdd = () => { setForm({ name:"", category:"Medicine", stock:"", unit:"Units", threshold:"", supplier:"" }); setError(""); setModal("add"); };

  const save = async () => {
    if (!form.name) { setError("Name is required"); return; }
    setSaving(true); setError("");
    try {
      if (modal === "add") {
        const created = await api.inventory.create(form);
        setInventory(prev => [...prev, created]);
      } else {
        const updated = await api.inventory.update(form.id, form);
        setInventory(prev => prev.map(i => i.id === form.id ? updated : i));
      }
      setModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStock = async (id, delta) => {
    try {
      const updated = await api.inventory.updateStock(id, delta);
      setInventory(prev => prev.map(i => i.id === id ? updated : i));
    } catch (err) { alert(err.message); }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.inventory.delete(id);
      setInventory(prev => prev.filter(i => i.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search inventory…" />
        {isAdmin && <AddButton label="+ Add Item" onClick={openAdd} />}
      </div>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              {["ID","Item Name","Category","Stock","Min. Threshold","Supplier","Actions"].map(h => (
                <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, textAlign:"left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const low = item.stock < item.threshold;
              return (
                <tr key={item.id} className="table-row" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding:"13px 16px", fontSize:12, color:"#64748b" }}>{item.id}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{item.name}</div>
                    {low && <div style={{ fontSize:10, color:"#f97316", fontWeight:700, marginTop:2 }}>⚠ LOW STOCK</div>}
                  </td>
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ fontSize:11, background:"rgba(255,255,255,0.06)", padding:"3px 10px", borderRadius:20, color:"#94a3b8" }}>{item.category}</span>
                  </td>
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:low?"#ef4444":"#34d399" }}>{item.stock}</span>
                    <span style={{ fontSize:11, color:"#475569", marginLeft:4 }}>{item.unit}</span>
                  </td>
                  <td style={{ padding:"13px 16px", fontSize:13, color:"#64748b" }}>{item.threshold}</td>
                  <td style={{ padding:"13px 16px", fontSize:13, color:"#64748b" }}>{item.supplier}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <div style={{ display:"flex", gap:4 }}>
                      <button onClick={() => updateStock(item.id,-1)} style={{ width:28, height:28, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:6, color:"#ef4444", fontSize:14, fontWeight:700 }}>−</button>
                      <button onClick={() => updateStock(item.id,10)} style={{ width:28, height:28, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:6, color:"#34d399", fontSize:14, fontWeight:700 }}>+</button>
                      {isAdmin && <ActionButton label="Edit" onClick={() => { setForm({...item}); setError(""); setModal(item); }} variant="primary" />}
                      {isAdmin && <ActionButton label="Del"  onClick={() => deleteItem(item.id)} variant="danger" />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal==="add"?"Add Inventory Item":"Edit Item"} onClose={() => setModal(null)}>
          {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#fca5a5", marginBottom:14 }}>{error}</div>}
          <FormField label="Item Name" value={form.name||""} onChange={setField("name")} required />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <FormField label="Category"      value={form.category||"Medicine"} onChange={setField("category")}  options={INVENTORY_CATEGORIES} />
            <FormField label="Unit"          value={form.unit||"Units"}        onChange={setField("unit")}       options={INVENTORY_UNITS} />
            <FormField label="Current Stock" value={form.stock||""}            onChange={setField("stock")}      type="number" required />
            <FormField label="Min. Threshold" value={form.threshold||""}       onChange={setField("threshold")}  type="number" />
          </div>
          <FormField label="Supplier" value={form.supplier||""} onChange={setField("supplier")} />
          <SaveButton label={saving?"Saving…":"Save"} onClick={save} />
        </Modal>
      )}
    </div>
  );
}
