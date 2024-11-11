"use server";

import { z } from "zod";
import { encodeFunctionData } from "viem";
import deployerABI from "@/abi/Deployer.json";
import batteryLogicABI from "@/abi/BatteryLogic.json";

import { ownerClient, ownerAccount } from "@/utils/owner-client";
import { publicClient } from "@/utils/public-client";

const batteryFormSchema = z.object({
  batteryId: z.string().min(2, { message: "Invalid VIN" }).max(50),
  address: z
    .string()
    .min(22, { message: "Invalid address" })
    .max(22, { message: "Invalid address" })
    .optional(),
  manufacturer: z.string(),
  batteryStatus: z.string(),
  productionDate: z.date(),
});

export type BatteryResponse = {
  computeAddress?: string;
  status: "success" | "error";
  error?: string;
};

export async function createBattery(
  values: z.infer<typeof batteryFormSchema>
): Promise<BatteryResponse> {
  try {
    const client = publicClient;
    const computeAddress = (await client.readContract({
      address: process.env.NEXT_PUBLIC_DEPLOYER_CONTRACT as `0x${string}`,
      abi: deployerABI.abi,
      functionName: "computeProxyBatteryAddress",
      args: [values.batteryId],
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
      abi: batteryLogicABI.abi,
      functionName: "initialize",
      args: [
        ownerAccount.address,
        process.env.NEXT_PUBLIC_AUTHORIZATION_CONTRACT as `0x${string}`,
        "Battery",
        "BTRY",
      ],
    });

    const createContract = await client.simulateContract({
      address: process.env.NEXT_PUBLIC_DEPLOYER_CONTRACT as `0x${string}`,
      abi: deployerABI.abi,
      functionName: "deployProxyBattery",
      args: [data, values.batteryId],
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

    const timestamp = values.productionDate.getTime() / 1000;

    const mintNFT = await client.simulateContract({
      address: computeAddress as `0x${string}`,
      abi: batteryLogicABI.abi,
      functionName: "mint",
      args: [
        addressTo,
        values.batteryId,
        values.manufacturer,
        values.batteryStatus,
        timestamp,
      ],
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
