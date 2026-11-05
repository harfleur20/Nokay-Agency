import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "webhook_not_configured" }, { status: 400 });
  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("NOKAY Stripe webhook signature validation failed", error);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentId = session.metadata?.paymentId;
      if (!paymentId || session.payment_status !== "paid") return NextResponse.json({ received: true });
      const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({ where: { id: paymentId } });
        if (!payment || payment.status === PaymentStatus.SUCCEEDED) return;
        const claimed = await tx.payment.updateMany({
          where: { id: paymentId, status: PaymentStatus.PENDING },
          data: { status: PaymentStatus.SUCCEEDED, paidAt: new Date(), providerPaymentIntentId: paymentIntentId || null },
        });
        if (claimed.count !== 1) return;
        await tx.order.update({ where: { id: payment.orderId }, data: { status: OrderStatus.IN_PROGRESS } });
      });
    }

    if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentId = session.metadata?.paymentId;
      if (paymentId) await prisma.payment.updateMany({ where: { id: paymentId, status: PaymentStatus.PENDING }, data: { status: PaymentStatus.FAILED } });
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const paymentId = intent.metadata?.paymentId;
      if (paymentId) await prisma.payment.updateMany({ where: { id: paymentId, status: PaymentStatus.PENDING }, data: { status: PaymentStatus.FAILED } });
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("NOKAY Stripe webhook processing failed", error);
    return NextResponse.json({ error: "webhook_processing_failed" }, { status: 500 });
  }
}
