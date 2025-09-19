"use client"

import { Input_text } from "@/components/Input_com";
import { Yomikata } from "@/components/Yomikata";
import { useScreenState } from "@/hooks/States";

export default
function Dynamic_coms() {

    const ScreenState = useScreenState((state)=>state.ScreenState);

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