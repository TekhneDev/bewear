import { NextResponse } from "next/server";
import Stripe from "stripe";

import { markOrderAsCanceled, markOrderAsPaid } from "@/data/order";
import { getStripe } from "@/lib/stripe";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret is not set" },
      { status: 500 },
    );
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId && session.payment_status === "paid") {
      await markOrderAsPaid(orderId);
    }
  }
  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const orderId = event.data.object.metadata?.orderId;
    if (orderId) {
      await markOrderAsCanceled(orderId);
    }
  }
  return NextResponse.json({ received: true });
};
