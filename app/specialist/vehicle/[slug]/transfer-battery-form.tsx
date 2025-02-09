"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import { transferBatteryFromVehicle } from "@/actions/transfer-battery-from-vehicle";
import { useState } from "react";

const formSchema = z.object({
  address: z.string().length(42),
});

export default function TransferBatteryForm({
  vehicleAddress,
  batteryAddress,
}: {
  vehicleAddress: `0x${string}`;
  batteryAddress: `0x${string}`;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = await transferBatteryFromVehicle(
      values.address,
      vehicleAddress,
      batteryAddress
    );
    console.log(result);
    setLoading(false);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address to transfer</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {loading ? <Loader className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
