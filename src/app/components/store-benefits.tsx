import { LockIcon, TruckIcon, ZapIcon } from "lucide-react";

const BENEFITS = [
  {
    icon: TruckIcon,
    title: "Frete grátis",
    description: "Em todos os pedidos, para todo o Brasil.",
  },
  {
    icon: LockIcon,
    title: "Pagamento seguro",
    description: "Checkout protegido e processado pela Stripe.",
  },
  {
    icon: ZapIcon,
    title: "Compra rápida",
    description: "Endereços salvos e login com Google.",
  },
];

const StoreBenefits = () => {
  return (
    <section className="bg-muted">
      <ul className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 md:py-10">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-start gap-4">
            <span className="bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-full">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="font-bold">{title}</p>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default StoreBenefits;
