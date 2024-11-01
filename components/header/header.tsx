import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
  return (
    <div className="fixed top-0 w-full h-10 z-50 shadow-md bg-background">
      <SidebarTrigger className="mt-2 ml-2" />
    </div>
  );
}
