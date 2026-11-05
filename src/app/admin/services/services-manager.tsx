"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Service = { id: string; slug: string; nameFr: string; nameEn: string; descriptionFr: string | null; descriptionEn: string | null; active: boolean; sortOrder: number };

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/services", { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible de charger les prestations.");
      const data = await response.json();
      setServices(data.services);
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur de chargement."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      if (!response.ok) throw new Error("Création impossible. Vérifiez le slug et les noms.");
      formElement.reset();
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur."); }
    finally { setSaving(false); }
  }

  async function toggle(service: Service) {
    setError("");
    try {
      const response = await fetch("/api/admin/services", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: service.id, active: !service.active }) });
      if (!response.ok) throw new Error("Mise à jour impossible.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur."); }
  }

  return <div className="services-manager">
    <form className="service-create" onSubmit={create}>
      <h2>Ajouter une prestation</h2>
      <div className="service-form-grid">
        <label>Slug<input name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="ex: audit-ux" required /></label>
        <label>Nom français<input name="nameFr" required minLength={2} /></label>
        <label>Nom anglais<input name="nameEn" required minLength={2} /></label>
      </div>
      <div className="service-form-grid">
        <label>Description française<textarea name="descriptionFr" rows={3} /></label>
        <label>Description anglaise<textarea name="descriptionEn" rows={3} /></label>
      </div>
      <button disabled={saving}>{saving ? "Enregistrement…" : "Créer la prestation ↗"}</button>
    </form>
    {error && <p role="alert" className="admin-error">{error}</p>}
    {loading ? <p className="admin-empty">Chargement…</p> : services.length === 0 ? <p className="admin-empty">Aucune prestation créée.</p> : <div className="admin-leads">{services.map((service) => <article className="admin-lead service-row" key={service.id}>
      <div><strong>{service.nameFr}</strong><span>{service.nameEn} · <code>{service.slug}</code></span></div>
      <span className={service.active ? "service-active" : "service-inactive"}>{service.active ? "Active" : "Masquée"}</span>
      <button type="button" onClick={() => void toggle(service)}>{service.active ? "Masquer" : "Activer"}</button>
    </article>)}</div>}
  </div>;
}
