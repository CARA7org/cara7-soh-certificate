import { defineChain } from "viem";

export const xrpl = defineChain({
  id: 1440002,
  name: "XRPL EVM Sidechain",
  nativeCurrency: {
    decimals: 18,
    name: "Ripple",
    symbol: "XRP",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-evm-sidechain.xrpl.org"],
      // webSocket: ["wss://rpc.zora.energy"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://evm-sidechain.xrpl.org" },
  },
  // contracts: {
  //   multicall3: {
  //     address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //     blockCreated: 5882,
  //   },
  // },
});
