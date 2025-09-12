import React, { useState } from "react";
import Image from "next/image";

import { useResults,useScreenState, network, rec_voice } from "@/hooks/States";

export
function Yomikata() {

    const results = useResults((state)=>state.Result);
    const to = useResults((state)=>state.To);
    const from = useResults((state)=>state.From);
    const setScreenState = useScreenState((state)=>state.setScreenState);

    const [speaking, setspeaking] = useState<boolean>(false);

    const [speak_score, setspeak_score] = useState<number|null>(null);

    const onclick_func = async () => {
        try{
            if(!rec_voice.isRec){
                setspeaking(true);
                await rec_voice.start_rec_voice();
            }else{
                const data =  await rec_voice.stop_rec_voice();
                if(!data.Blob) throw new Error("can't get data");
                else{
                    const result_data = await network.get_Yomikata_score(data.Blob, data.type);
                    let sum:number = 0;
                    result_data.results.forEach((item)=>{sum += item.confidence;});
                    setspeak_score(sum/result_data.results.length*100);
                    setspeaking(false);
                }
            }
        }catch(e){
            console.error(e);
            rec_voice.stop_rec_voice();
            rec_voice.delete_voice_data();
            setspeaking(false);
        }
    }

    return (
        <div
            className="
                flex flex-col w-full min-h-[276px] p-[16px] mt-[24px]
                border-[1px] rounded-[6px] border-[#DEE1E6FF]
                bg-[#ffffff81]
            "
        >
            <button
                className="
                    w-[30px] h-[30px]
                    bg-[url(/images/back.svg)]
                    bg-cover mb-3 cursor-pointer
                "

                onClick={()=>setScreenState("input")}
            />
            <div
                className="
                    flex items-center flex-row
                    gap-2 mb-3 border-b-1 border-[#0F0F0FFF]
                "
            >
                <div
                    className="
                        w-fit h-fit
                        text-[25px] font-bold
                    "
                >
                    {from}
                </div>
                <Image
                    src="/images/arrow_right.svg"
                    className="w-[40px] h-[40px]"
                    alt=""
                    width={40}
                    height={40}
                />
                <div
                    className="
                        w-fit h-fit
                        text-[25px] font-bold
                    "
                >
                    {to}
                </div>
            </div>
            <div
                className="
                    w-full h-[6000px] max-h-[40vh]
                    overflow-y-auto
                "
            >
                {
                    results.map((item,idx)=>{
                        return (
                            <div
                                className="
                                    flex flex-col gap-2
                                    mb-2
                                "
                                key={idx}
                            >
                                <Genbun_text
                                    text={item.original}
                                />
                                <Yomikata_text
                                    text={item.convert}
                                />
                            </div>
                        );
                    })
                }
            </div>
            <div
                className="
                    w-full h-auto
                    flex flex-row items-center
                    justify-around
                    mt-4
                "
            >
                <button
                    className={`
                        bg-[url(/images/mic.svg)]
                        bg-cover
                        h-[70px] w-[70px]
                        ${
                            speaking ? "bg-[#32fefb]"
                            : "bg-[#a6a5a5]"
                        }
                        rounded-full
                    `}
                    onClick={onclick_func}
                />
                <div
                    className={`
                        text-[30px]
                        bg-white p-2 rounded-sm
                        ${speak_score !== null ? "visible" : "hidden"}
                    `}
                >
                    {`Score: ${speak_score}`}
                </div>
            </div>
        </div>
    );
}

type Genbun_text_props = {
    text:string
}

function Genbun_text({text}:Genbun_text_props){
    return (
        <div
            className="
                px-3
                text-[20px] border-b-1
            "
        >
            {text}
        </div>
    );
}

type Yomikata_text_props = {
    text:string
}

function Yomikata_text({text}:Yomikata_text_props){
    return (
        <div
            className="
                px-3
                text-[20px] border-b-1
            "
        >
            {text}
        </div>
    );
}