import Image from "next/image";
import Link from "next/link";

import { getCategories } from "@/data/categories";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import BackToTopButton from "./back-to-top-button";

const Footer = async () => {
  const categories = await getCategories();
  const sections = [
    {
      title: "Categorias",
      links: categories.map((category) => ({
        label: category.name,
        href: `/category/${category.slug}`,
      })),
    },
    {
      title: "Minha conta",
      links: [
        { label: "Entrar ou criar conta", href: "/authentication" },
        { label: "Meus pedidos", href: "/my-orders" },
        { label: "Minha sacola", href: "/cart/identification" },
      ],
    },
  ];

  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <div className="space-y-4">
            <Image
              src="/logo.svg"
              alt="BEWEAR"
              width={110}
              height={29}
              className="invert"
            />
            <p className="text-background/70 max-w-sm text-sm">
              Roupas, tênis e acessórios para quem leva uma vida com estilo.
              Frete grátis e pagamento seguro em todos os pedidos.
            </p>
          </div>

          <Accordion type="multiple" className="md:hidden">
            {sections.map((section) => (
              <AccordionItem
                key={section.title}
                value={section.title}
                className="border-background/15"
              >
                <AccordionTrigger className="text-sm font-bold tracking-wider uppercase hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-background/70 hover:text-background text-sm transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {sections.map((section) => (
            <div key={section.title} className="hidden space-y-4 md:block">
              <p className="text-sm font-bold tracking-wider uppercase">
                {section.title}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-background/70 hover:text-background text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-background/15 mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium">
              © {new Date().getFullYear()} BEWEAR
            </p>
            <p className="text-background/60 text-xs">
              Todos os direitos reservados.
            </p>
          </div>
          <BackToTopButton />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
