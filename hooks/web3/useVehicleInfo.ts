"use client";
import { useState, useEffect } from "react";
import { publicClient } from "@/utils/public-client";
import vehicleABI from "@/abi/VehicleLogic.json";

export function useVehicleInfo(address: `0x${string}`) {
  const [vin, setVin] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicleInfo() {
      const client = publicClient;
      const vin = await client.readContract({
        address: process.env.NEXT_PUBLIC_DEPLOYER_CONTRACT as `0x${string}`,
        abi: vehicleABI.abi,
        functionName: "metadata",
      });

      console.log("vin", vin);

      setVin(vin as string);
    }

    fetchVehicleInfo();
  }, []);

  return { vin };
}
