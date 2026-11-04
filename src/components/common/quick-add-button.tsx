"use client";

import { CheckIcon, Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useAddProductToCart } from "@/hooks/mutations/use-add-product-to-cart";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const SUCCESS_FEEDBACK_IN_MS = 1500;

interface QuickAddButtonProps {
  productVariantId: string;
  productLabel: string;
}

const QuickAddButton = ({
  productVariantId,
  productLabel,
}: QuickAddButtonProps) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const addProductToCartMutation = useAddProductToCart(productVariantId);
  const [hasJustAdded, setHasJustAdded] = useState(false);

  const handleClick = async () => {
    if (!session?.user) {
      toast.info("Faça login para adicionar produtos à sacola.");
      router.push("/authentication");
      return;
    }
    try {
      await addProductToCartMutation.mutateAsync(1);
      toast.success(`${productLabel} adicionado à sacola.`);
      setHasJustAdded(true);
      setTimeout(() => setHasJustAdded(false), SUCCESS_FEEDBACK_IN_MS);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar produto à sacola.");
    }
  };

  const isPending = addProductToCartMutation.isPending;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Adicionar ${productLabel} à sacola`}
      className={cn(
        "absolute top-2 right-2 z-10 flex size-9 items-center justify-center rounded-full transition md:top-3 md:right-3",
        "bg-background/85 text-foreground hover:bg-foreground hover:text-background backdrop-blur",
        "md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
        (isPending || hasJustAdded) && "md:opacity-100",
      )}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : hasJustAdded ? (
        <CheckIcon className="size-4" />
      ) : (
        <PlusIcon className="size-5" />
      )}
    </button>
  );
};

export default QuickAddButton;
