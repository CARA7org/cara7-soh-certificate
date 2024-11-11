"use server";
import { ownerClient } from "@/utils/owner-client";
import { publicClient } from "@/utils/public-client";

export async function sendNativeToken(address: `0x${string}`, value: bigint) {
  const hash = await ownerClient.sendTransaction({
    to: address,
    value: value,
  });
  const result = await publicClient.waitForTransactionReceipt({ hash: hash });

  return result;
}
