"use server";

import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

import { getOrCreateCartId } from "@/data/cart";
import { db } from "@/db";
import { cartItemTable, productVariantTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  const { productVariantId, quantity } = addProductToCartSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.id, productVariantId),
  });
  if (!productVariant) {
    throw new Error("Product variant not found");
  }
  const cartId = await getOrCreateCartId(session.user.id);
  await db
    .insert(cartItemTable)
    .values({ cartId, productVariantId, quantity })
    .onConflictDoUpdate({
      target: [cartItemTable.cartId, cartItemTable.productVariantId],
      set: { quantity: sql`${cartItemTable.quantity} + ${quantity}` },
    });
};
