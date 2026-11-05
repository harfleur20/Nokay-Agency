"use client";

import { FormEvent, useState } from "react";

export function ClientLoginForm() {
  const [error,setError] = useState(""); const [loading,setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/client-login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.get("email"),password:form.get("password")})});
      if (!response.ok) throw new Error("Connexion impossible. Vérifiez vos identifiants.");
      window.location.assign("/account");
    } catch(e) { setError(e instanceof Error ? e.message : "Erreur de connexion."); setLoading(false); }
  }
  return <form className="admin-login-form" onSubmit={submit}><label>Adresse e-mail<input name="email" type="email" autoComplete="username" required /></label><label>Mot de passe<input name="password" type="password" autoComplete="current-password" required /></label><button disabled={loading}>{loading ? "Connexion…" : "Accéder à mon espace"} ↗</button>{error && <p role="alert">{error}</p>}</form>;
}
