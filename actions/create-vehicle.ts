"use server";

import { z } from "zod";
import { encodeFunctionData } from "viem";
import deployerABI from "@/abi/Deployer.json";
import vehicleLogicABI from "@/abi/VehicleLogic.json";

import { ownerClient, ownerAccount } from "@/utils/owner-client";
import { publicClient } from "@/utils/public-client";

const vinFormSchema = z.object({
  vin: z.string().min(2, { message: "Invalid VIN" }).max(50),
  address: z
    .string()
    .min(22, { message: "Invalid address" })
    .max(22, { message: "Invalid address" })
    .optional(),
});

export type VehicleResponse = {
  computeAddress?: string;
  status: "success" | "error";
  error?: string;
};

export async function createVehicle(
  values: z.infer<typeof vinFormSchema>
): Promise<VehicleResponse> {
  try {
    const client = publicClient;
    const computeAddress = (await client.readContract({
      address: process.env.NEXT_PUBLIC_DEPLOYER_CONTRACT as `0x${string}`,
      abi: deployerABI.abi,
      functionName: "computeProxyVehicleAddress",
      args: [values.vin],
    })) as string | undefined;

    console.log("computeAddress", computeAddress);

    if (!computeAddress) {
      return { status: "error", error: "Compute address not found" };
    }

    const bytecode = await client.getCode({
      address: computeAddress as `0x${string}`,
    });

    if (bytecode) {
      return {
        status: "error",
        computeAddress,
        error: "Vehicle contract already exist",
      };
    }

    const data = encodeFunctionData({
      abi: vehicleLogicABI.abi,
      functionName: "initialize",
      args: [
        ownerAccount.address,
        process.env.NEXT_PUBLIC_AUTHORIZATION_CONTRACT as `0x${string}`,
        "Vehicle",
        "VCL",
      ],
    });

    const createContract = await client.simulateContract({
      address: process.env.NEXT_PUBLIC_DEPLOYER_CONTRACT as `0x${string}`,
      abi: deployerABI.abi,
      functionName: "deployProxyVehicle",
      args: [data, values.vin],
      account: ownerAccount,
    });

    const hashCreateContract = await ownerClient.writeContract(
      createContract.request
    );

    const receiptCreateContract = await publicClient.waitForTransactionReceipt({
      hash: hashCreateContract,
    });

    const addressTo = values.address ? values.address : ownerAccount.address;

    console.log("addressTo", addressTo);

    const mintNFT = await client.simulateContract({
      address: computeAddress as `0x${string}`,
      abi: vehicleLogicABI.abi,
      functionName: "mint",
      args: [addressTo, values.vin],
      account: ownerAccount,
    });

    const hashMintNFT = await ownerClient.writeContract(mintNFT.request);

    const receiptMintNFT = await publicClient.waitForTransactionReceipt({
      hash: hashMintNFT,
    });

    return { computeAddress, status: "success", error: undefined };
  } catch (error) {
    console.error("Error:", error);
    return { status: "error", error: "Internal server error" };
  }
}
