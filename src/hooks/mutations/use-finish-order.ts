import { useMutation } from "@tanstack/react-query";

import { finishOrder } from "@/actions/finish-order";

export const getUseFinishOrderMutationKey = () => ["finish-order"] as const;

export const useFinishOrder = () => {
  return useMutation({
    mutationKey: getUseFinishOrderMutationKey(),
    mutationFn: () => finishOrder(),
  });
};
