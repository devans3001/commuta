// src/hooks/useLogin.ts
import { login } from "@/services/apiAuth";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    mutationKey: ["login"],
  });

  return { mutate, isPending, error };
}
