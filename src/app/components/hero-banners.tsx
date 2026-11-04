import Image from "next/image";
import Link from "next/link";

interface HeroBannersProps {
  banners: { src: string; alt: string; href: string }[];
}

const HeroBanners = ({ banners }: HeroBannersProps) => {
  return (
    <section
      aria-label="Destaques"
      className="mx-auto w-full max-w-7xl md:px-5"
    >
      <div className="flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {banners.map((banner, index) => (
          <Link
            key={banner.src}
            href={banner.href}
            className="group relative w-[88%] shrink-0 snap-center overflow-hidden rounded-3xl md:w-auto"
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              width={730}
              height={920}
              priority={index === 0}
              sizes="(min-width: 1280px) 620px, (min-width: 768px) 50vw, 88vw"
              className="h-auto w-full transition duration-700 group-hover:scale-[1.03]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HeroBanners;
