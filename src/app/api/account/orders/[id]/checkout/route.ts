import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { PaymentStatus } from "@prisma/client";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = await requireClient();
  if (!client) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!id || id.length > 100) return NextResponse.json({ error: "invalid_order" }, { status: 400 });

  try {
    const order = await prisma.order.findFirst({ where: { id, clientId: client.id }, include: { payments: true } });
    if (!order) return NextResponse.json({ error: "order_not_found" }, { status: 404 });
    if (order.status === "CANCELLED" || order.status === "COMPLETED") return NextResponse.json({ error: "order_not_payable" }, { status: 409 });

    const paid = order.payments.filter((payment) => payment.status === PaymentStatus.SUCCEEDED).reduce((sum, payment) => sum + payment.amountCents, 0);
    const remaining = order.amountCents - paid;
    if (remaining <= 0) return NextResponse.json({ error: "order_already_paid" }, { status: 409 });
    const amountCents = paid === 0 && order.depositCents ? Math.min(order.depositCents, remaining) : remaining;
    const stripe = getStripe();
    const existingPending = order.payments.find((payment) => payment.status === PaymentStatus.PENDING);
    if (existingPending?.providerCheckoutSessionId) {
      const existingSession = await stripe.checkout.sessions.retrieve(existingPending.providerCheckoutSessionId);
      if (existingSession.status === "open" && existingSession.url) return NextResponse.json({ url: existingSession.url });
      if (existingSession.status === "expired") {
        await prisma.payment.update({ where: { id: existingPending.id }, data: { status: PaymentStatus.FAILED } });
      } else {
        return NextResponse.json({ error: "payment_already_pending" }, { status: 409 });
      }
    } else if (existingPending) {
      return NextResponse.json({ error: "payment_already_pending" }, { status: 409 });
    }

    const idempotencyKey = randomBytes(24).toString("hex");
    const payment = await prisma.payment.create({ data: { orderId: order.id, amountCents, currency: order.currency.toLowerCase(), status: PaymentStatus.PENDING, idempotencyKey } });
    const baseUrl = (process.env.AUTH_URL || new URL(request.url).origin).replace(/\/$/, "");
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ quantity: 1, price_data: { currency: order.currency.toLowerCase(), unit_amount: amountCents, product_data: { name: `NOKAY — ${order.reference} · ${order.title}` } } }],
        customer_email: client.email,
        success_url: `${baseUrl}/account?payment=success`,
        cancel_url: `${baseUrl}/account?payment=cancelled`,
        metadata: { paymentId: payment.id, orderId: order.id },
        payment_intent_data: { metadata: { paymentId: payment.id, orderId: order.id } },
      }, { idempotencyKey });
      if (!session.url) throw new Error("Stripe did not return a checkout URL.");
      await prisma.payment.update({ where: { id: payment.id }, data: { providerCheckoutSessionId: session.id } });
      return NextResponse.json({ url: session.url });
    } catch (error) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: PaymentStatus.FAILED } });
      console.error("NOKAY Stripe checkout creation failed", error);
      return NextResponse.json({ error: "checkout_unavailable" }, { status: 502 });
    }
  } catch (error) {
    console.error("NOKAY checkout request failed", error);
    return NextResponse.json({ error: "checkout_unavailable" }, { status: 503 });
  }
}
