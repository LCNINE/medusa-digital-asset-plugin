import { z } from "zod"

export const CreateDigitalAssetSchema = z.object({
  type: z.enum(["digital-asset", "digital-asset-thumbnail"]),
  mimeType: z.string().min(1),
  base64Content: z.string().min(1),
  name: z.string().min(1),
  fileId: z.string(),
  file_url: z.string(),
  description: z.string(),
  thumbnail_url: z.string(),
  file_key: z.string(),
  file: z.any(),
}).strict()

export const UpdateDigitalAssetSchema = z.object({
  fileId: z.string().min(1),
  type: z.enum(["digital-asset", "digital-asset-thumbnail"]),
  mimeType: z.string().min(1),
  base64Content: z.string().min(1),
}).strict()

export type CreateDigitalAssetType = z.infer<typeof CreateDigitalAssetSchema>;
export type UpdateDigitalAssetType = z.infer<typeof UpdateDigitalAssetSchema>; 