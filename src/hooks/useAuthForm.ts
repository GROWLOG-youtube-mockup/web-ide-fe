import { zodResolver } from "@hookform/resolvers/zod"
import { type FieldValues, useForm } from "react-hook-form"
import type { ZodSchema } from "zod"

//인증 관련 폼에서 사용하는 공통 훅

export function useAuthForm<T extends FieldValues>(
  schema: ZodSchema<T>,
  defaultValues: T,
  mode: "onChange" | "onBlur" | "onSubmit" = "onBlur"
) {
  return useForm<T>({
    defaultValues,
    mode,
    resolver: zodResolver(schema),
  })
}
