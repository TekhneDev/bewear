"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState(searchParams.get("q") ?? "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir busca">
          <SearchIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="pb-8">
        <SheetHeader className="mx-auto w-full max-w-3xl">
          <SheetTitle>Buscar</SheetTitle>
        </SheetHeader>
        <form
          role="search"
          onSubmit={handleSubmit}
          className="relative mx-auto w-full max-w-3xl px-4"
        >
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-8 size-5 -translate-y-1/2" />
          <Input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="O que você está procurando?"
            aria-label="Buscar produtos"
            autoFocus
            className="h-14 rounded-none border-0 border-b-2 pr-12 pl-12 text-lg shadow-none focus-visible:ring-0 md:text-xl [&::-webkit-search-cancel-button]:hidden"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              aria-label="Limpar busca"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-8 -translate-y-1/2"
            >
              <XIcon className="size-5" />
            </button>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
};
