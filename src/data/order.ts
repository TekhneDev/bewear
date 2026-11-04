import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { cartItemTable, cartTable, orderTable } from "@/db/schema";

export const markOrderAsPaid = async (orderId: string) => {
  await db.transaction(async (tx) => {
    const [order] = await tx
      .update(orderTable)
      .set({ status: "paid" })
      .where(and(eq(orderTable.id, orderId), eq(orderTable.status, "pending")))
      .returning({ userId: orderTable.userId });
    if (!order) {
      return;
    }
    const userCarts = tx
      .select({ id: cartTable.id })
      .from(cartTable)
      .where(eq(cartTable.userId, order.userId));
    await tx
      .delete(cartItemTable)
      .where(inArray(cartItemTable.cartId, userCarts));
  });
};

export const markOrderAsCanceled = async (orderId: string) => {
  await db
    .update(orderTable)
    .set({ status: "canceled" })
    .where(and(eq(orderTable.id, orderId), eq(orderTable.status, "pending")));
};
