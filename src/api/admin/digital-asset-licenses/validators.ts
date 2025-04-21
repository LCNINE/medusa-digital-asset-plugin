import { z } from "zod"

export const CreateDigitalAssetLicenseSchema = z.object({
  digital_asset_id: z.string().min(1),
  customer_id: z.string().min(1),
  order_item_id: z.string().min(1),
}).strict()

export const UpdateDigitalAssetLicenseSchema = z.object({
  id: z.string(),
  digital_asset_id: z.string(),
  customer_id: z.string(),
  order_item_id: z.string(),
  is_exercised: z.boolean().optional(),
}).strict()


export type CreateDigitalAssetLicenseType = z.infer<typeof CreateDigitalAssetLicenseSchema>;
export type UpdateDigitalAssetLicenseType = z.infer<typeof UpdateDigitalAssetLicenseSchema>; 