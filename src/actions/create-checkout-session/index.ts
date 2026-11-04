"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";

const CHECKOUT_SESSION_DURATION_IN_SECONDS = 30 * 60;

export const createCheckoutSession = async (
  data: CreateCheckoutSessionSchema,
) => {
  const stripe = getStripe();
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("App URL is not set");
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const { orderId } = createCheckoutSessionSchema.parse(data);
  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
    with: {
      items: {
        with: {
          productVariant: { with: { product: true } },
        },
      },
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }
  if (order.status !== "pending") {
    throw new Error("Order is not pending");
  }
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: order.email,
    expires_at:
      Math.floor(Date.now() / 1000) + CHECKOUT_SESSION_DURATION_IN_SECONDS,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId,
    },
    line_items: order.items.map((orderItem) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: `${orderItem.productVariant.product.name} - ${orderItem.productVariant.name}`,
          description: orderItem.productVariant.product.description,
          images: [orderItem.productVariant.imageUrl],
        },
        unit_amount: orderItem.priceInCents,
      },
      quantity: orderItem.quantity,
    })),
  });
  if (!checkoutSession.url) {
    throw new Error("Failed to create checkout session");
  }
  return { url: checkoutSession.url };
};
