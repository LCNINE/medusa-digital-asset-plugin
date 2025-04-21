import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { DIGITAL_ASSET } from "../../../modules/digital-asset"
import { createDigitalAssetLicenseWorkFlow } from "../../../workflows/digital-asset-license/workflows/create-digital-asset-licenses"
import { CreateDigitalAssetLicenseType, UpdateDigitalAssetLicenseType } from "./validators"
import { updateDigitalAssetLicenseWorkFlow } from "../../../workflows/digital-asset-license/workflows/update-digital-asset-licenses"
import { deleteDigitalAssetLicenseWorkFlow } from "../../../workflows/digital-asset-license/workflows/delete-digital-asset-licenses"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { license_id, customer_id, order_item_id } = req.query
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { data: licenses } = await query.graph({
      entity: "digital_asset_license",
      fields: ["id", "digital_asset_id", "customer_id", "order_item_id", "is_exercised", "created_at", "updated_at", "customer.*", "line_item.*"],
      filters: {
        ...(license_id && { id: license_id }),
        ...(customer_id && { customer_id }),
        ...(order_item_id && { order_item_id })
      }
    })

    return res.status(200).json({ licenses })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export async function POST(req: MedusaRequest<CreateDigitalAssetLicenseType>, res: MedusaResponse) {
  const input = req.validatedBody

  try {
    const { result } = await createDigitalAssetLicenseWorkFlow(req.scope).run({ input })

    return res.status(201).json({ license: result })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export async function PATCH(req: MedusaRequest<UpdateDigitalAssetLicenseType>, res: MedusaResponse) {
  const { license_id } = req.query
  const updateData = req.body

  try {
    if (!license_id) {
      throw new Error("required license_id")
    }

    const updatedLicense = await updateDigitalAssetLicenseWorkFlow(req.scope).run({ input: updateData })
    return res.status(200).json({ license: updatedLicense })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { license_id } = req.query

  try {
    if (!license_id) {
      throw new Error("required license_id")
    }

    await deleteDigitalAssetLicenseWorkFlow(req.scope).run({ input: license_id as string })
    return res.status(200).json({ success: true, message: "license deleted successfully" })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
