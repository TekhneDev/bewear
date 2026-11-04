"use client";

import { UserIcon } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import { Button } from "../ui/button";

const AccountButton = () => {
  const { data: session } = authClient.useSession();
  const isSignedIn = Boolean(session?.user);
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link
        href={isSignedIn ? "/my-orders" : "/authentication"}
        aria-label={isSignedIn ? "Minha conta" : "Entrar"}
      >
        <UserIcon />
      </Link>
    </Button>
  );
};

export default AccountButton;
