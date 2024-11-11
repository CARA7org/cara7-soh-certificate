"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useWeb3Auth } from "@/context/web3auth";
import { publicClient } from "@/utils/public-client";

import deployerABI from "@/abi/Deployer.json";

import { createBattery } from "@/actions/create-battery";

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
import { DateTimePicker } from "@/components/ui/datetime-picker";

const vinFormSchema = z.object({
  batteryId: z.string().min(2, { message: "Invalid ID" }).max(50),
  address: z.string(),
  manufacturer: z.string(),
  batteryStatus: z.string(),
  productionDate: z.date(),
});

export default function BatteryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState("address");
  const { loggedIn, provider, login } = useWeb3Auth();
  const form = useForm<z.infer<typeof vinFormSchema>>({
    resolver: zodResolver(vinFormSchema),
    defaultValues: {
      batteryId: "",
    },
  });

  if (!loggedIn) login();

  async function onSubmit(values: z.infer<typeof vinFormSchema>) {
    console.log(values);
    setLoading(true);

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
    }

    if (inputType === "vin") {
      const computeAddressVehicle = await client.readContract({
        address: process.env.NEXT_PUBLIC_DEPLOYER_CONTRACT as `0x${string}`,
        abi: deployerABI.abi,
        functionName: "computeProxyVehicleAddress",
        args: [values.address],
      });
      values.address = computeAddressVehicle as string;
    }

    console.log("updated values", values);

    const result = await createBattery(values);

    if (result.computeAddress) {
      router.push(`/specialist/battery/${computeAddress}`);
      setLoading(false);
      return;
    }

    if (result.error) {
      form.setError("batteryId", { message: result.error });
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center p-8">
      <Card className="flex flex-col w-full md:w-2/3">
        <CardHeader className="font-semibold">
          Create battery certificate
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="batteryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Battery ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the Battery ID number.
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
                    <div className="flex flex-row space-x-4">
                      <Select value={inputType} onValueChange={setInputType}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="address" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="address">address</SelectItem>
                          <SelectItem value="vin">VIN number</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormControl>
                        <Input
                          placeholder={
                            inputType === "address" ? "0x..." : "VIN"
                          }
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      {inputType === "address"
                        ? "Please enter the address of the receiver."
                        : "Please enter the VIN of the vehicle."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="manufacturer" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the manufacturer of the battery
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batteryStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Battery Status" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the batteryStatus of the battery
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateTimePicker hideTime {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter the production date of the battery
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
