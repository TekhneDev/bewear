"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface SearchFormProps {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

const SearchForm = ({ className, autoFocus, onSubmitted }: SearchFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("q") ?? "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
    onSubmitted?.();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative", className)}
    >
      <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
      <Input
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Buscar produtos"
        aria-label="Buscar produtos"
        autoFocus={autoFocus}
        className="bg-muted h-10 rounded-full border-transparent pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden"
      />
      {term && (
        <button
          type="button"
          onClick={() => setTerm("")}
          aria-label="Limpar busca"
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </form>
  );
};

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <SearchForm className="hidden w-56 md:block xl:w-72" />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir busca"
          >
            <SearchIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="pb-6">
          <SheetHeader>
            <SheetTitle>Buscar</SheetTitle>
          </SheetHeader>
          <SearchForm
            className="px-4"
            autoFocus
            onSubmitted={() => setIsOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};
