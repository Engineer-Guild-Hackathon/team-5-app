import React, { useState } from "react";
import Image from "next/image";
import { get_Yomikaka_res } from "@/funcs/network";

type Yomikata_props = {
    data_list:Array<get_Yomikaka_res>;
}

export
function Yomikata({data_list}:Yomikata_props) {

    return (
        <div
            className="
                flex flex-col w-full min-h-[276px] p-[16px] mt-[24px]
                border-[1px] rounded-[6px] border-[#DEE1E6FF]
            "
        >
            <div
                className="
                    flex items-center flex-row
                    gap-2 mb-3
                "
            >
                <div
                    className="
                        w-fit h-fit
                        text-[25px] font-bold
                    "
                >
                    英語
                </div>
                <Image
                    src="/arrow_right.svg"
                    className="w-[40px] h-[40px] border-1"
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
                    日本語
                </div>
            </div>
            {
                data_list.map((item,idx)=>{
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