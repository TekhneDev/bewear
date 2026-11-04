import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { getCategoriesWithCover } from "@/data/categories";
import { getBestSellingProducts, getNewestProducts } from "@/data/products";

import EditorialPair from "./components/editorial-pair";
import HeroCarousel from "./components/hero-carousel";
import QuickLinks from "./components/quick-links";
import StoreBenefits from "./components/store-benefits";

export const dynamic = "force-dynamic";

const Home = async () => {
  const [bestSellingProducts, newestProducts, categories] = await Promise.all([
    getBestSellingProducts(),
    getNewestProducts(),
    getCategoriesWithCover(),
  ]);

  const findCategory = (keyword: string) =>
    categories.find((category) =>
      category.name.toLowerCase().includes(keyword),
    );
  const getCategoryHref = (keyword: string) => {
    const category = findCategory(keyword);
    return category ? `/category/${category.slug}` : "/#novidades";
  };

  const heroSlides = [
    {
      imageSrc: "/banner-01.png",
      imageAlt: "Modelo vestindo blusa fleece BEWEAR",
      eyebrow: "Coleção de inverno",
      title: "Feito para o frio",
      links: [
        { label: "Comprar jaquetas", href: getCategoryHref("jaquetas") },
        { label: "Ver novidades", href: "/#novidades" },
      ],
    },
    {
      imageSrc: "/banner-02.png",
      imageAlt: "Modelo vestindo jaqueta esportiva BEWEAR",
      eyebrow: "Novidades da semana",
      title: "Estilo que é só seu",
      links: [
        { label: "Comprar camisetas", href: getCategoryHref("camisetas") },
        { label: "Mais vendidos", href: "/#mais-vendidos" },
      ],
    },
  ];

  const editorialItems = ["jaquetas", "camisetas"]
    .map((keyword) => findCategory(keyword))
    .filter((category) => category !== undefined)
    .map((category) => ({
      title: category.name,
      imageUrl: category.coverImageUrl,
      href: `/category/${category.slug}`,
      linkLabel: "Comprar agora",
    }));

  return (
    <>
      <Header />
      <main>
        <HeroCarousel slides={heroSlides} />
        <QuickLinks
          links={categories.map((category) => ({
            label: category.name,
            href: `/category/${category.slug}`,
          }))}
        />
        <ProductList
          id="mais-vendidos"
          title="Mais vendidos"
          products={bestSellingProducts}
        />
        {editorialItems.length === 2 && (
          <EditorialPair items={editorialItems} />
        )}
        <ProductList
          id="novidades"
          title="Novidades"
          badge="Novo"
          products={newestProducts}
        />
        <div className="py-12 md:py-16">
          <CategorySelector categories={categories} />
        </div>
        <StoreBenefits />
      </main>
      <Footer />
    </>
  );
};

export default Home;
