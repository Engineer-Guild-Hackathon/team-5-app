"use client"

import { Header } from "@/components/Header";
import { SigninForm } from "@/components/SigninForm";


export default
function Login() {
    return (
        <div
            className="
                flex w-screen h-screen 
                flex-col bg-[url(/images/bg_image.png)] 
                bg-cover flex flex-col
            "
        >
            <Header/>
            <div
                className="
                    flex-1 flex items-center justify-center
                "
            >
                <SigninForm/>
            </div>
        </div>
    );
}