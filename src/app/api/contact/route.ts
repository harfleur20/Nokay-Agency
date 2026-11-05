import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedServices = new Set(["website", "application", "saas", "design", "other"]);
const allowedBudgets = new Set(["unknown", "lt3", "3-7", "7-15", "15-30", "gt15", "gt30"]);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  // Honeypot: silently accept automated submissions without sending an email.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const company = clean(body.company, 120);
  const service = clean(body.service, 30);
  const budget = clean(body.budget, 20);
  const message = clean(body.message, 5000);
  const consent = body.consent === "yes";

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !allowedServices.has(service) || !allowedBudgets.has(budget) ||
      message.length < 20 || !consent) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  // Persist the enquiry first: email delivery is a notification, not the source of truth.
  let lead;
  try {
    lead = await prisma.lead.create({
      data: { name, email, company: company || null, service, budget, message, source: "website" },
      select: { id: true, createdAt: true },
    });
  } catch (error) {
    console.error("NOKAY could not persist contact request", error);
    return NextResponse.json({ error: "persistence_unavailable" }, { status: 503 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) {
    return NextResponse.json({ ok: true, leadId: lead.id, notification: "not_configured" }, { status: 201 });
  }

  const serviceLabels: Record<string, string> = {
    website: "Site vitrine", application: "Application web", saas: "Produit SaaS",
    design: "Design & communication", other: "Autre / à définir",
  };
  const budgetLabels: Record<string, string> = {
    unknown: "À définir", lt3: "Moins de 3 000 €", "3-7": "3 000 à 7 000 €",
    "7-15": "7 000 à 15 000 €", "15-30": "15 000 à 30 000 €", gt15: "Plus de 15 000 €", gt30: "Plus de 30 000 €",
  };
  const text = [
    "Nouvelle demande reçue depuis le site NOKAY",
    "",
    `Nom : ${name}`,
    `E-mail : ${email}`,
    `Entreprise : ${company || "Non renseignée"}`,
    `Expertise : ${serviceLabels[service]}`,
    `Budget : ${budgetLabels[budget]}`,
    "",
    "Message :",
    message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `NOKAY — Nouvelle demande de ${name}`,
        text,
      }),
    });
    if (!response.ok) {
      console.error("NOKAY contact email provider returned", response.status);
      return NextResponse.json({ ok: true, leadId: lead.id, notification: "failed" }, { status: 201 });
    }
    return NextResponse.json({ ok: true, leadId: lead.id, notification: "sent" }, { status: 201 });
  } catch (error) {
    console.error("NOKAY notification delivery failed", error);
    return NextResponse.json({ ok: true, leadId: lead.id, notification: "failed" }, { status: 201 });
  }
}
