import { z } from "zod";

export const CreateDigitalAssetSchema = z
  .object({
    name: z.string().min(1),
  })
  .strict();

export const UpdateDigitalAssetSchema = z
  .object({
    name: z.string().optional(),
  })
  .strict();

export const DeleteBatchDigitalAssetSchema = z.object({
  ids: z.array(z.string()),
});

export const RestoreDigitalAssetSchema = DeleteBatchDigitalAssetSchema;

export type CreateDigitalAssetType = z.infer<typeof CreateDigitalAssetSchema>;
export type UpdateDigitalAssetType = z.infer<typeof UpdateDigitalAssetSchema>;
export type DeleteBatchDigitalAssetType = z.infer<typeof DeleteBatchDigitalAssetSchema>;
export type RestoreDigitalAssetType = z.infer<typeof RestoreDigitalAssetSchema>;
