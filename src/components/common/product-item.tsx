import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { cn } from "@/lib/utils";

import QuickAddButton from "./quick-add-button";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
  badge?: string;
  tone?: "light" | "dark";
  className?: string;
}

const ProductItem = ({
  product,
  badge,
  tone = "light",
  className,
}: ProductItemProps) => {
  const [firstVariant, secondVariant] = product.variants;
  if (!firstVariant) {
    return null;
  }
  const prices = product.variants.map((variant) => variant.priceInCents);
  const lowestPriceInCents = Math.min(...prices);
  const hasPriceRange = new Set(prices).size > 1;
  const colorsCount = product.variants.length;
  const isDark = tone === "dark";

  return (
    <div className={cn("group relative flex flex-col", className)}>
      <Link
        href={`/product-variant/${firstVariant.slug}`}
        className="flex flex-1 flex-col"
      >
        <div className="relative aspect-square overflow-hidden bg-[#f3f1ee]">
          <Image
            src={firstVariant.imageUrl}
            alt={`${product.name} ${firstVariant.color}`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className={cn(
              "object-cover mix-blend-multiply transition duration-500 group-hover:scale-105",
              secondVariant && "group-hover:opacity-0",
            )}
          />
          {secondVariant && (
            <Image
              src={secondVariant.imageUrl}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover opacity-0 mix-blend-multiply transition duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          )}
          {badge && (
            <span className="bg-foreground text-background absolute top-2 left-2 px-2 py-1 text-[10px] font-bold tracking-wider uppercase md:top-3 md:left-3">
              {badge}
            </span>
          )}
        </div>
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-0.5 px-3 pt-3 pb-4",
            isDark ? "text-background" : "text-foreground",
          )}
        >
          <p className="truncate text-sm font-bold group-hover:underline">
            {product.name}
          </p>
          <p className="text-sm">
            {hasPriceRange && (
              <span
                className={cn(
                  "mr-1 text-xs",
                  isDark ? "text-background/60" : "text-muted-foreground",
                )}
              >
                a partir de
              </span>
            )}
            {formatCentsToBRL(lowestPriceInCents)}
          </p>
          {colorsCount > 1 && (
            <p
              className={cn(
                "text-xs",
                isDark ? "text-background/60" : "text-muted-foreground",
              )}
            >
              {colorsCount} cores
            </p>
          )}
        </div>
      </Link>
      <QuickAddButton
        productVariantId={firstVariant.id}
        productLabel={`${product.name} ${firstVariant.color}`}
      />
    </div>
  );
};

export default ProductItem;
