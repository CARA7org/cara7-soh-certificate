"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWeb3Auth } from "@/context/web3auth";
import { useState } from "react";

import TransferBatteryForm from "./transfer-battery-form";

export default function TransferBattery({
  vehicleAddress,
  batteryAddress,
}: {
  vehicleAddress: `0x${string}`;
  batteryAddress: `0x${string}`;
}) {
  const [open, setOpen] = useState(false);
  const { loggedIn, login } = useWeb3Auth();

  const handleClick = () => {
    if (!loggedIn) login();
    else setOpen(true);
    console.log("Transfer battery Button Clicked");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button className="ml-auto" onClick={handleClick}>
        Transfer battery
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer battery</DialogTitle>
          <DialogDescription>
            Transfer the battery to another address
          </DialogDescription>
        </DialogHeader>
        <TransferBatteryForm
          vehicleAddress={vehicleAddress}
          batteryAddress={batteryAddress}
        />
      </DialogContent>
    </Dialog>
  );
}
