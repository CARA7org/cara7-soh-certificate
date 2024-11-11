import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { bigint, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { getWalletClient } from "@/utils/read-contract";
import { useWeb3Auth } from "@/context/web3auth";
import { publicClient } from "@/utils/public-client";

import { initTransaction } from "@/actions/init-transaction";

import deployerABI from "@/abi/Deployer.json";

const vehicleFormSchema = z.object({
  vin: z.string(),
});

type VehicleFormSchema = z.infer<typeof vehicleFormSchema>;

export default function SearchVehicleForm() {
  const router = useRouter();
  const { provider, loggedIn, login } = useWeb3Auth();
  const [loading, setLoading] = useState(false);
  const form = useForm<VehicleFormSchema>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vin: "",
    },
  });

  const onSubmit = async (values: VehicleFormSchema) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const client = publicClient;
    const computeAddress = await client.readContract({
      address: process.env.NEXT_PUBLIC_DEPLOYER_CONTRACT as `0x${string}`,
      abi: deployerABI.abi,
      functionName: "computeProxyVehicleAddress",
      args: [values.vin],
    });

    console.log("computeAddress", computeAddress);

    if (!computeAddress) {
      console.log("computeAddress not found");
      setLoading(false);
      return;
    }
    const bytecode = await client.getCode({
      address: computeAddress as `0x${string}`,
    });

    console.log("bytecode", bytecode);
    if (bytecode) {
      console.log("Vehicle contract already exist");
      router.push(`/specialist/vehicle/${computeAddress}`);
      setLoading(false);
      return;
    } else {
      form.setError("vin", { message: "Invalid VIN" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="vin" {...field} />
              </FormControl>
              <FormDescription>
                Please enter the vin of the vehicle.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
