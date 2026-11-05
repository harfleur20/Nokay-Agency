"use client";

import { FormEvent, useState } from "react";

type Locale = "fr" | "en";
const copy = {
  fr: {
    title: "Parlons de votre projet.", intro: "Quelques informations nous aideront à préparer un premier échange pertinent.",
    name: "Nom et prénom", email: "Adresse e-mail", company: "Entreprise (facultatif)", service: "Prestation", package: "Forfait envisagé (facultatif)", budget: "Budget envisagé", timeline: "Quand souhaitez-vous démarrer ?", details: "Décrivez votre projet", detailsHint: "Objectifs, fonctionnalités, public cible, contraintes, inspirations…",
    options: [["websites","Site vitrine"],["apps","Application web"],["saas","Produit SaaS"],["design","Design graphique & communication"],["other","Autre / à définir"]],
    budgets: [["unknown","À définir"],["lt3","Moins de 3 000 €"],["3-7","3 000 à 7 000 €"],["7-15","7 000 à 15 000 €"],["15-30","15 000 à 30 000 €"],["gt30","Plus de 30 000 €"]],
    timelines: [["asap","Dès que possible"],["month","Dans 1 à 2 mois"],["quarter","Dans 3 à 6 mois"],["later","Plus tard / à définir"]],
    consent: "J’accepte que NOKAY utilise ces informations pour répondre à ma demande.", submit: "Envoyer ma demande de devis", sending: "Envoi en cours…", success: "Votre demande a été transmise. Nous reviendrons vers vous.", error: "L’envoi a échoué. Vérifiez la configuration e-mail ou réessayez plus tard.", privacy: "Vos informations servent uniquement à traiter cette demande. Consultez la politique de confidentialité.",
  },
  en: {
    title: "Let's talk about your project.", intro: "A few details will help us prepare a useful first conversation.",
    name: "Full name", email: "Email address", company: "Company (optional)", service: "Service", package: "Package (optional)", budget: "Estimated budget", timeline: "When would you like to start?", details: "Tell us about your project", detailsHint: "Goals, features, target audience, constraints, references…",
    options: [["websites","Website"],["apps","Web application"],["saas","SaaS product"],["design","Graphic design & communication"],["other","Other / to be defined"]],
    budgets: [["unknown","To be defined"],["lt3","Under €3,000"],["3-7","€3,000–€7,000"],["7-15","€7,000–€15,000"],["15-30","€15,000–€30,000"],["gt30","Over €30,000"]],
    timelines: [["asap","As soon as possible"],["month","Within 1–2 months"],["quarter","Within 3–6 months"],["later","Later / to be defined"]],
    consent: "I agree that NOKAY may use this information to respond to my enquiry.", submit: "Send quote request", sending: "Sending…", success: "Your enquiry has been sent. We'll be in touch.", error: "Sending failed. Check the email configuration or try again later.", privacy: "Your information is only used to handle this enquiry. See our privacy policy.",
  },
} as const;

export function QuoteForm({ locale, initialService = "", initialPackage = "" }: { locale: Locale; initialService?: string; initialPackage?: string }) {
  const t = copy[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const details = String(data.get("details") || "");
    const message = [
      `${locale === "en" ? "Package" : "Forfait"}: ${data.get("package") || (locale === "en" ? "Not specified" : "Non précisé")}`,
      `${locale === "en" ? "Target start" : "Démarrage"}: ${data.get("timeline") || (locale === "en" ? "Not specified" : "Non précisé")}`,
      "",
      details,
    ].join("\n");
    setStatus("sending"); setFeedback("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        name: data.get("name"), email: data.get("email"), company: data.get("company"),
        service: ({ websites: "website", apps: "application" } as Record<string, string>)[String(data.get("service"))] || data.get("service"), budget: data.get("budget"), message, consent: data.get("consent"), website: data.get("website"),
      })});
      if (!response.ok) throw new Error("Request failed");
      setStatus("success"); setFeedback(t.success); form.reset();
    } catch {
      setStatus("error"); setFeedback(t.error);
    }
  }
  return <form className="contact-form quote-form" onSubmit={submit}>
    <div className="contact-form__row">
      <label>{t.name}<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
      <label>{t.email}<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    </div>
    <label>{t.company}<input name="company" autoComplete="organization" maxLength={120} /></label>
    <div className="contact-form__row">
      <label>{t.service}<select name="service" defaultValue={initialService || "other"} required>{t.options.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>{t.package}<input name="package" defaultValue={initialPackage} maxLength={100} /></label>
    </div>
    <div className="contact-form__row">
      <label>{t.budget}<select name="budget" defaultValue="unknown">{t.budgets.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>{t.timeline}<select name="timeline" defaultValue="later">{t.timelines.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    <label>{t.details}<textarea name="details" rows={7} minLength={20} maxLength={4500} required placeholder={t.detailsHint} /></label>
    <label className="contact-consent"><input type="checkbox" name="consent" value="yes" required /><span>{t.consent}</span></label>
    <div className="contact-trap" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button className="contact-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? t.sending : t.submit}<span aria-hidden="true">↗</span></button>
    <p className="contact-privacy">{t.privacy}</p>
    {feedback && <p className={`contact-feedback contact-feedback--${status}`} role="status" aria-live="polite">{feedback}</p>}
  </form>;
}
