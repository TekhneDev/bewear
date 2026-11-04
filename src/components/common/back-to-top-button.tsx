"use client";

import { ArrowUpIcon } from "lucide-react";

const BackToTopButton = () => {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="border-background/30 hover:bg-background hover:text-foreground flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors"
    >
      <ArrowUpIcon className="size-4" />
      Voltar ao topo
    </button>
  );
};

export default BackToTopButton;
