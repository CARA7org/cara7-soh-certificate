"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import AddEventForm from "./add-event-form";

import { useWeb3Auth } from "@/context/web3auth";

export default function AddEventButton({ slug }: { slug: `0x${string}` }) {
  const [open, setOpen] = useState(false);
  const { loggedIn, login } = useWeb3Auth();
  const handleClick = () => {
    if (!loggedIn) login();
    else setOpen(true);
    console.log("Add Event Button Clicked");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button className="ml-auto" onClick={handleClick}>
          Add Event
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an event</DialogTitle>
            <DialogDescription>
              Add an event to the vehicle&apos;s history
            </DialogDescription>
          </DialogHeader>
          <AddEventForm slug={slug} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
