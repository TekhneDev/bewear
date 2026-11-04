"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const SLIDE_DURATION_IN_MS = 6000;

interface HeroSlide {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  links: { label: string; href: string }[];
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const HeroCarousel = ({ slides }: HeroCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || slides.length < 2) {
      return;
    }
    const timeout = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION_IN_MS);
    return () => clearTimeout(timeout);
  }, [activeIndex, isPlaying, slides.length]);

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="bg-foreground text-background relative"
    >
      <div className="grid">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.imageSrc}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slides.length}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={cn(
                "grid items-end gap-6 transition-opacity duration-700 [grid-area:1/1] md:min-h-[min(80vh,760px)] md:grid-cols-2 md:gap-10",
                isActive ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <div className="order-2 space-y-3 px-5 pb-16 md:order-1 md:px-10 md:pb-20 lg:px-16">
                <p className="text-background/70 text-sm font-semibold tracking-[0.2em] uppercase">
                  {slide.eyebrow}
                </p>
                <h2 className="font-display text-5xl leading-[0.95] uppercase md:text-7xl lg:text-8xl">
                  {slide.title}
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                  {slide.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="decoration-background/60 hover:decoration-background text-base font-bold underline decoration-2 underline-offset-[6px] transition-colors md:text-lg"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="relative order-1 flex justify-center self-stretch px-5 pt-6 md:order-2 md:items-center md:px-10 md:py-10">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  width={730}
                  height={920}
                  priority={index === 0}
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="h-auto max-h-[44vh] w-auto object-contain md:max-h-[min(70vh,680px)]"
                />
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-3 px-5">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={slide.imageSrc}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ir para o destaque ${index + 1}`}
                  aria-current={isActive}
                  className={cn(
                    "bg-background/40 relative h-1.5 overflow-hidden rounded-full transition-all duration-300",
                    isActive ? "w-10" : "hover:bg-background/70 w-1.5",
                  )}
                >
                  {isActive && (
                    <span
                      key={`${activeIndex}-${isPlaying}`}
                      style={
                        {
                          "--progress-duration": `${SLIDE_DURATION_IN_MS}ms`,
                        } as React.CSSProperties
                      }
                      className={cn(
                        "bg-background absolute inset-0 origin-left",
                        isPlaying ? "animate-progress" : "scale-x-100",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setIsPlaying((current) => !current)}
            aria-label={isPlaying ? "Pausar destaques" : "Reproduzir destaques"}
            className="bg-background/20 hover:bg-background/35 absolute right-5 flex size-9 items-center justify-center rounded-full backdrop-blur transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="size-4" />
            ) : (
              <PlayIcon className="size-4" />
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
