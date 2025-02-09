"use server";

import vehicleABI from "@/abi/VehicleLogic.json";
import { ownerAccount, ownerClient } from "@/utils/owner-client";
import { publicClient } from "@/utils/public-client";

export async function transferBatteryFromVehicle(
  addressTo: string,
  vehicleAddress: `0x${string}`,
  batteryAddress: `0x${string}`
) {
  console.log("Enter transferBatteryFromVehicle");
  try {
    console.log(
      "transferBatteryFromVehicle",
      addressTo,
      vehicleAddress,
      batteryAddress
    );
    const transferSimulation = await publicClient.simulateContract({
      address: vehicleAddress,
      abi: vehicleABI.abi,
      functionName: "transferERC721",
      args: [batteryAddress, addressTo],
      account: ownerAccount,
    });
    console.log("transferBattery result", transferSimulation);

    const hashTransfer = await ownerClient.writeContract(
      transferSimulation.request
    );

    const receiptTransfer = await publicClient.waitForTransactionReceipt({
      hash: hashTransfer,
    });

    console.log("receiptTransfer", receiptTransfer);
  } catch (error) {
    console.error(error);
  }
}
