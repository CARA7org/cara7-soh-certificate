// VehicleCardSkeleton.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateVehicleCardSkeleton() {
  return (
    <div className="flex justify-center p-8">
      <Card className="flex flex-col w-full md:w-1/2">
        <CardHeader className="font-semibold">
          <Skeleton className="h-6 w-1/3" /> {/* Skeleton pour le titre */}
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <Skeleton className="h-12 w-full" />{" "}
            {/* Skeleton pour le champ VIN */}
            <Skeleton className="h-12 w-full" />{" "}
            {/* Skeleton pour le champ adresse */}
            <Skeleton className="h-10 w-32" /> {/* Skeleton pour le bouton */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
