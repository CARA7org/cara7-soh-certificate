import Image from "next/image";
import { SidebarTrigger } from "../ui/sidebar";
import logo from "@/public/CARA7_LOGO_WHITE.png";

export default function Header() {
  return (
    <div className="fixed top-0 w-full h-10 z-50 shadow-md bg-background">
      <div className="flex flex-row w-full">
        <SidebarTrigger className="mt-2 ml-2" />
        <div className="mr-auto">
          <Image src={logo} alt="logoC7" width="100" height={30} />
        </div>
      </div>
    </div>
  );
}
