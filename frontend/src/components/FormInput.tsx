import { Dispatch, SetStateAction } from "react";

type FormInput_props = {
    title:string;
    setText:(text:string)=>void | Dispatch<SetStateAction<string>>;
    password:boolean;
    className:string;
}

export
function FormInput({title,setText,password,className}:FormInput_props){

    return (
        <div className={className+" flex flex-col"}>
            <p
                className="
                    text-[15px] mb-[2px]
                "
            >
                {title}
            </p>
            <input
                className="
                    w-full
                    h-[30px]
                    border-2 border-[#cbcbcb]
                    rounded-md
                    px-3
                "
                type={password ? "password" : "text"}
                maxLength={150}
                onInput={(event)=>setText(event.currentTarget.value)}
            />
        </div>
    );
}