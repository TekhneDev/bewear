"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  TruckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "./cart";

export const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const handleSignOut = async () => {
    await authClient.signOut();
    queryClient.clear();
    router.push("/");
    router.refresh();
  };
  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Abrir menu">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <>
                  <div className="flex justify-between space-y-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{session?.user?.name}</h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user?.email}
                        </span>
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
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button
                    size="icon"
                    asChild
                    variant="outline"
                    aria-label="Entrar"
                  >
                    <Link href="/authentication">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
              <Separator className="my-6" />
              <nav className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/">
                    <HomeIcon />
                    Início
                  </Link>
                </Button>
                {session?.user && (
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/my-orders">
                      <TruckIcon />
                      Meus pedidos
                    </Link>
                  </Button>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <Cart />
      </div>
    </header>
  );
};
