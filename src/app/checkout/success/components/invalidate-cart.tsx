"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { getUseCartQueryKey } from "@/hooks/queries/use-cart";

const InvalidateCart = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
  }, [queryClient]);
  return null;
};

export default InvalidateCart;
