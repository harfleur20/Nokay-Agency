"use client";

import { FormEvent, useState } from "react";

type Locale = "fr" | "en";
const copy = {
  fr: {
    eyebrow: "Parlons de votre projet", title: "Une idée à concrétiser ?", intro: "Présentez-nous votre besoin. Nous reviendrons vers vous pour échanger sur la meilleure façon d'avancer.",
    name: "Nom", email: "Adresse e-mail", company: "Entreprise (facultatif)", service: "Quel est votre besoin ?", choose: "Choisir une expertise",
    options: [["website","Site vitrine"],["application","Application web"],["saas","Produit SaaS"],["design","Design & communication"],["other","Autre / Je ne sais pas encore"]],
    budget: "Budget indicatif (facultatif)", budgets: [["unknown","À définir"],["lt3","Moins de 3 000 €"],["3-7","3 000 à 7 000 €"],["7-15","7 000 à 15 000 €"],["gt15","Plus de 15 000 €"]],
    message: "Parlez-nous de votre projet", messageHint: "Votre contexte, vos objectifs, vos délais…", consent: "J'accepte que NOKAY utilise ces informations pour répondre à ma demande.", submit: "Envoyer ma demande", sending: "Envoi en cours…", success: "Merci, votre demande a bien été transmise. Nous reviendrons vers vous.", error: "L'envoi n'a pas abouti. Réessayez dans un instant ou contactez-nous par un autre moyen.", required: "Merci de vérifier les champs obligatoires.", privacy: "Les informations envoyées sont utilisées uniquement pour traiter votre demande.",
  },
  en: {
    eyebrow: "Let's talk about your project", title: "Have an idea to bring to life?", intro: "Tell us what you have in mind. We'll get back to you to discuss the best way forward.",
    name: "Name", email: "Email address", company: "Company (optional)", service: "What do you need?", choose: "Choose an expertise",
    options: [["website","Website"],["application","Web application"],["saas","SaaS product"],["design","Design & communication"],["other","Other / Not sure yet"]],
    budget: "Estimated budget (optional)", budgets: [["unknown","To be defined"],["lt3","Under €3,000"],["3-7","€3,000–€7,000"],["7-15","€7,000–€15,000"],["gt15","Over €15,000"]],
    message: "Tell us about your project", messageHint: "Your context, goals, timeline…", consent: "I agree that NOKAY may use this information to respond to my enquiry.", submit: "Send enquiry", sending: "Sending…", success: "Thank you. Your enquiry has been sent and we'll be in touch.", error: "Your message could not be sent. Please try again shortly.", required: "Please check the required fields.", privacy: "Your information is used only to handle your enquiry.",
  },
} as const;

export function ContactForm({ locale = "fr" }: { locale?: Locale }) {
  const t = copy[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending"); setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success"); setFeedback(t.success); form.reset();
    } catch {
      setStatus("error"); setFeedback(t.error);
    }
  }
  return (
    <section id="contact" className="contact-section">
      <div className="section-shell contact-layout">
        <div className="contact-intro"><p className="eyebrow"><span className="eyebrow__line" /> {t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__row">
            <label>{t.name}<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
            <label>{t.email}<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          </div>
          <label>{t.company}<input name="company" autoComplete="organization" maxLength={120} /></label>
          <div className="contact-form__row">
            <label>{t.service}<select name="service" defaultValue="" required><option value="" disabled>{t.choose}</option>{t.options.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>{t.budget}<select name="budget" defaultValue="unknown">{t.budgets.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
          <label>{t.message}<textarea name="message" rows={5} required minLength={20} maxLength={5000} placeholder={t.messageHint} /></label>
          <label className="contact-consent"><input type="checkbox" name="consent" value="yes" required /><span>{t.consent}</span></label>
          <div className="contact-trap" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <button className="contact-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? t.sending : t.submit}<span aria-hidden="true">⟶</span></button>
          <p className="contact-privacy">{t.privacy}</p>
          {feedback && <p className={`contact-feedback contact-feedback--${status}`} role="status" aria-live="polite">{feedback}</p>}
        </form>
      </div>
    </section>
  );
}
