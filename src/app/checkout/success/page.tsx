import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Header } from "@/components/common/header";
import StatusDialog from "@/components/common/status-dialog";
import { markOrderAsPaid } from "@/data/order";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

import InvalidateCart from "./components/invalidate-cart";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

const getPaidOrderId = async (checkoutSessionId: string, userId: string) => {
  try {
    const checkoutSession =
      await getStripe().checkout.sessions.retrieve(checkoutSessionId);
    const orderId = checkoutSession.metadata?.orderId;
    if (!orderId || checkoutSession.payment_status !== "paid") {
      return null;
    }
    const order = await db.query.orderTable.findFirst({
      where: (order, { and, eq }) =>
        and(eq(order.id, orderId), eq(order.userId, userId)),
      columns: { id: true },
    });
    return order?.id ?? null;
  } catch {
    return null;
  }
};

const CheckoutSuccessPage = async ({
  searchParams,
}: CheckoutSuccessPageProps) => {
  const { session_id: checkoutSessionId } = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!checkoutSessionId) {
    redirect("/");
  }
  const orderId = await getPaidOrderId(checkoutSessionId, session.user.id);
  if (!orderId) {
    redirect("/my-orders");
  }
  await markOrderAsPaid(orderId);
  return (
    <>
      <Header />
      <InvalidateCart />
      <StatusDialog
        title="Pedido efetuado!"
        description="Seu pedido foi efetuado com sucesso. Você pode acompanhar o status na seção de “Meus Pedidos”."
        primaryAction={{ label: "Ver meus pedidos", href: "/my-orders" }}
        secondaryAction={{ label: "Voltar para a loja", href: "/" }}
      />
    </>
  );
};

export default CheckoutSuccessPage;
