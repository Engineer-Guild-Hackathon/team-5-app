import { RefObject } from "react"

export
function auto_height_resize(element:RefObject<HTMLTextAreaElement|null>) {
    const now_element = element.current;
    if(now_element){
        now_element.style.height = "auto";
        now_element.style.height = now_element.scrollHeight + "px";
    }
}