import { publicClient } from "@/utils/public-client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import vehicleABI from "@/abi/VehicleLogic.json";
import batteryABI from "@/abi/BatteryLogic.json";
import { metadata } from "@/app/layout";

import AddEventButton from "./add-event-button";

type vehicleEvent = {
  eventName: string;
  dataNames: string[];
  dataValues: string[];
  timestamp: bigint;
};

type batteryMetada = {
  status: number;
  batteryId: string;
  manufacturer: string;
  batteryStatus: string;
  productionDate: bigint;
};

export default async function BetteryIdPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const events = [] as vehicleEvent[];
  const slug = (await params).slug;

  const client = publicClient;

  const ownerNFT = (await client.readContract({
    address: slug as `0x${string}`,
    abi: batteryABI.abi,
    functionName: "ownerOf",
    args: [1],
  })) as string | undefined;

  const ownerOfNFT =
    ownerNFT == "0xDdc539B305bAE3687CFb41CE13f27399e9F1A499"
      ? "not owned"
      : ownerNFT;

  const batteryMetadata = (await client.readContract({
    address: slug as `0x${string}`,
    abi: batteryABI.abi,
    functionName: "metadata",
  })) as batteryMetada | undefined;

  const eventCount = (await client.readContract({
    address: slug as `0x${string}`,
    abi: batteryABI.abi,
    functionName: "getEventsCount",
  })) as bigint;

  if (Number(eventCount) > 0) {
    for (let i = 0; i < Number(eventCount); i++) {
      const event = (await client.readContract({
        address: slug as `0x${string}`,
        abi: batteryABI.abi,
        functionName: "getEvent",
        args: [i],
      })) as vehicleEvent;
      events.push(event);
      console.log("event", event);
    }
  }

  events.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  // console.log("eventCount", eventCount);
  console.log(events);

  console.log("vin", batteryMetadata);

  return (
    <div className="p-4">
      <Card className="flex flex-col w-full">
        <CardHeader className="font-semibold">Bettery Information</CardHeader>
        <CardContent>
          <h1>Certificate ID: {slug}</h1>
          <p>BatteryId: {batteryMetadata?.batteryId}</p>
          <p>Manufacturer: {batteryMetadata?.manufacturer}</p>
          <p>Battery status: {batteryMetadata?.batteryStatus}</p>
          <p>
            Production date:{" "}
            {new Date(
              Number(batteryMetadata?.productionDate) * 1000
            ).toLocaleString()}
          </p>
          {/* <p>METADATA: {batteryMetadata}</p> */}
          <p>Owner NFT: {ownerOfNFT}</p>
        </CardContent>
      </Card>
      <Card className="flex flex-col w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <h1 className="font-semibold">Events</h1>
          <AddEventButton slug={slug as `0x${string}`} />
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 font-bold">Date</th>
                  <th className="border border-gray-300 p-2 font-bold">Name</th>
                  <th className="border border-gray-300 p-2 font-bold">
                    Data Names
                  </th>
                  <th className="border border-gray-300 p-2 font-bold">
                    Data Values
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.timestamp.toString()}>
                    <td className="border border-gray-300 p-2">
                      {new Date(
                        Number(event.timestamp) * 1000
                      ).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {event.eventName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {event.dataNames.join(", ")}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {event.dataValues.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No events available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
