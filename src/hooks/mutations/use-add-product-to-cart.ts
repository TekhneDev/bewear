import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getAddProductToCartMutationKey = (productVariantId: string) =>
  ["add-product-to-cart", productVariantId] as const;

export const useAddProductToCart = (productVariantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getAddProductToCartMutationKey(productVariantId),
    mutationFn: (quantity: number) =>
      addProductToCart({ productVariantId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
