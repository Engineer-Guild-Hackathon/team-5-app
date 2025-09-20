"use client"

import { Input_text } from "@/components/Input_com";
import { Yomikata } from "@/components/Yomikata";
import { useResults, useScreenState } from "@/hooks/States";
import { useEffect } from "react";

export default
function Dynamic_coms() {

    const {ScreenState,setScreenState} = useScreenState();
	const flag = useResults((state)=>state.Log_flag);

	useEffect(()=>{
		if(flag){
			setScreenState("result");
		}
	},[flag])

    return (
        <div className="px-[24px] w-full flex-1 border-1 overflow-y-auto">
			{
				ScreenState === "result" ? 
				<Yomikata/> :
				<Input_text/>
			}
		</div>
    );
}