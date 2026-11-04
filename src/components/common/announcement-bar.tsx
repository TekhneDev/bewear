"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ANNOUNCEMENTS = [
  "Frete grátis em todos os pedidos",
  "Pagamento 100% seguro com Stripe",
  "Entre com sua conta Google em um clique",
];

const ROTATION_INTERVAL_IN_MS = 5000;

const AnnouncementBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % ANNOUNCEMENTS.length);
    }, ROTATION_INTERVAL_IN_MS);
    return () => clearInterval(interval);
  }, [isPaused]);

  const showPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length,
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <div
      className="bg-foreground text-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-2">
        <button
          type="button"
          onClick={showPrevious}
          aria-label="Aviso anterior"
          className="hover:bg-background/10 rounded-full p-1 transition-colors"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <div
          className="relative h-full flex-1 overflow-hidden"
          aria-live="polite"
        >
          {ANNOUNCEMENTS.map((announcement, index) => (
            <p
              key={announcement}
              aria-hidden={index !== activeIndex}
              className={`absolute inset-0 flex items-center justify-center text-center text-xs font-medium tracking-wide transition-all duration-500 ${
                index === activeIndex
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              {announcement}
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={showNext}
          aria-label="Próximo aviso"
          className="hover:bg-background/10 rounded-full p-1 transition-colors"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
