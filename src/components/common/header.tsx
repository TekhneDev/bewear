import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { getCategories } from "@/data/categories";

import AccountButton from "./account-button";
import AnnouncementBar from "./announcement-bar";
import { Cart } from "./cart";
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
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center px-2 md:h-16 md:px-4">
          <div className="flex items-center">
            <HeaderMenu categories={categories} />
          </div>
          <Link href="/" aria-label="BEWEAR, página inicial">
            <Image
              src="/logo.svg"
              alt="BEWEAR"
              width={100}
              height={26}
              priority
            />
          </Link>
          <div className="flex items-center justify-end gap-0.5">
            <AccountButton />
            <Suspense>
              <SearchBar />
            </Suspense>
            <Cart />
          </div>
        </div>
      </StickyHeader>
    </>
  );
};
