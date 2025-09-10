
export
type get_Yomikaka_res = {
    original:string;
    convert:string;
}

export
class Network {
    adress:string;

    constructor (adress:string) {
        this.adress = adress;
    }

    async get_Yomikata(lang: string, text:string) {
        try{
            const res = await fetch(
                this.adress + "convert/",
                {
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body:JSON.stringify({
                        "convert_number":2,
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

}