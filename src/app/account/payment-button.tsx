"use client";

import { useState } from "react";

export function PaymentButton({ orderId }: { orderId: string }) {
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  async function pay() {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/account/orders/${orderId}/checkout`,{method:"POST"});
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error === "payment_already_pending" ? "Un paiement est déjà en attente. Réessayez après quelques instants." : "Le paiement est momentanément indisponible.");
      window.location.assign(data.url);
    } catch(e) { setError(e instanceof Error ? e.message : "Erreur de paiement."); setLoading(false); }
  }
  return <div className="payment-action"><button type="button" onClick={() => void pay()} disabled={loading}>{loading ? "Préparation…" : "Payer en ligne ↗"}</button>{error && <small role="alert">{error}</small>}</div>;
}
