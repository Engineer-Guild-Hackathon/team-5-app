import { useLang } from "@/hooks/lang_conf";
import { Dispatch, SetStateAction } from "react";

export
function Login_Form() {

    const lang_conf = useLang((state)=>state.conf);

    return (
        <div
            className="
                w-[70vw] h-[80vh]
                rounded-2xl shadow-2xl border-1 border-[#eaeaea] 
                bg-[#FFFFFF]
                flex flex-col px-5 py-2
            "
        >
            <p
                className="
                    text-[60px] font-bold
                    bg-gradient-to-bl from-green-300 via-red-300 to-blue-300
                    bg-clip-text text-transparent
                "
            >
                {lang_conf.welcome}
            </p>
            <p
                className="
                    text-[20px] ml-2
                "
            >
                {lang_conf.make_account}
            </p>
            <FormInput
                title="Email"
                setText={(text:string)=>{}}
                password={false}
                className="
                    
                "
            />
        </div>
    );
}

type FormInput_props = {
    title:string;
    setText:(text:string)=>void | Dispatch<SetStateAction<string>>;
    password:boolean;
    className:string;
}

function FormInput({title,setText,password,className}:FormInput_props){

    return (
        <div className={className+" flex flex-col"}>
            <p
                className="
                    text-[10px]
                "
            >
                {title}
            </p>
            <input
                className="
                    min-w-[70px] h-[30px]
                "
            />
        </div>
    );
}