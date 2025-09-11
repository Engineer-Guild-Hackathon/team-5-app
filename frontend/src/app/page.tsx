"use client"

import { Header } from "@/components/Header";
import { Input_text } from "@/components/Input_com";
import { Yomikata } from "@/components/Yomikata";
import { useScreenState } from "@/hooks/States";


export default
function Home() {

	const ScreenState = useScreenState((state)=>state.ScreenState);

	return (
			<div className="flex w-screen h-auto justify-center flex-col">
				<Header/>
				<div className="px-[24px] w-full h-auto">
					{
						ScreenState === "result" ? 
						<Yomikata
							data_list={[]}
						/> :
						<Input_text/>
					}
				</div>
			</div>
	);
}