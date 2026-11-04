import { asc } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

export const getCategories = cache(() =>
  db.query.categoryTable.findMany({
    orderBy: [asc(categoryTable.name)],
  }),
);

export const getCategoriesWithCover = async () => {
  const categories = await db.query.categoryTable.findMany({
    orderBy: [asc(categoryTable.name)],
    with: {
      products: {
        limit: 1,
        with: { variants: { limit: 1 } },
      },
    },
  });
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    coverImageUrl: category.products[0]?.variants[0]?.imageUrl ?? null,
  }));
};
