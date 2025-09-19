"use client"

import { create } from "zustand";
import { Network, get_Yomikaka_res } from "@/funcs/network";
import { Audio } from "@/funcs/audio_record";
import { WebSpeak } from "@/funcs/audio_speak";
import { useLang } from "./lang_conf";
import net_conf from "@/network.json";

export 
const network = new Network(net_conf.Adress);

export
const rec_voice = new Audio("audio/mp4");

export
const webspeak = new WebSpeak();

type useScreenState_type = {
    ScreenState:string;
    setScreenState: (state:string)=>void;
}

export
const useScreenState = create<useScreenState_type>((set)=>({
    ScreenState: "input",
    setScreenState: (condition:string) => set(()=>({ScreenState:condition}))
}));

type useResult_type = {
    From:string;
    To:string;
    Result: Array<get_Yomikaka_res>;

    setFrom: (from:string) => void;
    setTo: (to:string) => void;
    setResult: (result: Array<get_Yomikaka_res>) => void;
}

export
const useResults = create<useResult_type>((set)=>({
    From: "English",
    To: "",
    Result: [],
    
    setFrom: (from: string) => set(()=>({From:from})),
    setTo: (to:string) => set(()=>({To:to})),
    setResult: (result: Array<get_Yomikaka_res>) => set(()=>({Result:result}))
}));