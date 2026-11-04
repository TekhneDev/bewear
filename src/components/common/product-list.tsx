"use client";

import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { productTable, productVariantTable } from "@/db/schema";

import { Button } from "../ui/button";
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
    <section
      id={id}
      className="mx-auto w-full max-w-7xl scroll-mt-24 space-y-5"
    >
      <div className="flex items-end justify-between gap-4 px-5">
        <h2 className="text-xl font-extrabold tracking-tight uppercase md:text-2xl">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hover:text-primary flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline"
            >
              Ver tudo
              <ArrowRightIcon className="size-4" />
            </Link>
          )}
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollByPage(-1)}
              disabled={!canScrollPrevious}
              aria-label={`Ver produtos anteriores de ${title}`}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollByPage(1)}
              disabled={!canScrollNext}
              aria-label={`Ver mais produtos de ${title}`}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            badge={badge}
            className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[23%] xl:w-[18.5%]"
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
