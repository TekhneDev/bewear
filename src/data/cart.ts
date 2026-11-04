import { eq } from "drizzle-orm";

import { db } from "@/db";
import { cartTable } from "@/db/schema";

export const getOrCreateCartId = async (userId: string) => {
  await db.insert(cartTable).values({ userId }).onConflictDoNothing({
    target: cartTable.userId,
  });
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, userId),
    columns: { id: true },
  });
  if (!cart) {
    throw new Error("Failed to create cart");
  }
  return cart.id;
};

export const getCartWithItems = (userId: string) =>
  db.query.cartTable.findFirst({
    where: eq(cartTable.userId, userId),
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
