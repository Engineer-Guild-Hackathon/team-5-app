import _lang_conf from "@/gengo.json";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type lang_keys = {
    lang:string;
    Genbun:string;
    init_input_text:string;
    pronu_change:string;
    speak_test:string;
    lang_mode:string;
    Yomikata:string;
    welcome:string;
    make_account:string;
}

export
const lang_conf:lang_keys[] = _lang_conf;

type uselang_type = {
    conf:lang_keys;
    setlang: (lang:string)=>void;
}

export
const useLang = create<uselang_type>()(
    persist(
        (set, get) => ({
            conf:lang_conf[0],
            setlang: (lang:string) => {
                for(const item of lang_conf){
                    if(item.lang === lang){
                        set(()=>({conf:item}));
                        break;
                    }
                }
            }
        }),
        {
            name:"Lang_conf"
        }
    )
);