export const productSortOptions = [
  { value: "relevancia", label: "Relevância" },
  { value: "novidades", label: "Novidades" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
] as const;

export type ProductSortOption = (typeof productSortOptions)[number]["value"];

export const parseProductSort = (value?: string): ProductSortOption =>
  productSortOptions.find((option) => option.value === value)?.value ??
  "relevancia";
