"use client"

import { Header } from "@/components/Header";
import { Input_text } from "@/components/Input_com";
import { Yomikata } from "@/components/Yomikata";
import { useRef, useState } from "react";
import net_conf from "@/network.json";
import { Network } from "@/funcs/network";

import { useYomikataState } from "@/funcs/yomikata_hooks";

export default
function Home() {

  const net = useRef<Network>(new Network(net_conf.Adress));

  const {
    condition, setcondition,
    input_text, setinput_text,
    res_data, setres_data
  } = useYomikataState("input");

  const onclick_func = async () => {
	try{
		setres_data(await net.current.get_Yomikata("English", input_text));
		setcondition("result");
	}catch(error){
		console.error(error);
	}
  }

  return (
    <div className="flex w-screen h-auto justify-center flex-col">
      <Header/>
      <div className="px-[24px] w-full h-auto">
        {
          condition === "input" ? <Input_text
            set_text={setinput_text}
            onClick_func={onclick_func}
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