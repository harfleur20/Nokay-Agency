"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Lead = { id: string; name: string; email: string; company: string | null; service: string };
type Quote = { id: string; reference: string; title: string; amountCents: number; currency: string; status: string; validUntil: string | null; createdAt: string; client: { name: string; email: string }; lead: { name: string; email: string } | null };
const statusLabels: Record<string,string> = { DRAFT: "Brouillon", SENT: "Envoyé", ACCEPTED: "Accepté", REJECTED: "Refusé", EXPIRED: "Expiré" };

export function QuotesManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/quotes", { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible de charger les devis.");
      const data = await response.json();
      setLeads(data.leads); setQuotes(data.quotes);
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur de chargement."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement);
    setSaving(true); setError("");
    const amountEuros = Number(form.get("amount"));
    if (!Number.isFinite(amountEuros) || amountEuros < 1) { setError("Saisissez un montant valide."); setSaving(false); return; }
    try {
      const response = await fetch("/api/admin/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: form.get("leadId"), title: form.get("title"), description: form.get("description"), amountCents: Math.round(amountEuros * 100), validUntil: form.get("validUntil") }) });
      if (!response.ok) throw new Error("Création du devis impossible.");
      formElement.reset(); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur."); }
    finally { setSaving(false); }
  }

  async function changeStatus(id: string, status: string) {
    try {
      const response = await fetch("/api/admin/quotes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      if (!response.ok) throw new Error("Mise à jour impossible.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur."); }
  }

  return <div className="quotes-manager">
    <form className="service-create" onSubmit={create}>
      <h2>Créer un devis brouillon</h2>
      <div className="service-form-grid">
        <label>Demande d'origine<select name="leadId" required defaultValue=""><option value="" disabled>Choisir une demande</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name} — {lead.email}{lead.company ? ` · ${lead.company}` : ""}</option>)}</select></label>
        <label>Intitulé<input name="title" required minLength={3} maxLength={160} placeholder="Création d'un site vitrine" /></label>
        <label>Montant total (€ HT)<input name="amount" type="number" min="1" step="0.01" required /></label>
      </div>
      <div className="service-form-grid">
        <label>Description<textarea name="description" rows={3} maxLength={4000} /></label>
        <label>Valable jusqu'au<input name="validUntil" type="date" /></label>
      </div>
      <button disabled={saving || leads.length === 0}>{saving ? "Création…" : "Créer le devis ↗"}</button>
      {leads.length === 0 && <small>Aucune demande éligible. Les nouveaux leads apparaîtront ici.</small>}
    </form>
    {error && <p className="admin-error" role="alert">{error}</p>}
    {loading ? <p className="admin-empty">Chargement…</p> : quotes.length === 0 ? <p className="admin-empty">Aucun devis pour le moment.</p> : <div className="admin-leads">{quotes.map((quote) => <article className="admin-lead quote-row" key={quote.id}>
      <div className="admin-lead__main"><div><strong>{quote.reference} · {quote.title}</strong><a href={`mailto:${quote.client.email}`}>{quote.client.name} — {quote.client.email}</a></div><strong>{(quote.amountCents / 100).toLocaleString("fr-FR",{style:"currency",currency:quote.currency})} HT</strong></div>
      <div className="admin-lead__meta"><span>{new Date(quote.createdAt).toLocaleDateString("fr-FR")}</span><span>{quote.validUntil ? `Valable jusqu'au ${new Date(quote.validUntil).toLocaleDateString("fr-FR")}` : "Sans date d'expiration"}</span><select aria-label={`Statut du devis ${quote.reference}`} value={quote.status} onChange={(event) => void changeStatus(quote.id,event.target.value)}>{Object.entries(statusLabels).map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select></div>
    </article>)}</div>}
  </div>;
}
