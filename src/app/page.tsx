import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { getCategoriesWithCover } from "@/data/categories";
import { getBestSellingProducts, getNewestProducts } from "@/data/products";

import HeroBanners from "./components/hero-banners";
import StoreBenefits from "./components/store-benefits";

export const dynamic = "force-dynamic";

const Home = async () => {
  const [bestSellingProducts, newestProducts, categories] = await Promise.all([
    getBestSellingProducts(),
    getNewestProducts(),
    getCategoriesWithCover(),
  ]);

  const getCategoryHref = (keyword: string) => {
    const category = categories.find((item) =>
      item.name.toLowerCase().includes(keyword),
    );
    return category ? `/category/${category.slug}` : "#novidades";
  };

  const banners = [
    {
      src: "/banner-01.png",
      alt: "Leve uma vida com estilo. Comprar jaquetas e moletons",
      href: getCategoryHref("jaquetas"),
    },
    {
      src: "/banner-02.png",
      alt: "Seja autêntico. Comprar novidades",
      href: "#novidades",
    },
  ];

  return (
    <>
      <Header />
      <main className="space-y-12 pt-5 md:space-y-16 md:pt-8">
        <HeroBanners banners={banners} />
        <ProductList title="Mais vendidos" products={bestSellingProducts} />
        <CategorySelector categories={categories} />
        <ProductList
          id="novidades"
          title="Novidades"
          badge="Novo"
          products={newestProducts}
        />
        <StoreBenefits />
      </main>
      <Footer />
    </>
  );
};

export default Home;
