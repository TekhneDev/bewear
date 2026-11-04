export const calculateCartTotalInCents = (
  items: Array<{ quantity: number; productVariant: { priceInCents: number } }>,
) =>
  items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
