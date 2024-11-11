import CertficationWidget from "@/components/certification-widget";
import { Car, BatteryCharging } from "lucide-react";

export default function CertificationPage() {
  return (
    <div className="h-full w-full px-4">
      <div className="flex flex-col md:flex-row w-full h-full justify-center items-center space-y-4 md:space-y-0 md:space-x-4 md:mb-10">
        <CertficationWidget
          title="Vehicle Passport"
          path="certification/vehicle"
          Icon={Car}
        />
        <CertficationWidget
          title="Battery Passport"
          path="certification/battery"
          Icon={BatteryCharging}
        />
      </div>
    </div>
  );
}
