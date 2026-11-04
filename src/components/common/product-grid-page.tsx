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
          <h1 className="text-3xl font-extrabold tracking-tight uppercase md:text-4xl">
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductGridPage;
