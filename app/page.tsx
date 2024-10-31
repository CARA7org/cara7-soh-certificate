"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useWeb3Auth } from "@/context/web3auth";

export default function Home() {
  const { login, loggedIn } = useWeb3Auth();
  const router = useRouter();

  async function handleLogin(role: string) {
    await login();

    if (loggedIn) {
      console.log("Logged in");
      router.push(`/${role}`);
    }
  }

  return (
    <div className="h-screen w-screen">
      <div className="flex w-full h-full justify-center items-center">
        <Card className="">
          <CardHeader>
            <h1 className="text-2xl font-bold">Connect</h1>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex w-1/2 justify-center items-center h-full">
                <Button size="lg" onClick={() => handleLogin("specialist")}>
                  Connect as specialist
                </Button>
              </div>
              <div className="flex w-1/2 justify-center items-center h-full">
                <Button size="lg" onClick={() => handleLogin("user")}>
                  Connect as user
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
