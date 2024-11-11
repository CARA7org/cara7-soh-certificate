import { Card } from "@/components/ui/card";
import { Plus, LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefAttributes, ForwardRefExoticComponent } from "react";

export default function CertficationWidget({
  title,
  path,
  Icon,
}: {
  title: string;
  path: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}) {
  return (
    <Card className="flex h-52 w-52 rounded-3xl p-4 hover:shadow-black/25 dark:bg-zinc-800 justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <Icon className="h-[80px] w-[100px]" />
        <h3 className="font-sans font-semibold text-foreground text-center">
          {title}
        </h3>
        <Link href={path}>
          <Button className="mt-6 h-9 w-18">
            <Plus />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
