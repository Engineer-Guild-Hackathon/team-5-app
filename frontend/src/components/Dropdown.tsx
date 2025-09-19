import { useState } from "react";
import Image from "next/image";
import {lang_conf} from "@/hooks/lang_conf";

type Dropdown_props = {
    setLang:(lang:string)=>void;
    Lang:string;
    DropDownTitle:string;
}

export
function Dropdown({Lang, setLang, DropDownTitle}:Dropdown_props) {

    const [open, setopen] = useState<boolean>(false);

    const selected_func = (lang:string) => {
        setLang(lang);
        setopen((before)=>!before);
    }

    return (
        <div
            className="
                min-w-[110px] h-fit max-w-[180px]
            "
        >
            <div
                className="
                    w-fit h-fit
                    text-[13px] text-[#000000]
                "
            >
                {DropDownTitle}
            </div>
            <div
                className="
                    flex flex-row items-center
                    w-full h-[30px]
                    text-[20px] pl-3 border-[1px]
                    border-[#B05BAAFF] rounded-md
                    bg-[#ffffff] text-[#000000]
                "
            >
                {Lang}
                <button
                    className={`
                        w-[20px] h-[20px]
                        mr-[3px] ml-auto
                        ${open ? "rotate-180":"rotate-0"}
                        hover:border-1 cursor-pointer
                    `}
                    onClick={()=>setopen((before)=>!before)}
                >
                    <Image
                        src="/images/arrow_down.svg"
                        alt=""
                        width={20}
                        height={20}
                    />
                </button>
            </div>
            <div
                className={`
                    w-full max-h-[160px]
                    ${open ? "h-fit":"h-0"}
                    ${open ? "visible":"invisible"}
                    overflow-y-scroll
                    rounded-md border-1 border-[#dddddd]
                    flex flex-col
                    bg-[#FFFFFFFF]
                `}
            >
                {
                    lang_conf.map((item,idx)=>{
                        return (
                            <button
                                className="
                                    text-left h-fit w-full
                                    px-3 py-1
                                    hover:bg-[#ff82f7]
                                    cursor-pointer
                                "
                                key={idx}
                                onClick={()=>selected_func(item.lang)}
                            >
                                {item.lang}
                            </button>
                        );
                    })
                }
            </div>
        </div>
    );
}