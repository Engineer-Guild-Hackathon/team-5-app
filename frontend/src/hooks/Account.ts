import { create } from "zustand";
import { persist } from "zustand/middleware";

type useUserID_type = {
    ID:string|null;
    setID:(id:string)=>void
}

export
const useUserID = create<useUserID_type>()(
    persist(
        (set,get)=>({
            ID:null,
            setID: (id:string)=>{set(()=>({ID:id}));}
        }),{
            name:"UserID"
        }
    )
);