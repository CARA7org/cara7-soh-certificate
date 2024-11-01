import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { cookies } from "next/headers";
import Header from "@/components/header/header";
import LayoutContent from "@/components/sidebar/layout-content";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex flex-1">
        <Header />
        <LayoutContent>{children}</LayoutContent>
      </main>
    </SidebarProvider>
  );
}
