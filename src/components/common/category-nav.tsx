"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: { id: string; name: string; slug: string }[];
}

const CategoryNav = ({ categories }: CategoryNavProps) => {
  const pathname = usePathname();
  return (
    <nav aria-label="Categorias" className="hidden lg:block">
      <ul className="flex items-center gap-6">
        {categories.map((category) => {
          const href = `/category/${category.slug}`;
          const isActive = pathname === href;
          return (
            <li key={category.id}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "after:bg-primary relative py-2 text-sm font-semibold whitespace-nowrap transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform hover:after:scale-x-100",
                  isActive
                    ? "text-primary after:scale-x-100"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoryNav;
