import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategorySelectorProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    coverImageUrl: string | null;
  }[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 px-5">
      <h2 className="font-display text-3xl uppercase md:text-4xl">
        Compre por categoria
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group relative aspect-[4/5] overflow-hidden bg-[#f3f1ee]"
          >
            {category.coverImageUrl && (
              <Image
                src={category.coverImageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover mix-blend-multiply transition duration-500 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 md:p-4">
              <span className="text-sm leading-tight font-bold text-white md:text-base">
                {category.name}
              </span>
              <span className="bg-background text-foreground group-hover:bg-primary group-hover:text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full transition-colors">
                <ArrowUpRightIcon className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySelector;
