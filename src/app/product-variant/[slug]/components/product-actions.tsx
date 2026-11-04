"use client";

import { Loader2, MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAddProductToCart } from "@/hooks/mutations/use-add-product-to-cart";
import { authClient } from "@/lib/auth-client";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [pendingAction, setPendingAction] = useState<"add" | "buy" | null>(
    null,
  );
  const addProductToCartMutation = useAddProductToCart(productVariantId);

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(MIN_QUANTITY, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(MAX_QUANTITY, prev + 1));
  };

  const addToCart = async (action: "add" | "buy") => {
    if (!session?.user) {
      toast.info("Faça login para adicionar produtos à sacola.");
      router.push("/authentication");
      return false;
    }
    setPendingAction(action);
    try {
      await addProductToCartMutation.mutateAsync(quantity);
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar produto à sacola.");
      return false;
    } finally {
      setPendingAction(null);
    }
  };

  const handleAddToCart = async () => {
    if (await addToCart("add")) {
      toast.success("Produto adicionado à sacola.");
    }
  };

  const handleBuyNow = async () => {
    if (await addToCart("buy")) {
      router.push("/cart/identification");
    }
  };

  const isPending = addProductToCartMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-bold">Quantidade</p>
        <div className="flex w-32 items-center justify-between rounded-full border">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={handleDecrement}
            disabled={quantity <= MIN_QUANTITY}
            aria-label="Diminuir quantidade"
          >
            <MinusIcon />
          </Button>
          <p className="font-semibold tabular-nums" aria-live="polite">
            {quantity}
          </p>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={handleIncrement}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="Aumentar quantidade"
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/85 fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur md:static md:flex-col md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <Button
          className="h-12 flex-1 rounded-full text-sm font-bold md:flex-none"
          size="lg"
          variant="outline"
          disabled={isPending}
          onClick={handleAddToCart}
        >
          {pendingAction === "add" ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ShoppingBagIcon />
          )}
          Adicionar à sacola
        </Button>
        <Button
          className="h-12 flex-1 rounded-full text-sm font-bold md:flex-none"
          size="lg"
          disabled={isPending}
          onClick={handleBuyNow}
        >
          {pendingAction === "buy" && <Loader2 className="animate-spin" />}
          Comprar agora
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;
