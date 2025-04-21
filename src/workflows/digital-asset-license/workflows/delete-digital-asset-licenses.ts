import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createDigitalAssetLicenseStep } from "../steps/create-digital-asset-license"
import { UpdateDigitalAssetLicenseInput } from "../types/digital-asset-license.types"
import { deleteDigitalAssetLicenseStep } from "../steps/delete-digital-asset-license"

export const deleteDigitalAssetLicenseWorkFlow = createWorkflow(
  "delete-digital-asset-license",
  (license_id: string) => {

    const deletedLicense = deleteDigitalAssetLicenseStep(license_id)

    return new WorkflowResponse({
      deletedLicense,
    })
  }
)