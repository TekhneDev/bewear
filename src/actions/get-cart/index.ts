"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { getOrCreateCartId } from "@/data/cart";
import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { calculateCartTotalInCents } from "@/helpers/cart";
import { auth } from "@/lib/auth";

export const getCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const cartId = await getOrCreateCartId(session.user.id);
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.id, cartId),
    with: {
      shippingAddress: true,
      items: {
        orderBy: (item, { asc }) => [asc(item.createdAt)],
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart) {
    throw new Error("Cart not found");
  }
  return {
    ...cart,
    totalPriceInCents: calculateCartTotalInCents(cart.items),
  };
};
