import {
  createWalletClient,
  createPublicClient,
  custom,
  formatEther,
  parseEther,
} from "viem";
import { xrpl } from "./xrpl-chain";
import type { IProvider } from "@web3auth/base";

const getViewChain = (provider: IProvider) => {
  switch (provider.chainId) {
    case "1440002":
      return xrpl;
    default:
      return xrpl;
  }
};

export const getPublicClient = (provider: IProvider) => {
  return createPublicClient({
    chain: getViewChain(provider),
    transport: custom(provider),
  });
};

export const getWalletClient = (provider: IProvider) => {
  return createWalletClient({
    chain: getViewChain(provider),
    transport: custom(provider),
  });
};
