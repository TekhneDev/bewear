export const toCartSummaryProducts = (
  items: Array<{
    quantity: number;
    productVariant: {
      id: string;
      name: string;
      priceInCents: number;
      imageUrl: string;
      product: { name: string };
    };
  }>,
) =>
  items.map((item) => ({
    id: item.productVariant.id,
    name: item.productVariant.product.name,
    variantName: item.productVariant.name,
    quantity: item.quantity,
    priceInCents: item.productVariant.priceInCents,
    imageUrl: item.productVariant.imageUrl,
  }));
