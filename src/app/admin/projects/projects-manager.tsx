"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Client = { id: string; name: string; email: string };
type Project = { id: string; name: string; description: string | null; status: string; progress: number; dueDate: string | null; client: Client; updates: { id: string; title: string; createdAt: string }[] };
const statuses: Record<string,string> = { PLANNING: "Planification", DESIGN: "Design", DEVELOPMENT: "Développement", REVIEW: "Validation", DELIVERED: "Livré", ON_HOLD: "En pause" };

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/projects", { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible de charger les projets.");
      const data = await response.json(); setProjects(data.projects); setClients(data.clients);
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur de chargement."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement);
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      if (!response.ok) throw new Error("Création impossible. Vérifiez le client et le nom.");
      formElement.reset(); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur."); }
    finally { setSaving(false); }
  }

  async function update(id: string, patch: Record<string, unknown>) {
    setError("");
    try {
      const response = await fetch("/api/admin/projects", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) });
      if (!response.ok) throw new Error("Mise à jour impossible.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur."); }
  }

  async function addUpdate(event: FormEvent<HTMLFormElement>, projectId: string) {
    event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement);
    try {
      const response = await fetch("/api/admin/project-updates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, title: form.get("title"), body: form.get("body"), visibleToClient: form.get("visibleToClient") === "on" }) });
      if (!response.ok) throw new Error("Impossible d'ajouter cette actualité.");
      formElement.reset(); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur."); }
  }

  return <div className="projects-manager">
    <form className="service-create" onSubmit={create}>
      <h2>Créer un projet</h2>
      <div className="service-form-grid">
        <label>Client<select name="clientId" required defaultValue=""><option value="" disabled>Choisir un client</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name} — {client.email}</option>)}</select></label>
        <label>Nom du projet<input name="name" required minLength={3} maxLength={160} /></label>
        <label>Date cible<input name="dueDate" type="date" /></label>
      </div>
      <label>Description<textarea name="description" rows={3} maxLength={4000} /></label>
      <button disabled={saving || clients.length === 0}>{saving ? "Création…" : "Créer le projet ↗"}</button>
      {clients.length === 0 && <small>Créez d'abord un devis depuis une demande pour enregistrer un contact comme client.</small>}
    </form>
    {error && <p className="admin-error" role="alert">{error}</p>}
    {loading ? <p className="admin-empty">Chargement…</p> : projects.length === 0 ? <p className="admin-empty">Aucun projet créé.</p> : <div className="admin-leads">{projects.map((project) => <article className="admin-lead project-card" key={project.id}>
      <div className="admin-lead__main"><div><strong>{project.name}</strong><a href={`mailto:${project.client.email}`}>{project.client.name} — {project.client.email}</a></div><span>{project.dueDate ? `Échéance : ${new Date(project.dueDate).toLocaleDateString("fr-FR")}` : "Sans échéance"}</span></div>
      {project.description && <p className="project-description">{project.description}</p>}
      <div className="project-controls"><label>Étape<select value={project.status} onChange={(event) => void update(project.id,{status:event.target.value})}>{Object.entries(statuses).map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Progression : {project.progress}%<input type="range" min="0" max="100" step="5" value={project.progress} onChange={(event) => void update(project.id,{progress:Number(event.target.value)})} /></label></div>
      <details className="project-update-details"><summary>Ajouter une actualité client</summary><form onSubmit={(event) => void addUpdate(event,project.id)}><input name="title" required minLength={3} maxLength={160} placeholder="Titre de l'actualité" /><textarea name="body" required minLength={5} maxLength={4000} rows={3} placeholder="Avancement, prochaine étape, point à valider…" /><label><input name="visibleToClient" type="checkbox" defaultChecked /> Visible dans l'espace client</label><button>Publier l'actualité ↗</button></form></details>
    </article>)}</div>}
  </div>;
}
