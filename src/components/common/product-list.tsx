"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { productTable, productVariantTable } from "@/db/schema";

import ProductItem from "./product-item";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
  badge?: string;
  viewAllHref?: string;
  id?: string;
}

const ProductList = ({
  title,
  products,
  badge,
  viewAllHref,
  id,
}: ProductListProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    setCanScrollPrevious(scroller.scrollLeft > 4);
    setCanScrollNext(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, products]);

  const scrollByPage = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section id={id} className="bg-foreground scroll-mt-16">
      <div className="text-background flex items-center justify-between gap-4 px-4 py-4 md:px-5">
        <h2 className="font-display text-3xl uppercase md:text-4xl">{title}</h2>
        <div className="flex items-center gap-1">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="mr-2 text-sm font-bold underline decoration-2 underline-offset-4"
            >
              Ver tudo
            </Link>
          )}
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrevious}
            aria-label={`Ver produtos anteriores de ${title}`}
            className="hover:bg-background/10 flex size-10 items-center justify-center rounded-full transition disabled:opacity-0"
          >
            <ChevronLeftIcon className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            aria-label={`Ver mais produtos de ${title}`}
            className="hover:bg-background/10 flex size-10 items-center justify-center rounded-full transition disabled:opacity-0"
          >
            <ChevronRightIcon className="size-6" />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            badge={badge}
            tone="dark"
            className="border-foreground w-[72%] shrink-0 snap-start border-r-4 sm:w-[45%] lg:w-[30%] xl:w-[25%]"
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
