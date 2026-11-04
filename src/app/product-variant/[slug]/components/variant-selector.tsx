import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({
  selectedVariantSlug,
  variants,
}: VariantSelectorProps) => {
  const selectedVariant = variants.find(
    (variant) => variant.slug === selectedVariantSlug,
  );
  return (
    <div className="space-y-3">
      <p className="text-sm">
        <span className="font-bold">Cor:</span>{" "}
        <span className="text-muted-foreground">{selectedVariant?.color}</span>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {variants.map((variant) => {
          const isSelected = variant.slug === selectedVariantSlug;
          return (
            <Link
              href={`/product-variant/${variant.slug}`}
              key={variant.id}
              scroll={false}
              aria-label={`Cor ${variant.color}`}
              aria-current={isSelected ? "true" : undefined}
              title={variant.color}
              className={cn(
                "bg-muted relative size-16 overflow-hidden rounded-xl ring-offset-2 transition md:size-20",
                isSelected
                  ? "ring-foreground ring-2"
                  : "hover:ring-muted-foreground/40 hover:ring-2",
              )}
            >
              <Image
                fill
                sizes="80px"
                src={variant.imageUrl}
                alt=""
                className="object-cover"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
