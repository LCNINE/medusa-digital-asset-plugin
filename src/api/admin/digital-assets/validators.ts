import { z } from "zod";

export const CreateDigitalAssetSchema = z
  .object({
    name: z.string().min(1),
  })
  .strict();

export const UpdateDigitalAssetSchema = z
  .object({
    name: z.string().min(1),
  })
  .strict();

export type CreateDigitalAssetType = z.infer<typeof CreateDigitalAssetSchema>;
export type UpdateDigitalAssetType = z.infer<typeof UpdateDigitalAssetSchema>;
