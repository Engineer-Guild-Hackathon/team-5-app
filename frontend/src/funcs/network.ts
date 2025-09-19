
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

    async get_Yomikata(from: string, to: string, text:string) {
        try{
            if(from === to){
                throw new Error("same lang");
            }
            const TypeofTrance = return_num(from,to);
            const res = await fetch(
                this.adress + "convert/",
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

    async get_Yomikata_score(data:Blob, data_type:string) {
        try{
            console.log(`voice.${data_type.split("/")[1]}`);
            const Form_datas = new FormData();
            Form_datas.append("audio_file",data,`voice.${data_type.split("/")[1]}`);
            Form_datas.append("engine_params","-a-general");
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
}