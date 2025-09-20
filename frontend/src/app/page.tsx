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
}