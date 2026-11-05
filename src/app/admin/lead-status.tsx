"use client";

import { useState } from "react";

const labels: Record<string, string> = { NEW: "Nouvelle", QUALIFIED: "Qualifiée", QUOTED: "Devis envoyé", WON: "Gagnée", LOST: "Perdue", ARCHIVED: "Archivée" };

export function LeadStatusControl({ id, initialStatus }: { id: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  async function change(next: string) {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: next }) });
      if (!response.ok) throw new Error("Update failed");
      setStatus(next);
    } catch { window.alert("Impossible de mettre à jour le statut. Réessayez."); }
    finally { setSaving(false); }
  }
  return <select aria-label="Statut de la demande" value={status} disabled={saving} onChange={(event) => void change(event.target.value)}>{Object.entries(labels).map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select>;
}
