import { useLang } from "@/hooks/lang_conf";
import { FormInput } from "./FormInput";
import { useState } from "react";
import { network } from "@/hooks/States";
import { useUserID } from "@/hooks/Account";

export
function SigninForm() {

    const lang_conf = useLang((state)=>state.conf);

    const setID = useUserID((state)=>state.setID);

    const [UserName,setUserName] = useState<string>("");
    const [Email,setEmail] = useState<string>("");
    const [Password,setPassword] = useState<string>("");
    const [ConPassword,setConPassword] = useState<string>("");

    const onSignin = async () => {
        try{
            if(Password !== ConPassword){
                alert(lang_conf.ReinputPass);
                return;
            }
            const result = await network.send_signin(
                UserName, Email, Password
            );
            setID(result);
            window.location.href = "/mypage";
        }catch(e){
            alert(lang_conf.CantSignin);
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
                {lang_conf.welcome}
            </p>
            <p
                className="
                    text-[20px] ml-2
                "
            >
                {lang_conf.make_account}
            </p>
            <div
                className="
                    flex flex-col h-fit
                    mt-5 p-5
                    border-1 border-[#eaeaea]
                    shadow-2xl rounded-2xl gap-3
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
                    title="Email"
                    setText={setEmail}
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
                <FormInput
                    title="Confirm Password"
                    setText={setConPassword}
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
                onClick={onSignin}
            >
                {lang_conf.Touroku}
            </button>
            <a
                href="/Login"
                className="
                    w-fit h-fit ml-2
                    text-[18px]
                    hover:text-blue-300
                    hover:border-blue-300
                    hover:border-b-1
                "
            >
                {lang_conf.GoLogin}
            </a>
        </div>
    );
}