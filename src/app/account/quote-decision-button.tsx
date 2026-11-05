"use client";

import { useState } from "react";

export function QuoteDecisionButton({ quoteId, decision }: { quoteId: string; decision: "accept" | "reject" }) {
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  async function submit() {
    const action = decision === "accept" ? "accepter" : "refuser";
    if (!window.confirm(`Confirmez-vous votre choix : ${action} ce devis ?`)) return;
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/account/quotes/${quoteId}/decision`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({decision})});
      if (!response.ok) throw new Error("Votre réponse n'a pas pu être enregistrée. Réessayez.");
      window.location.reload();
    } catch(e) { setError(e instanceof Error ? e.message : "Erreur."); setLoading(false); }
  }
  return <div className="quote-decision"><button type="button" className={decision==="accept"?"quote-accept":"quote-reject"} disabled={loading} onClick={()=>void submit()}>{loading ? "Enregistrement…" : decision==="accept"?"Accepter le devis":"Refuser"}</button>{error && <small role="alert">{error}</small>}</div>;
}
