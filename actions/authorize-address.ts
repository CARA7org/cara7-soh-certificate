"use server";

import authorizationABI from "@/abi/Authorization.json";

import { ownerClient, ownerAccount } from "@/utils/owner-client";
import { publicClient } from "@/utils/public-client";

export async function authorizeAddress(address: `0x${string}`) {
  let isAuthorized = false;
  try {
    const data = await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_AUTHORIZATION_CONTRACT as `0x${string}`,
      abi: authorizationABI.abi,
      functionName: "isAuthorized",
      args: [address],
    });

    if (typeof data === "boolean") {
      isAuthorized = data as boolean;
    }

    if (isAuthorized === false && data == false) {
      const authorizeSimulation = await publicClient.simulateContract({
        address: process.env
          .NEXT_PUBLIC_AUTHORIZATION_CONTRACT as `0x${string}`,
        abi: authorizationABI.abi,
        functionName: "authorize",
        args: [address],
        account: ownerAccount,
      });
      console.log("authorize result", authorizeSimulation);

      const hashAuthorized = await ownerClient.writeContract(
        authorizeSimulation.request
      );

      const receiptAuthorize = await publicClient.waitForTransactionReceipt({
        hash: hashAuthorized,
      });

      console.log("receiptAuthorize", receiptAuthorize);
      isAuthorized = true;
    }

    console.log("isAuthorized", isAuthorized);

    return { isAuthorized: isAuthorized };
  } catch (error) {
    console.error(error);
  }
}
