import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { getCategories } from "@/data/categories";

import AnnouncementBar from "./announcement-bar";
import { Cart } from "./cart";
import CategoryNav from "./category-nav";
import { HeaderMenu } from "./header-menu";
import { SearchBar } from "./search-bar";
import StickyHeader from "./sticky-header";

export const Header = async () => {
  await connection();
  const categories = await getCategories();
  return (
    <>
      <AnnouncementBar />
      <StickyHeader>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 border-b px-5 lg:h-20">
          <Link
            href="/"
            className="shrink-0"
            aria-label="BEWEAR, página inicial"
          >
            <Image
              src="/logo.svg"
              alt="BEWEAR"
              width={100}
              height={26}
              priority
            />
          </Link>

          <CategoryNav categories={categories} />

          <div className="flex items-center gap-1">
            <Suspense>
              <SearchBar />
            </Suspense>
            <HeaderMenu categories={categories} />
            <Cart />
          </div>
        </div>
      </StickyHeader>
    </>
  );
};
