// src/workflows/digital-asset-license/workflows/create-digital-asset-licenses.ts
import { CreateDigitalAssetLicenseType } from "../../../api/admin/digital-asset-licenses/validators";
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createDigitalAssetLicenseStep } from "../steps/create-digital-asset-license";

export const createDigitalAssetLicenseWorkFlow = createWorkflow(
  "create-digital-asset-license",
  (input: CreateDigitalAssetLicenseType) => {
    const createdAsset = createDigitalAssetLicenseStep(input);

    return new WorkflowResponse({
      createdAsset,
    });
  },
);
