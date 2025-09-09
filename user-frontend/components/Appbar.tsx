"use client";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useEffect } from "react";

export const Appbar = () => {
  const publicKey = "0x123123";

  async function signAndSend() {
    if (!publicKey) {
      return;
    }
    const message = new TextEncoder().encode("Sign into the matrix");
    const signature = "xyx";
    console.log(signature);
    console.log(publicKey);
    const response = await axios.post(`${BACKEND_URL}/v1/user/signin`, {
      signature,
      publicKey: publicKey?.toString(),
    });
    localStorage.setItem("token", response.data.token);
  }

  useEffect(() => {
    signAndSend();
  }, [publicKey]);
  return (
    <div className="flex justify-between border-b pb-2 pt-2">
      <div className="text-2xl pl-4 flex justify-center pt-3">Matrix</div>
      <div className="text-xl pr-4 pb-2">{publicKey ? "Hello" : "Bye"}</div>
    </div>
  );
};
