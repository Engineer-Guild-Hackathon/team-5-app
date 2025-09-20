"use client"

export
class WebSpeak {

    Speech: SpeechSynthesis | null;
    Utter : SpeechSynthesisUtterance | null;
    Pause: boolean = false;

    constructor() {
        if(typeof window !== "undefined" && "speechSynthesis" in window){
            this.Speech = window.speechSynthesis;
            this.Utter = new SpeechSynthesisUtterance();
        }else{
            this.Speech = null;
            this.Utter = null;
        }
    }

    async Stop () {
        if(this.Speech?.speaking){
            this.Speech.pause();
            await new Promise((resolve,reject)=>{
                const inter = setInterval(()=>{
                    try{
                        if(this.Speech?.paused){
                            clearInterval(inter);
                            resolve(null);
                        }
                    }catch(e){
                        reject(null);
                    }
                },10);
            })
            this.Speech.cancel();
        }
    }

    async Play (text:string,set:React.Dispatch<React.SetStateAction<boolean>>) {
        if(this.Speech && this.Utter){
            if(this.Speech.speaking){
                await this.Stop();
            }
            this.Utter.onend = (ev) => {
                set(false);
            }
            this.Utter.onerror = (ev) => {
                console.error(ev.error);
                set(false);
            }
            this.Utter.onpause = (ev) => {
                this.Pause = true;
                set(false);
            }
            this.Utter.onstart = (ev) => {
                this.Pause = false;
                set(true);
            }
            this.Utter.text = text;
            this.Speech.speak(this.Utter);
        }
    }

    change_voice(lang:string){
        if(this.Utter){
            switch (lang) {
                case "日本語":
                    this.Utter.lang = "ja-JP"
                    break;
                case "English":
                    this.Utter.lang = "en-US"
                    break;
                case "한국어":
                    this.Utter.lang = "ko-KR"
                    break;
            }
        }
    }
}