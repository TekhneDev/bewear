import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductGridPage from "@/components/common/product-grid-page";
import { parseProductSort } from "@/data/product-sort";
import { sortProducts } from "@/data/products";
import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ordem?: string }>;
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const [{ slug }, { ordem }] = await Promise.all([params, searchParams]);
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });
  if (!category) {
    return notFound();
  }
  const products = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, category.id),
    with: {
      variants: true,
    },
  });
  return (
    <>
      <Header />
      <ProductGridPage
        title={category.name}
        breadcrumb={category.name}
        products={sortProducts(products, parseProductSort(ordem))}
        emptyMessage="Nenhum produto nesta categoria por enquanto."
      />
      <Footer />
    </>
  );
};

export default CategoryPage;
