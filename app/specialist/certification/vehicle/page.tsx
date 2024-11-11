"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useWeb3Auth } from "@/context/web3auth";
import { publicClient } from "@/utils/public-client";

import deployerABI from "@/abi/Deployer.json";

import { createVehicle } from "@/actions/create-vehicle";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import CreateVehicleCardSkeleton from "@/components/create-vehicle-card-skeleton";

const vinFormSchema = z.object({
  vin: z.string().min(2, { message: "Invalid VIN" }).max(50),
  address: z
    .string()
    .min(42, { message: "Invalid address" })
    .max(42, { message: "Invalid address" })
    .optional(),
});

export default function VehiclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { loggedIn, provider, login } = useWeb3Auth();
  const form = useForm<z.infer<typeof vinFormSchema>>({
    resolver: zodResolver(vinFormSchema),
    defaultValues: {
      vin: "",
      address: "",
    },
  });

  if (!loggedIn) {
    login();
    return <CreateVehicleCardSkeleton />;
  }

  async function onSubmit(values: z.infer<typeof vinFormSchema>) {
    setLoading(true);
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
    }

    const result = await createVehicle(values);

    if (result.computeAddress) {
      router.push(`/specialist/vehicle/${computeAddress}`);
      setLoading(false);
      return;
    }

    if (result.error) {
      form.setError("vin", { message: result.error });
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center p-8">
      <Card className="flex flex-col w-full md:w-1/2">
        <CardHeader className="font-semibold">
          Create vehicle certification
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="VIN" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the VIN number of the vehicle.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="0x... (optional)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the address of the receiver.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{loading ? "loading" : "Submit"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
