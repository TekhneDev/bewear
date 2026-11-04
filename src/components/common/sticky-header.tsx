"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD_IN_PX = 120;

interface StickyHeaderProps {
  children: React.ReactNode;
}

const StickyHeader = ({ children }: StickyHeaderProps) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      setIsScrolled(currentScrollY > 0);
      setIsHidden(isScrollingDown && currentScrollY > SCROLL_THRESHOLD_IN_PX);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur transition-[transform,box-shadow] duration-300",
        isHidden && "-translate-y-full",
        isScrolled && "shadow-sm",
      )}
    >
      {children}
    </header>
  );
};

export default StickyHeader;
