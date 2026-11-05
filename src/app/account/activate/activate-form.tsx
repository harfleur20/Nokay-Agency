"use client";

import { FormEvent, useState } from "react";

export function ActivateForm({ token }: { token: string }) {
  const [error,setError] = useState(""); const [loading,setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    if (password !== confirm) { setError("Les deux mots de passe ne correspondent pas."); setLoading(false); return; }
    try {
      const response = await fetch("/api/auth/activate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,password})});
      if (!response.ok) throw new Error("Ce lien est invalide ou expiré. Demandez une nouvelle invitation à NOKAY.");
      window.location.assign("/account");
    } catch(e) { setError(e instanceof Error ? e.message : "Activation impossible."); setLoading(false); }
  }
  return <form className="admin-login-form" onSubmit={submit}><label>Créer un mot de passe<input name="password" type="password" minLength={12} autoComplete="new-password" required /></label><label>Confirmer le mot de passe<input name="confirm" type="password" minLength={12} autoComplete="new-password" required /></label><button disabled={loading}>{loading ? "Activation…" : "Activer mon espace"} ↗</button>{error && <p role="alert">{error}</p>}</form>;
}
