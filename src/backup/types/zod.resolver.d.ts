import type { FieldValues, Resolver } from "react-hook-form"
import type { z } from "zod"

declare module "@hookform/resolvers/zod" {
  export function zodResolver<T extends FieldValues>(schema: z.ZodSchema<T>): Resolver<T>
}
