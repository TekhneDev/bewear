import { desc, eq, inArray, sum } from "drizzle-orm";

import { db } from "@/db";
import {
  orderItemTable,
  orderTable,
  productTable,
  productVariantTable,
} from "@/db/schema";

const PRODUCT_LIST_LIMIT = 10;

export const getBestSellingProducts = async () => {
  const totalSold = sum(orderItemTable.quantity);
  const bestSellers = await db
    .select({ productId: productVariantTable.productId })
    .from(orderItemTable)
    .innerJoin(orderTable, eq(orderItemTable.orderId, orderTable.id))
    .innerJoin(
      productVariantTable,
      eq(orderItemTable.productVariantId, productVariantTable.id),
    )
    .where(eq(orderTable.status, "paid"))
    .groupBy(productVariantTable.productId)
    .orderBy(desc(totalSold))
    .limit(PRODUCT_LIST_LIMIT);
  const bestSellerIds = bestSellers.map(({ productId }) => productId);
  const bestSellerProducts =
    bestSellerIds.length > 0
      ? await db.query.productTable.findMany({
          where: inArray(productTable.id, bestSellerIds),
          with: { variants: true },
        })
      : [];
  const sortedBestSellers = bestSellerIds
    .map((id) => bestSellerProducts.find((product) => product.id === id))
    .filter((product) => product !== undefined);
  if (sortedBestSellers.length >= PRODUCT_LIST_LIMIT) {
    return sortedBestSellers;
  }
  const fillerProducts = await db.query.productTable.findMany({
    with: { variants: true },
    limit: PRODUCT_LIST_LIMIT,
  });
  return [
    ...sortedBestSellers,
    ...fillerProducts.filter((product) => !bestSellerIds.includes(product.id)),
  ].slice(0, PRODUCT_LIST_LIMIT);
};

export const getNewestProducts = () =>
  db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: { variants: true },
    limit: PRODUCT_LIST_LIMIT,
  });
