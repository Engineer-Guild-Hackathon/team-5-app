
import { auto_height_resize } from "@/funcs/auto_resize";
import { useRef, useState } from "react";
import { network, useResults, useScreenState } from "@/hooks/States";
import Image from "next/image";

export
function Input_text() {
    
    const {ScreenState, setScreenState} = useScreenState();

    const [input_text, setinput_text] = useState<string>("");

    const {From, To, setFrom, setTo,setResult} = useResults();

    const textarea_ref = useRef<HTMLTextAreaElement | null>(null);

    const onclick_func = async () => {
        try{
            setScreenState("waiting");
            setResult(await network.get_Yomikata(From,input_text));
            setScreenState("result");
        }catch(e){
            console.error(e);
            setScreenState("input");
        }
    }

    return  (
        <div
            className="
                relative w-full rounded-[10px]
                mt-[24px] h-fit px-[16px]
                bg-[#ffffff81]
                border-[1px] p-[16px]
                border-[#DEE1E6FF]
            "
        >
            <div
                className="
                    w-fit
                    flex flex-row gap-1
                    justify-center
                "
            >
                <Dropdown
                    setLang={setFrom}
                    Lang={From}
                    DropDownTitle="原文"
                />
                <Image
                    src="/images/arrow_right.svg"
                    className="
                        mt-[20px]
                        mb-auto border-1
                    "
                    width={30}
                    height={30}
                    alt=""
                />
                <Dropdown
                    setLang={setTo}
                    Lang={To}
                    DropDownTitle="読み方"
                />
            </div>
            <textarea
                className="
                    min-h-[102px] mt-[12px]
                    w-full h-auto px-[12px] py-[5px]
                    font-[14px] border-[1px] rounded-[6px]
                    bg-[#FFFFFF]
                    border-[#DEE1E6FF]
                    text-[#000000]
                "
                placeholder="英文を入力してください"
                value={input_text}
                ref={textarea_ref}
                onInput={(textarea)=>{
                    setinput_text(textarea.currentTarget.value);
                    auto_height_resize(textarea_ref);
                }}
            />
            <button
                className="
                    mt-[12px] w-full
                    bg-emerald-400 h-[44px] rounded-[3px]
                    active:scale-[95%] cursor-pointer
                "
                disabled={ScreenState === "waiting"}
                onClick={onclick_func}
            >
                <div
                    className="
                        m-auto
                        text-[16px]
                        active:scale-[95%]
                        select-none
                        text-[#000000]
                    "
                >
                    変換
                </div>
            </button>
        </div>
    );
}

const test_data:Array<string> = [
    "日本語",
    "English",
]

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
                    test_data.map((item,idx)=>{
                        return (
                            <button
                                className="
                                    text-left h-fit w-full
                                    px-3 py-1
                                    hover:bg-[#ff82f7]
                                    cursor-pointer
                                "
                                key={idx}
                                onClick={()=>selected_func(item)}
                            >
                                {item}
                            </button>
                        );
                    })
                }
            </div>
        </div>
    );
}