"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronRightIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  TruckIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface HeaderMenuProps {
  categories: { id: string; name: string; slug: string }[];
}

const getInitials = (name?: string | null) =>
  (name ?? "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const HeaderMenu = ({ categories }: HeaderMenuProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    queryClient.clear();
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full gap-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <div className="px-4 pb-6">
            {session?.user ? (
              <div className="bg-muted flex items-center justify-between gap-3 rounded-2xl p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar>
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback>
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {session.user.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSignOut}
                  aria-label="Sair"
                >
                  <LogOutIcon />
                </Button>
              </div>
            ) : (
              <div className="bg-muted space-y-3 rounded-2xl p-4">
                <p className="font-semibold">Olá. Faça seu login!</p>
                <p className="text-muted-foreground text-sm">
                  Acompanhe seus pedidos e finalize compras mais rápido.
                </p>
                <Button className="w-full rounded-full" asChild>
                  <Link href="/authentication" onClick={closeMenu}>
                    <LogInIcon />
                    Entrar ou criar conta
                  </Link>
                </Button>
              </div>
            )}

            <nav className="mt-6 flex flex-col gap-1">
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/" onClick={closeMenu}>
                  <HomeIcon />
                  Início
                </Link>
              </Button>
              {session?.user && (
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/my-orders" onClick={closeMenu}>
                    <TruckIcon />
                    Meus pedidos
                  </Link>
                </Button>
              )}
            </nav>

            <Separator className="my-6" />

            <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
              Categorias
            </p>
            <nav className="flex flex-col">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  onClick={closeMenu}
                  className="hover:bg-muted flex items-center justify-between rounded-lg px-3 py-3 text-base font-semibold transition-colors"
                >
                  {category.name}
                  <ChevronRightIcon className="text-muted-foreground size-4" />
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
