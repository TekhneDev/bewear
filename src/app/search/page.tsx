import type { Metadata } from "next";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductGridPage from "@/components/common/product-grid-page";
import { parseProductSort } from "@/data/product-sort";
import { searchProducts, sortProducts } from "@/data/products";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; ordem?: string }>;
}

export const generateMetadata = async ({
  searchParams,
}: SearchPageProps): Promise<Metadata> => {
  const { q } = await searchParams;
  return { title: q ? `Busca: ${q} | BEWEAR` : "Busca | BEWEAR" };
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { q, ordem } = await searchParams;
  const term = q?.trim() ?? "";
  const products = term ? await searchProducts(term) : [];
  return (
    <>
      <Header />
      <ProductGridPage
        title={term ? `“${term}”` : "Busca"}
        breadcrumb="Busca"
        products={sortProducts(products, parseProductSort(ordem))}
        emptyMessage={
          term
            ? `Nenhum produto encontrado para “${term}”. Tente outro termo.`
            : "Digite algo na busca para encontrar produtos."
        }
      />
      <Footer />
    </>
  );
};

export default SearchPage;
