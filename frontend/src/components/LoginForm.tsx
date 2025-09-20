import { useLang } from "@/hooks/lang_conf";
import { useState } from "react";
import { FormInput } from "./FormInput";
import { useUserID } from "@/hooks/Account";
import { network } from "@/hooks/States";

export
function Login_Form() {

    const lang_conf = useLang((state)=>state.conf);

    const [UserName, setUserName] = useState<string>("");
    const [Password, setPassword] = useState<string>("");
    const {ID,setID} = useUserID();

    const onLogin = async () => {
        try{
            const id = await network.send_login(UserName, Password);
            setID(id);
            window.location.href = "/mypage";
        }catch(e){
            alert(lang_conf.CantLogin);
        }
    }

    return (
        <div
            className="
                w-[80vw] h-fit
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
                {lang_conf.Ohayo}
            </p>
            <p
                className="
                    text-[20px] ml-2
                "
            >
                {lang_conf.Okaeri}
            </p>
            <div
                className="
                    flex flex-col h-fit
                    mt-5 p-5
                    border-1 border-[#eaeaea]
                    shadow-2xl rounded-2xl gap-5
                "
            >
                <FormInput
                    title="UserName"
                    setText={setUserName}
                    password={false}
                    className="
                        self-center min-w-[70px] w-[60vw]
                    "
                />
                <FormInput
                    title="Password"
                    setText={setPassword}
                    password={true}
                    className="
                        self-center min-w-[70px] w-[60vw]
                    "
                />
            </div>
            <button
                className="
                    mt-3
                    self-center
                    flex items-center justify-center
                    w-[150px] h-[50px] bg-[#91ff91]
                    rounded-md cursor-pointer
                    active:scale-95
                "
                onClick={onLogin}
            >
                {lang_conf.GoMyPage}
            </button>
            <a
                href="/signin"
                className="
                    w-fit h-fit ml-2 mt-2
                    text-[18px]
                    hover:text-blue-300
                    hover:border-blue-300
                    hover:border-b-1
                "
            >
                {lang_conf.make_account}
            </a>
        </div>
    );
}