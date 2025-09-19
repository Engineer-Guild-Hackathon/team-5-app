<<<<<<< HEAD
"use client"

import { Header } from "@/components/Header";
import { useScreenState } from "@/hooks/States";
import dynamic from "next/dynamic";

const Heavy = dynamic(()=>import("@/components/dynamic"),{
	ssr:false
});

export default
function Home() {

	const ScreenState = useScreenState((state)=>state.ScreenState);

	return (
		<div className="flex w-screen h-screen flex-col bg-[url(/images/bg_image.png)] bg-cover">
        	<Header/>
			<Heavy/>
		</div>
	);
=======
"use client"

import { Header } from "@/components/Header";
import { Input_text } from "@/components/Input_com";
import { Yomikata } from "@/components/Yomikata";
import { useScreenState } from "@/hooks/States";


export default
function Home() {

	const ScreenState = useScreenState((state)=>state.ScreenState);

	return (
		<div className="flex w-screen h-screen flex-col bg-[url(/images/bg_image.png)] bg-cover">
        	<Header/>
			<div className="px-[24px] w-full flex-1 border-1 overflow-y-auto">
				{
					ScreenState === "result" ? 
					<Yomikata/> :
					<Input_text/>
				}
			</div>
		</div>
	);
>>>>>>> fc1a10f5a5adc39db13bd0375053eaf46a79533b
}