
import { auto_height_resize } from "@/funcs/auto_resize";
import { useRef } from "react";

export
function Input_text() {

    const text_area_ref = useRef<HTMLTextAreaElement|null>(null);

    return  (
        <div
            className="
                relative w-full rounded-[10px]
                mt-[24px] h-fit px-[16px]
                border-[1px]
                border-[#DEE1E6FF]
            "
        >
            <textarea
                className="
                    min-h-[102px] mt-[28px]
                    w-full h-auto px-[12px] py-[5px]
                    font-[14px] border-[1px] rounded-[6px]
                    border-[#DEE1E6FF]
                "
                ref={text_area_ref}
                placeholder="英文を入力してください"
                onInput={()=>{auto_height_resize(text_area_ref)}}
            />
            <button
                className="
                    mt-[12px] mb-[16px] w-full 
                    bg-emerald-400 h-[44px] rounded-[3px]
                    active:scale-[95%]
                "
                onClick={()=>{console.log("click\n")}}
            >
                <div
                    className="
                        m-auto
                        text-[12px]
                        active:scale-[95%]
                        select-none
                    "
                >
                    変換
                </div>
            </button>
        </div>
    );
}