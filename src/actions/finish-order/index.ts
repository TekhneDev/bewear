"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable, orderItemTable, orderTable } from "@/db/schema";
import { calculateCartTotalInCents } from "@/helpers/cart";
import { auth } from "@/lib/auth";

export const finishOrder = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }
  const { shippingAddress } = cart;
  if (!shippingAddress) {
    throw new Error("Shipping address not found");
  }
  const orderId = await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orderTable)
      .values({
        userId: session.user.id,
        shippingAddressId: shippingAddress.id,
        recipientName: shippingAddress.recipientName,
        street: shippingAddress.street,
        number: shippingAddress.number,
        complement: shippingAddress.complement,
        neighborhood: shippingAddress.neighborhood,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        cpfOrCnpj: shippingAddress.cpfOrCnpj,
        totalPriceInCents: calculateCartTotalInCents(cart.items),
      })
      .returning({ id: orderTable.id });
    if (!order) {
      throw new Error("Failed to create order");
    }
    await tx.insert(orderItemTable).values(
      cart.items.map((item) => ({
        orderId: order.id,
        productVariantId: item.productVariant.id,
        quantity: item.quantity,
        priceInCents: item.productVariant.priceInCents,
      })),
    );
    return order.id;
  });
  return { orderId };
};
