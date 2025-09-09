"use client"

import { Header } from "@/components/Header";
import { Input_text } from "@/components/Input_com";
import { Yomikata } from "@/components/Yomikata";
import { useRef, useState } from "react";
import * as net_conf from "@/network.json";
import { Network, get_Yomikaka_res } from "@/funcs/network";

export default
function Home() {

  const [condition, setcondition] = useState<string>("input");

  const [input_text, setinput_text] = useState<string>("");

  const [res_data, setres_data] = useState<Array<get_Yomikaka_res>>([]);

  const net = useRef<Network>(new Network(net_conf.Adress));

  return (
    <div className="flex w-screen h-auto justify-center flex-col">
      <Header/>
      <div className="px-[24px] w-full h-auto">
        {
          condition === "input" ? <Input_text
            set_text={setinput_text}
            onClick_func={async () => {
              try{
                setres_data(await net.current.get_Yomikata("English", input_text));
                setcondition("result");
              }catch(error){
                console.error(error);
              }
            }}
          /> :
          condition === "result" ? <Yomikata
            data_list={res_data}
          /> :
          null
        }
      </div>
    </div>
  );
}