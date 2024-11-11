type vehicleEvent = {
  eventName: string;
  dataNames: string[];
  dataValues: string[];
  timestamp: bigint;
};

export default function EventDisplay({
  eventName,
  dataNames,
  dataValues,
  timestamp,
}: vehicleEvent) {
  return (
    <tr key={timestamp.toString()}>
      <td className="border border-gray-300 p-2">
        {new Date(Number(timestamp) * 1000).toLocaleString()}
      </td>
      <td className="border border-gray-300 p-2">{eventName}</td>
      <td className="border border-gray-300 p-2">{dataNames.join(", ")}</td>
      <td className="border border-gray-300 p-2">{dataValues.join(", ")}</td>
    </tr>
  );
}
