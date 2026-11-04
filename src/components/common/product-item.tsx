import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { cn } from "@/lib/utils";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
  badge?: string;
  className?: string;
}

const ProductItem = ({ product, badge, className }: ProductItemProps) => {
  const [firstVariant, secondVariant] = product.variants;
  if (!firstVariant) {
    return null;
  }
  const prices = product.variants.map((variant) => variant.priceInCents);
  const lowestPriceInCents = Math.min(...prices);
  const hasPriceRange = new Set(prices).size > 1;
  const colorsCount = product.variants.length;

  return (
    <Link
      href={`/product-variant/${firstVariant.slug}`}
      className={cn("group flex flex-col gap-3", className)}
    >
      <div className="bg-muted relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={firstVariant.imageUrl}
          alt={`${product.name} ${firstVariant.color}`}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
          className={cn(
            "object-cover transition duration-500 group-hover:scale-105",
            secondVariant && "group-hover:opacity-0",
          )}
        />
        {secondVariant && (
          <Image
            src={secondVariant.imageUrl}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
            className="object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        {badge && (
          <span className="bg-background text-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        {colorsCount > 1 && (
          <p className="text-muted-foreground text-xs font-medium">
            {colorsCount} cores
          </p>
        )}
        <p className="group-hover:text-primary truncate text-sm font-semibold transition-colors">
          {product.name}
        </p>
        <p className="text-muted-foreground line-clamp-1 text-xs">
          {product.description}
        </p>
        <p className="text-sm font-bold">
          {hasPriceRange && (
            <span className="text-muted-foreground mr-1 text-xs font-medium">
              a partir de
            </span>
          )}
          {formatCentsToBRL(lowestPriceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
