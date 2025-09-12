<<<<<<< HEAD
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
=======
"use client"

import { Header } from "@/components/Header"

export default
function Home() {
  return (
    <div className="w-full h-fit">
      <Header/>
    </div>
  );
>>>>>>> 81fe22eee1bfeeee364cd2f92dc4fe0d3eeeef37
}