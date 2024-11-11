"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

import SearchVehicleForm from "./search-vehicle-form";

export default function SearchVehicle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Card className="flex h-52 w-52 rounded-3xl p-4 hover:shadow-black/25 dark:bg-zinc-800 justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <Car className="h-[80px] w-[100px]" />
            <h3 className="font-sans font-semibold text-foreground text-center">
              Search Vehicle passport
            </h3>
            <Button className="mt-6 h-9 w-18" onClick={() => setOpen(true)}>
              <Plus />
            </Button>
          </div>
        </Card>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search vehicle passport</DialogTitle>
          </DialogHeader>
          <SearchVehicleForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
