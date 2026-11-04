"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { parseProductSort, productSortOptions } from "@/data/product-sort";
import { cn } from "@/lib/utils";

const ProductSort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSort = parseProductSort(searchParams.get("ordem") ?? undefined);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevancia") {
      params.delete("ordem");
    } else {
      params.set("ordem", value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div
      role="radiogroup"
      aria-label="Ordenar produtos"
      className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {productSortOptions.map((option) => {
        const isActive = option.value === activeSort;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => handleSortChange(option.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
              isActive
                ? "bg-foreground text-background border-foreground"
                : "hover:border-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default ProductSort;
