import Image from "next/image";
import Link from "next/link";

interface EditorialPairProps {
  items: {
    title: string;
    imageUrl: string | null;
    href: string;
    linkLabel: string;
  }[];
}

const EditorialPair = ({ items }: EditorialPairProps) => {
  return (
    <section className="grid md:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group bg-muted relative block aspect-[4/5] overflow-hidden md:aspect-square"
        >
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 text-white md:p-8">
            <h2 className="font-display text-4xl leading-none uppercase md:text-5xl lg:text-6xl">
              {item.title}
            </h2>
            <span className="inline-block text-base font-bold underline decoration-2 underline-offset-[6px] md:text-lg">
              {item.linkLabel}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default EditorialPair;
