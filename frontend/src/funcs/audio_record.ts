
export
class Audio {

    Media_Stream: MediaStream|null = null;
    voice_data: Blob[] = [];
    recoder: MediaRecorder|null = null;

    isRec: boolean = false;
    audio_type:string = "video/mp4";

    constructor (save_audio_type:string = "video/mp4") {
        this.audio_type = save_audio_type;
        try{
            this.confirm_use_device();
        }catch(e){
            console.error(e);
        }
    }

    async confirm_use_device() {
        try{
            this.Media_Stream = await navigator.mediaDevices.getUserMedia({audio:true})
        }catch(e){
            throw new Error("don't use voice recoder");
        }
    }

    async start_rec_voice() {

        if(!this.Media_Stream){
            try{
                await this.confirm_use_device();
            }catch(e){
                throw new Error("don't use voice recoder");
            }
        }

        if(!MediaRecorder.isTypeSupported(this.audio_type)){
            throw new Error("don't support audio type");
        }

        if(this.Media_Stream){
            this.recoder = new MediaRecorder(this.Media_Stream,{mimeType:this.audio_type});

            this.recoder.ondataavailable = (e) => {
                this.voice_data.push(e.data);
            }

            this.recoder.onstart = () => {
                console.log("rec start");
            }

            this.recoder.onstop = () => {
                console.log("rec stop");
            }

            this.recoder.start();
            this.isRec = true;
            return;
        }else{
            throw new Error("don't set Media Stream");
        }
    }

    async stop_rec_voice() {
        this.recoder?.stop();

        await new Promise((resolve, reject)=> {
            const interval = setInterval(()=>{
                if(this.voice_data.length > 0){
                    clearInterval(interval);
                    resolve(null);
                }
            },100);
        })

        this.isRec = false;

        this.recoder = null;

        let return_data:Blob | null = null;
        if(this.voice_data.length > 0){
            return_data = new Blob(this.voice_data, {type:this.audio_type});
        }

        return {
            Blob:return_data,
            type:this.audio_type
        };
    }

    delete_voice_data() {
        this.voice_data = [];
    }
}