import { it } from "node:test";

export
type get_Yomikaka_res = {
    original:string;
    convert:string;
}

type score_detail = {
    token:any,
    confidence:number,
}

export
type get_Yomikata_score_res = {
    results:score_detail[],
}

export
type log_res = {
    Id:string;
    translated_sentence:string;
    base_language:string;
    translated_language:string;
}

export
type log_result = {
    Id:string;
    translated_sentence:get_Yomikaka_res[];
    base_language:string;
    translated_language:string;
}

const return_num = (from:string,to:string)=>{
    if(from === "日本語"){
        if(to === "English"){
            return 3
        }else if(to === "한국어"){
            return 4
        }
    }else if(from === "한국어"){
        if(to === "日本語"){
            return 6
        }else  if(to === "English"){
            return 5
        }
    }else if(from === "English"){
        if(to === "日本語"){
            return 1
        }else if(to === "한국어"){
            return 2
        }
    }else{
        return 0
    }
}

export
class Network {
    adress:string;

    constructor (adress:string) {
        this.adress = adress;
    }

    async get_Yomikata(from: string, to: string, text:string, id:string|null = null) {
        try{
            if(from === to){
                throw new Error("same lang");
            }
            const TypeofTrance = return_num(from,to);
            let send_adress = this.adress + "convert/";
            if(id){
                send_adress += `?Id=${id}`
            }
            send_adress = encodeURI(send_adress);
            const res = await fetch(
                send_adress,
                {
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body:JSON.stringify({
                        "convert_number":TypeofTrance,
                        "sentence":text
                    })
                }
            )
            if(res.ok){
                const result:Array<get_Yomikaka_res> = await res.json();
                return result;
            }else{
                const Error_text:string = await res.text();
                throw new Error(`Statue: ${res.status}\nMessage: ${Error_text}`)
            }
        }catch(error){
            throw new Error(`Error: ${error}`);
        }
    }

    async get_Yomikata_score(data:Blob, data_type:string, From:string) {
        try{
            const Form_datas = new FormData();
            Form_datas.append("audio_file",data,`voice.${data_type.split("/")[1]}`);
            if(From === "日本語"){
                Form_datas.append("engine_params","-a-general");
            }else if(From === "한국어"){
                Form_datas.append("engine_params","-a-general-ko");
            }else{
                Form_datas.append("engine_params","-a-general-en");
            }
            const res = await fetch(
                this.adress + "pronunciation-assessment-en/",
                {
                    method:"POST",
                    body: Form_datas
                }
            )
            if(res.ok){
                const result_data:get_Yomikata_score_res = await res.json();
                return result_data;
            }else{
                const Error_text:string = await res.text();
                throw new Error(`Statue: ${res.status}\nMessage: ${Error_text}`);
            }
        }catch(e){
            throw new Error("error occer");
        }
    }

    async send_login(user_name:string, password:string) {
        try{
            const send_adress = this.adress + `login/?user_name=${user_name}&passward=${password}`
            const enc_send_adress = encodeURI(send_adress);
            const res = await fetch(
                enc_send_adress,{
                    method:"POST",
                }
            );
            if(res.ok){
                const result = await res.json();
                return result;
            }else{
                const Etext = await res.text();
                throw new Error(Etext); 
            }
        }catch(e){
            throw new Error("error occer");
        }
    }

    async send_signin(
        user_name:string, email:string, password:string
    ){
        try{
            const send_adress = this.adress + `signup/?email=${email}&user_name=${user_name}&passward=${password}`
            const enc_send_adress = encodeURI(send_adress);
            const res = await fetch(
                enc_send_adress,{
                    method:"POST"
                }
            )
            if(res.ok){
                const result = await res.json();
                return result;
            }else{
                throw new Error(await res.text());
            }
        }catch(e){
            throw new Error("error occer");
        }
    }

    async get_log(id:string) {
        try{
            const send_adress = encodeURI(this.adress + `return_log/?id=${id}`);
            const res = await fetch(
                send_adress,{
                    method:"POST"
                }
            )
            if(res.ok){
                const _result:log_res[] = await res.json();
                const result:log_result[] = _result.map((item)=>({
                    ...item,
                    translated_sentence: JSON.parse(item.translated_sentence),
                }));
                return result;
            }else{
                throw new Error(await res.text());
            }
        }catch(e){
            throw new Error("error occer");
        }
    }
}