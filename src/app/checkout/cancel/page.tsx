import { Header } from "@/components/common/header";
import StatusDialog from "@/components/common/status-dialog";

const CheckoutCancelPage = () => {
  return (
    <>
      <Header />
      <StatusDialog
        title="Pagamento não concluído"
        description="Seu pagamento foi cancelado e nenhuma cobrança foi feita. Os produtos continuam na sua sacola."
        primaryAction={{
          label: "Tentar novamente",
          href: "/cart/confirmation",
        }}
        secondaryAction={{ label: "Voltar para a loja", href: "/" }}
      />
    </>
  );
};

export default CheckoutCancelPage;
