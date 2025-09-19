
import { auto_height_resize } from "@/funcs/auto_resize";
import { useEffect, useRef, useState } from "react";
import { network, webspeak ,useResults, useScreenState } from "@/hooks/States";
import { useLang } from "@/hooks/lang_conf";
import { Dropdown } from "@/components/Dropdown";
import Image from "next/image";
import { useUserID } from "@/hooks/Account";

export
function Input_text() {
    
    const {ScreenState, setScreenState} = useScreenState();

    const [input_text, setinput_text] = useState<string>("");

    const {From, To, setFrom, setTo,setResult} = useResults();

    const lang_conf = useLang((state)=>state.conf); 

    const UseID = useUserID((state)=>state.ID);

    const textarea_ref = useRef<HTMLTextAreaElement | null>(null);

    useEffect(()=>{
        if(To === ""){
            setTo(lang_conf.lang);
        }
    },[]);

    const onclick_func = async () => {
        try{
            setScreenState("waiting");
            webspeak.change_voice(From);
            if(!To){
                throw new Error("To is null");
            }
            setResult(await network.get_Yomikata(From,To,input_text,UseID));
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
                    DropDownTitle={lang_conf.Genbun}
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
                    DropDownTitle={lang_conf.Yomikata}
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
                placeholder={lang_conf.init_input_text}
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
                    {lang_conf.pronu_change}
                </div>
            </button>
        </div>
    );
}

