"use client";

import { FormEvent, useState } from "react";

export function ResetPasswordForm({ token }: { token: string }) {
  const [error,setError] = useState(""); const [done,setDone] = useState(false); const [loading,setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password !== String(form.get("confirm") || "")) { setError("Les deux mots de passe ne correspondent pas."); setLoading(false); return; }
    try {
      const response = await fetch("/api/auth/reset-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,password})});
      if (!response.ok) throw new Error("Le lien est invalide ou expiré. Demandez-en un nouveau.");
      setDone(true);
    } catch(e) { setError(e instanceof Error ? e.message : "Réinitialisation impossible."); }
    finally { setLoading(false); }
  }
  if (done) return <p role="status">Votre mot de passe a été modifié. <a href="/account/login">Connectez-vous à votre espace.</a></p>;
  return <form className="admin-login-form" onSubmit={submit}><label>Nouveau mot de passe<input name="password" type="password" minLength={12} autoComplete="new-password" required /></label><label>Confirmer le mot de passe<input name="confirm" type="password" minLength={12} autoComplete="new-password" required /></label><button disabled={loading}>{loading ? "Enregistrement…" : "Modifier le mot de passe"} ↗</button>{error && <p role="alert">{error}</p>}</form>;
}
