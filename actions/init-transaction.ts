"use server";
import { authorizeAddress } from "./authorize-address";
import { sendNativeToken } from "./send-native-token";
import { publicClient } from "@/utils/public-client";

export async function initTransaction({
  address,
  value,
}: {
  address: `0x${string}`;
  value: bigint;
}) {
  await authorizeAddress(address);

  const balance = await publicClient.getBalance({ address: address });

  if (balance < value) {
    await sendNativeToken(address, value);
  }
}
