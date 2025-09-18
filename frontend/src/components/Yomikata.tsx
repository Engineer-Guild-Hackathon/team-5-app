"use client"

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useResults,useScreenState, network, rec_voice, webspeak } from "@/hooks/States";
import { useLang } from "@/hooks/lang_conf";

export
function Yomikata() {

    const results = useResults((state)=>state.Result);

    const setS_state =useScreenState((state)=>state.setScreenState); 

    return (
        <div
            className="
                w-full h-[80vh] bg-[#ffffff]
                rounded-md p-5 mt-5 flex flex-col
            "
        >
            <button
                className="
                    w-5 h-5
                    bg-[url(/images/back.svg)] bg-cover
                    active:scale-[80%]
                    mb-5
                "
                onClick={()=>setS_state("input")}
            />
            <div
                className="
                    h-[60vh] overflow-y-auto flex flex-col gap-5
                    mb-5
                "
            >
                {
                    results.map((item,idx)=>
                        <Sentence_and_Yomikata
                            text={item.original}
                            Yomikata={item.convert}
                            key={idx}
                        />
                    )
                }
            </div>
            <div
                className="h-auto flex-1"
            />
            <Test/>
        </div>
    );
}

type Sentence_and_Yomikata_Props = {
    text: string;
    Yomikata: string;
}

function Sentence_and_Yomikata({text, Yomikata}:Sentence_and_Yomikata_Props) {

    const [Play, setPlay] = useState<boolean>(false);
    const [Texts, setTexts] = useState<string[]>([]);
    const [Yomikatas, setYomikatas] = useState<string[]>([]);

    useEffect(()=>{
        setTexts(text.split(" "));
        setYomikatas(Yomikata.split(" "));
    },[text, Yomikata])

    return (
        <div
            className="
                w-full h-fit py-2 px-5 self-center
                flex flex-row justify-center
                shadow-lg rounded-2xl border-1 border-[#cacaca]
            "
        >
            <div
                className="
                    flex flex-row flex-wrap
                    gap-2 mr-[2px]
                "
            >
                {
                    Texts.map((word,idx)=>{
                        return (
                            <div
                                className="
                                    h-fit w-fit
                                    flex flex-col items-center
                                "
                                key={idx}
                            >
                                <div
                                    className="
                                        h-fit w-fit
                                        text-[20px]
                                    "
                                >
                                    {word}
                                </div>
                                <div
                                    className="
                                        h-fit w-fit
                                        text-[18px]
                                    "
                                >
                                    {Yomikatas[idx+1]}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <button
                className={`
                    min-w-[50px] min-h-[50px]
                    w-fit h-fit
                    rounded-full
                    border-1 mr-2 ml-auto self-center
                    border-[#cacaca] active:scale-95
                `}
                onClick={()=>{
                    if(!Play){
                        webspeak.Play(text,setPlay);
                    }else{
                        webspeak.Stop();
                    }
                }}
            >
                <Image
                    src={`/images/${Play ? "on" : "off"}_speaker.svg`}
                    alt={Play ? "on Play" : "off Play"}
                    width={50}
                    height={50}
                />
            </button>
        </div>
    );
}

function Test() {

    const [Rec,setRec] = useState<boolean>(false);
    const [Score, setScore] = useState<number|null>(null);
    const lang_conf = useLang((state)=>state.conf);

    const click_func = async () => {
        try{
            if(!Rec){
                rec_voice.start_rec_voice();
                setRec(true);
            }else{
                const voice_data = await rec_voice.stop_rec_voice();
                setRec(false);
                if(voice_data.Blob){
                    const result = await network.get_Yomikata_score(voice_data.Blob, voice_data.type);
                    let sum = 0;
                    result.results.forEach((item)=>{
                        sum += item.confidence;
                    });
                    setScore(sum/result.results.length);
                }
            }
        }catch(e){
            setRec(false);
            console.error(e);
        }
    }

    return (
        <div
            className="
                h-[10vh] w-full
            "
        >
            <p
                className="
                    text-[15px]
                "
            >
                {lang_conf.speak_test}
            </p>
            <div
                className="
                    h-auto w-full
                    flex flex-row items-center
                    mt-2.5
                "
            >
                <button
                    className={`
                        rounded-full w-[40px] h-[40px]
                        border-1 border-[#eaeaea]
                        ml-5 active:scale-95 relative
                    `}
                    style={{background:Rec ? "#00ff00" : "#FFFFFF"}}
                    onClick={click_func}
                >
                    <Image
                        src="/images/mic.svg"
                        alt="mic"
                        fill={true}
                    />
                </button>
                <p
                    className="
                        text-[30px]
                        border-1 border-[#eaeaea]
                        rounded-md ml-20 px-3
                    "
                >
                    Score:　{Score}
                </p>
            </div>
        </div>
    );
}