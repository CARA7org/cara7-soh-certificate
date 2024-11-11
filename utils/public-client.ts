import { createPublicClient, http } from "viem";
import { xrpl } from "./xrpl-chain";

export const publicClient = createPublicClient({
  chain: xrpl,
  transport: http(),
});
