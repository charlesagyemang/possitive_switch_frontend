import { useMutation, useQuery } from "@tanstack/react-query";

export const useGenericMutation = (
  mutationKey: string[],
  mutationFn: (d: any) => Promise<any>
) => {
  const obj = useMutation({
    mutationFn,
    mutationKey,
  });

  // return { ...obj, run: obj.mutate };
  return {
    ...obj,
    run: (variables: any, options?: Parameters<typeof obj.mutate>[1]) =>
      obj.mutate(variables, options),
  };
};

export const useGenericQuery = (
  queryKey: string[],
  queryFn: (d: any) => Promise<any>,
  options?: Record<string, any>
) => {
  const obj = useQuery({
    queryKey,
    queryFn,
    refetchOnMount: false,
    refetchOnWindowFocus:false,
    ...options,
  });

  return { ...obj };
};




