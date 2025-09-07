"use client"

import { Header } from "@/components/Header";
import { Input_text } from "@/components/Input_com";
import { Yomikata } from "@/components/Yomikata";
import { useState } from "react";

export default
function Home() {

  const [condition, setcondition] = useState<string>("result");

  return (
    <div className="flex w-screen h-auto justify-center flex-col">
      <Header/>
      <div className="px-[24px] w-full h-auto">
        {
          condition === "input" ? <Input_text/> :
          condition === "result" ? <Yomikata/> :
          null
        }
      </div>
    </div>
  );
}