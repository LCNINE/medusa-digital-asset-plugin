import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { updateDigitalAssetLicenseStep } from "../steps/update-digital-asset-license";
import { UpdateDigitalAssetLicenseInput } from "../types/digital-asset-license.types";

export const updateDigitalAssetLicenseWorkFlow = createWorkflow(
  "update-digital-asset-license",
  (input: UpdateDigitalAssetLicenseInput) => {
    const updatedLicense = updateDigitalAssetLicenseStep({
      ...input,
    });

    return new WorkflowResponse({
      updatedLicense,
    });
  },
);
