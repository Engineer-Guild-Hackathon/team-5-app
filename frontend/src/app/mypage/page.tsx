"use client"

import { Header } from "@/components/Header";
import { useUserID } from "@/hooks/Account";
import { lang_conf, useLang } from "@/hooks/lang_conf";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { network, useResults } from "@/hooks/States";
import { log_result } from "@/funcs/network";

export default
function MyPage() {

    const UserID = useUserID((state)=>state.ID);
    const [Log,setLog] = useState<log_result[]>([]);

    useEffect(()=>{
        if(UserID){
            const getlog = async () => {
                try{
                    const result = await network.get_log(UserID);
                    setLog(result);
                }catch(e){
                    throw new Error("Error Occur");
                }
            }
            getlog();
        }
    },[UserID]);

    return (
        <div
            className="
                flex w-screen min-h-screen h-fit
                flex-col bg-[url(/images/bg_image.png)] 
                bg-cover flex flex-col
            "
        >
            <Header/>
            <div
                className="
                    flex-1 h-fit w-[90vw]
                    bg-white my-10 py-5
                    self-center
                    flex flex-row
                    flex-wrap justify-around items-center
                "
            >
                <div
                    className="
                        min-w-[270px] h-fit
                        flex flex-col
                    "
                >
                    <p
                        className="
                            w-fit h-fit min-h-[0vw]
                            text-[clamp(10px,15vmin,47.5px)] font-bold whitespace-pre-line
                            bg-gradient-to-bl from-green-300 via-red-300 to-blue-300
                            bg-clip-text text-transparent
                        "
                    >
                        {"Improve\nyour\npronunciation"}
                    </p>
                    <button
                        className="
                            flex justify-center items-center
                            flex-col
                            text-[20px] py-1 px-5
                            my-5 rounded-md self-center
                            bg-yellow-200 cursor-pointer
                            shadow-2xl
                            active:scale-95 active:shadow-[0]
                        "
                        onClick={()=>window.location.href = "/"}
                    >
                        Improve Pronunciation
                        <p
                            className="
                                text-[10px]
                            "
                        >
                            Go to TopPage
                        </p>
                    </button>
                </div>
                <Log_Com
                    Log={Log}
                />
            </div>
        </div>
    );
}

type Log_Com_prop = {
    Log: log_result[];
}

const lang_filter = (lang:string|null,_lang:string) => {
    if(lang === null){
        return true;
    }else{
        if(lang === "日本語"){
            return _lang === "japan" ? true : false;
        }else if(lang === "English"){
            return _lang === "english" ? true : false;
        }else if(lang === "한국어"){
            return _lang === "korea" ? true : false;
        }else{
            return false;
        }
    }
}

function Log_Com({Log}:Log_Com_prop) {

    const [lang,setlang] = useState<string|null>(null);

    return (
        <div className="h-fit">
            <p
                    className="
                        text-[25px]
                        ml-3 mb-3
                    "
                >
                    履歴
                </p>
            <div
                className="
                    w-fit
                    h-[400px]
                    flex flex-col
                    border-1 border-[#aeaeae]
                    rounded-md
                "
            >
                
                <div
                    className="
                        min-w-[45vw] max-w-[60vw]
                        overflow-x-auto
                        flex flex-row h-[8vh]
                        border-b-1 border-[#aeaeae]
                    "
                >
                    <Select_button
                        text="All"
                        setText={(text:string)=>setlang(null)}
                    />
                    {
                        lang_conf.map(
                            (item)=>
                                <Select_button
                                    text={item.lang}
                                    setText={setlang}
                                />
                        )
                    }
                </div>
                <div
                    className="
                        flex flex-col flex-1
                        gap-4 overflow-y-auto
                        py-4 items-center
                    "
                >
                    {
                        Log
                        .filter((item)=>lang_filter(lang,item.base_language))
                        .map((item)=>{
                            return (
                                <One_log_com
                                    log={item}
                                />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

type Select_button_prop = {
    text:string;
    setText:(text:string)=>void | Dispatch<SetStateAction<string>>
}

function Select_button({text,setText}:Select_button_prop) {
    return (
        <button
            className="
                h-full w-[15vw]
                flex justify-center items-center
                border-x-1 border-[#aeaeae] cursor-pointer
                text-[16px]
                hover:text-[18px] active:text-[14px]
            "
            onClick={()=>{setText(text)}}
        >
            {text}
        </button>
    );
}

type One_log_com_prop = {
    log:log_result
}

export
function One_log_com({log}:One_log_com_prop) {

    const setResult = useResults((state)=>state.setResult);
    const setFrom = useResults((state)=>state.setFrom);
    const setTo = useResults((state)=>state.setTo);
    const setFlag = useResults((state)=>state.setLog_flag);

    const Lang_conf = useLang((state)=>state.conf);

    const onclick_func = () => {
        setResult(log.translated_sentence);
        for(const lang of lang_conf){
            if(lang_filter(lang.lang,log.base_language)){
                setFrom(lang.lang);
                break;
            }
        }
        for(const lang of lang_conf){
            if(lang_filter(lang.lang, log.translated_language)){
                setTo(lang.lang);
                break;
            }
        }
        setFlag(true);
        window.location.href = "/";
    }

    return (
        <button
            className="
                w-[80%] h-fit py-2 pl-2
                border-1 cursor-pointer
                rounded-md shadow-xl
                active:scale-95
                active:shadow-[0px]
            "
            onClick={onclick_func}
        >
            <p
                className="
                    text-[12px]
                    text-left
                "
            >
                {Lang_conf.Genbun}
            </p>
            <p
                className="
                    text-left
                    text-[20px] font-bold
                "
            >
                {log.translated_sentence[0].original}
            </p>
        </button>
    );
}