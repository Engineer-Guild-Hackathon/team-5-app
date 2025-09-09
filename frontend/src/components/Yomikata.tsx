import React, { useState } from "react";

type read_type = {
    Genbun: string;
    Yomikata: string;
};

export
function Yomikata() {

    const text_list = useState<Array<read_type>>([]);

    return (
        <div
            className="
                w-full min-h-[276px] p-[16px] mt-[24px]
                border-[1px] rounded-[6px] border-[#DEE1E6FF]
            "
        >
            <div
                className="
                    flex items-center flex-row
                    border-1 gap-2
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
                <svg className="h-8 w-8 text-gray-950"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
                <div
                    className="
                        w-fit h-fit
                        text-[25px] font-bold
                    "
                >
                    日本語
                </div>
            </div>
            <Genbun_text/>
        </div>
    );
}

type Genbun_text_props = {
    text:string
}

function Genbun_text({text}:Genbun_text_props){
    return (
        <div>
            {text}
        </div>
    );
}

type Yomikata_text_props = {
    text:string
}

function Yomikata_text({text}:Yomikata_text_props){
    return (
        <div>
            {text}
        </div>
    );
}