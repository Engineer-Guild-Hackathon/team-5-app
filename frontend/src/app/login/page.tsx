"use client"

import { Header } from "@/components/Header";
import { Login_Form } from "@/components/LoginForm";


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
                <Login_Form/>
            </div>
        </div>
    );
}