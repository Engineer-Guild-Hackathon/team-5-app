import { useState } from "react";

import { get_Yomikaka_res } from "@/funcs/network";

export
function useYomikataState(init_condition:string) {
    const [condition, setcondition] = useState<string>(init_condition);
    
    const [input_text, setinput_text] = useState<string>("");

    const [res_data, setres_data] = useState<Array<get_Yomikaka_res>>([]);

    return {
        condition, setcondition,
        input_text, setinput_text,
        res_data, setres_data
    }
}