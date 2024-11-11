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

import vehicleABI from "@/abi/VehicleLogic.json";

const eventFormSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  pairs: z.array(
    z.object({
      dataName: z.string().nonempty("Data name cannot be empty"),
      dataValue: z.string().nonempty("Data value cannot be empty"),
    })
  ),
});

type EventFormSchema = z.infer<typeof eventFormSchema>;

export default function AddEventForm({
  slug,
  setOpen,
}: {
  slug: `0x${string}`;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { provider, loggedIn, login } = useWeb3Auth();
  const [loading, setLoading] = useState(false);
  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: "",
      pairs: [{ dataName: "", dataValue: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pairs",
  });

  const handleAppend = () => {
    append({ dataName: "", dataValue: "" });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const onSubmit = async (values: EventFormSchema) => {
    console.log(values);
    if (!loggedIn) login();
    try {
      setLoading(true);
      if (!provider) throw new Error("Provider not initialized");
      const walletClient = getWalletClient(provider);

      const address = await walletClient.getAddresses();
      const userAddress = address[0];

      const dataNames = values.pairs.map((pair) => pair.dataName);
      const dataValues = values.pairs.map((pair) => pair.dataValue);

      const estimatedGas = await publicClient.estimateGas({
        address: slug,
        abi: vehicleABI.abi,
        functionName: "addEvent",
        args: [values.eventName, dataNames, dataValues],
        account: userAddress,
      });

      // Fetch the current gas price
      const gasPrice = await publicClient.getGasPrice();

      // Calculate the total cost required in wei
      const totalCost = estimatedGas * gasPrice;

      await initTransaction({
        address: userAddress,
        value: totalCost,
      });

      const addEventSimulation = await publicClient.simulateContract({
        address: slug,
        abi: vehicleABI.abi,
        functionName: "addEvent",
        args: [values.eventName, dataNames, dataValues],
        account: address[0],
      });

      const hashAddEvent = await walletClient.writeContract(
        addEventSimulation.request
      );
      await publicClient.waitForTransactionReceipt({
        hash: hashAddEvent,
      });
      console.log("Tx success add event");
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="ex: revision" {...field} />
              </FormControl>
              <FormDescription>
                Please enter the topic of the event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-4">
          <FormLabel>Data Names and Data Values</FormLabel>
          {fields.map((item, index) => (
            <div key={item.id} className="flex space-x-4">
              <FormField
                control={form.control}
                name={`pairs.${index}.dataName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Data name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`pairs.${index}.dataValue`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Data value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
              >
                <X />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={handleAppend}>
            Add Data Pair
          </Button>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
