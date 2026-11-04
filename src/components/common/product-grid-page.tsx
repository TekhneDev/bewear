import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { productTable, productVariantTable } from "@/db/schema";

import ProductItem from "./product-item";
import ProductSort from "./product-sort";

interface ProductGridPageProps {
  title: string;
  breadcrumb: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
  emptyMessage: string;
  showSort?: boolean;
}

const ProductGridPage = ({
  title,
  breadcrumb,
  products,
  emptyMessage,
  showSort = true,
}: ProductGridPageProps) => {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-5 pt-5 md:pt-8">
      <nav aria-label="Navegação estrutural">
        <ol className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
          <li>
            <Link href="/" className="hover:text-foreground">
              Início
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRightIcon className="size-3" />
          </li>
          <li className="text-foreground" aria-current="page">
            {breadcrumb}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase md:text-6xl">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </p>
        </div>
        {showSort && products.length > 1 && (
          <Suspense>
            <ProductSort />
          </Suspense>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center">
          {emptyMessage}
        </p>
      ) : (
        <div className="bg-border -mx-5 grid grid-cols-2 gap-px border-y md:mx-0 md:grid-cols-3 md:border-x lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              className="bg-background"
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductGridPage;
