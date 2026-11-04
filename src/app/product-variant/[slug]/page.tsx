import { and, eq, ne } from "drizzle-orm";
import { ChevronRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const getProductVariant = (slug: string) =>
  db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          category: true,
          variants: true,
        },
      },
    },
  });

export const generateMetadata = async ({
  params,
}: ProductVariantPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const productVariant = await getProductVariant(slug);
  if (!productVariant) {
    return { title: "Produto não encontrado | BEWEAR" };
  }
  return {
    title: `${productVariant.product.name} ${productVariant.color} | BEWEAR`,
    description: productVariant.product.description,
    openGraph: { images: [productVariant.imageUrl] },
  };
};

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const productVariant = await getProductVariant(slug);
  if (!productVariant) {
    return notFound();
  }
  const { product } = productVariant;
  const likelyProducts = await db.query.productTable.findMany({
    where: and(
      eq(productTable.categoryId, product.categoryId),
      ne(productTable.id, product.id),
    ),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />
      <main className="pb-28 md:pb-0">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-10 md:px-5 md:pt-8 lg:gap-16">
          <div className="bg-muted relative aspect-square overflow-hidden md:sticky md:top-20 md:self-start">
            <Image
              src={productVariant.imageUrl}
              alt={`${product.name} ${productVariant.color}`}
              fill
              priority
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6 px-5 md:px-0">
            <nav aria-label="Navegação estrutural">
              <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs font-medium">
                <li>
                  <Link href="/" className="hover:text-foreground">
                    Início
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRightIcon className="size-3" />
                </li>
                <li>
                  <Link
                    href={`/category/${product.category.slug}`}
                    className="hover:text-foreground"
                  >
                    {product.category.name}
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRightIcon className="size-3" />
                </li>
                <li className="text-foreground" aria-current="page">
                  {product.name}
                </li>
              </ol>
            </nav>

            <div className="space-y-2">
              <h1 className="font-display text-4xl uppercase md:text-5xl">
                {product.name}
              </h1>
              <p className="text-2xl font-bold">
                {formatCentsToBRL(productVariant.priceInCents)}
              </p>
            </div>

            <VariantSelector
              selectedVariantSlug={productVariant.slug}
              variants={product.variants}
            />

            <ProductActions productVariantId={productVariant.id} />

            <Accordion
              type="multiple"
              defaultValue={["descricao"]}
              className="border-t"
            >
              <AccordionItem value="descricao">
                <AccordionTrigger className="text-sm font-bold tracking-wider uppercase hover:no-underline">
                  Descrição
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="entrega">
                <AccordionTrigger className="text-sm font-bold tracking-wider uppercase hover:no-underline">
                  Entrega
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Frete grátis para todo o Brasil. Você cadastra o endereço de
                  entrega na finalização da compra e acompanha o pedido em Meus
                  pedidos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pagamento">
                <AccordionTrigger className="text-sm font-bold tracking-wider uppercase hover:no-underline">
                  Pagamento
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Pagamento com cartão de crédito em ambiente seguro, processado
                  pela Stripe. Seu pedido é confirmado assim que o pagamento é
                  aprovado.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <ProductList title="Talvez você goste" products={likelyProducts} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductVariantPage;
