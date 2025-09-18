"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useResults,useScreenState, network, rec_voice } from "@/hooks/States";
import { WebSpeak } from "@/funcs/audio_speak";

const webspeak = new WebSpeak();

export
function Yomikata() {
    return (
        <div
            className="
                w-full h-fit bg-[#ffffff]
                rounded-md p-5 mt-5
                flex flex-col gap-5 items-center
            "
        >
            <Sentence_and_Yomikata
                text="My Name is Kazuto."
                Yomikata="ﾏｲ ﾈｲﾑ ｲｽﾞ ｶｽﾞｨｭｵｳ ﾅｲｽ ﾀ ﾐｯ ﾕ"
            />
            <Sentence_and_Yomikata
                text="My Name is Kazuto. Nice To meet you."
                Yomikata="ﾏｲ ﾈｲﾑ ｲｽﾞ ｶｽﾞｨｭｵｳ ﾅｲｽ ﾀ ﾐｯ ﾕ"
            />
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
                w-full h-fit p-2
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
                                    {Yomikatas[idx]}
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
                `}
                onClick={()=>{
                    if(!Play){
                        webspeak.Play(text, setPlay);
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