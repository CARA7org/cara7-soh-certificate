import "server-only";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { xrpl } from "./xrpl-chain";

export const ownerAccount = privateKeyToAccount(
  process.env.OWNER_PRIVATE_KEY as `0x${string}`
);

export const ownerClient = createWalletClient({
  account: ownerAccount,
  chain: xrpl,
  transport: http(),
});
