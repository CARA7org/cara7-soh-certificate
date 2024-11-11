import { createWalletClient, custom } from "viem";
import { xrpl } from "./xrpl-chain";
import type { IProvider } from "@web3auth/base";

export const getWalletClient = (provider: IProvider) => {
  return createWalletClient({
    chain: xrpl,
    transport: custom(provider),
  });
};
