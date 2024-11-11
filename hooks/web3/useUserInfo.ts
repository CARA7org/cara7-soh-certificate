"use client";
import { useState, useEffect } from "react";
import { useWeb3Auth } from "@/context/web3auth";
import type { UserInfo } from "@web3auth/base";

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<Partial<UserInfo> | null>(null);
  const [userInfoStatus, setUserInfoStatus] = useState<
    "loading" | "error" | "success"
  >("loading");
  const { getUserInfo, loggedIn } = useWeb3Auth();

  useEffect(() => {
    async function fetchUserInfo() {
      if (!loggedIn) {
        setUserInfoStatus("error");
        return;
      }
      const userInfo = await getUserInfo();
      if (!userInfo) {
        setUserInfoStatus("error");
        return;
      }
      setUserInfo(userInfo);
      setUserInfoStatus("success");
    }

    fetchUserInfo();
  }, [getUserInfo]);

  return { userInfo, userInfoStatus };
}
