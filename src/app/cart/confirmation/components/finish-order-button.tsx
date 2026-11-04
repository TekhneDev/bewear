"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCreateCheckoutSession } from "@/hooks/mutations/use-create-checkout-session";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const finishOrderMutation = useFinishOrder();
  const createCheckoutSessionMutation = useCreateCheckoutSession();
  const isProcessing =
    finishOrderMutation.isPending ||
    createCheckoutSessionMutation.isPending ||
    isRedirecting;

  const handleFinishOrder = async () => {
    try {
      const { orderId } = await finishOrderMutation.mutateAsync();
      const { url } = await createCheckoutSessionMutation.mutateAsync({
        orderId,
      });
      setIsRedirecting(true);
      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast.error("Erro ao finalizar a compra. Tente novamente.");
    }
  };

  return (
    <Button
      className="w-full rounded-full"
      size="lg"
      onClick={handleFinishOrder}
      disabled={isProcessing}
    >
      {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
      Finalizar compra
    </Button>
  );
};

export default FinishOrderButton;
