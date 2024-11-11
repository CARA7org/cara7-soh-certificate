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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useWeb3Auth } from "@/context/web3auth";
import { publicClient } from "@/utils/public-client";

import deployerABI from "@/abi/Deployer.json";

const batteryFormSchema = z.object({
  batteryId: z.string(),
});

type BatteryFormSchema = z.infer<typeof batteryFormSchema>;

export default function SearchBatteryForm() {
  const router = useRouter();
  const { provider, loggedIn, login } = useWeb3Auth();
  const [loading, setLoading] = useState(false);
  const form = useForm<BatteryFormSchema>({
    resolver: zodResolver(batteryFormSchema),
    defaultValues: {
      batteryId: "",
    },
  });

  const onSubmit = async (values: BatteryFormSchema) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const client = publicClient;
    const computeAddress = await client.readContract({
      address: process.env.NEXT_PUBLIC_DEPLOYER_CONTRACT as `0x${string}`,
      abi: deployerABI.abi,
      functionName: "computeProxyBatteryAddress",
      args: [values.batteryId],
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
      console.log("Battery contract already exist");
      router.push(`/specialist/battery/${computeAddress}`);
      setLoading(false);
      return;
    } else {
      form.setError("batteryId", { message: "Invalid Battery Id" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="batteryId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="batteryId" {...field} />
              </FormControl>
              <FormDescription>
                Please enter the battery ID of the battery.
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
