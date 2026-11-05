"use client";

import { FormEvent, useState } from "react";

export function ForgotPasswordForm() {
  const [sent,setSent] = useState(false); const [loading,setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true);
    const form = new FormData(event.currentTarget);
    try { await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.get("email")})}); }
    finally { setSent(true); setLoading(false); }
  }
  if (sent) return <p role="status">Si cette adresse correspond à un compte client actif, un lien de réinitialisation vient d'être envoyé.</p>;
  return <form className="admin-login-form" onSubmit={submit}><label>Adresse e-mail<input name="email" type="email" autoComplete="email" required /></label><button disabled={loading}>{loading ? "Envoi…" : "Recevoir un lien"} ↗</button></form>;
}
