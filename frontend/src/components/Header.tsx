import Image from 'next/image';
import { Dropdown } from './Dropdown';
import { useLang } from '@/hooks/lang_conf';
import { useUserID } from '@/hooks/Account';
import { useResults } from '@/hooks/States';

export
function Header() {

    const {conf, setlang} = useLang();

    const UserID = useUserID((state)=>state.ID);

    const setflag = useResults((state)=>state.setLog_flag);

    return (
        <div
            className="w-full min-h-[100px] h-[15vh] bg-white flex flex-row overflow-visible z-10 pr-5"
        >
            <div
                className="
                    h-full w-[50%]
                    relative mr-auto
                "
            >
                <Image
                    fill={true}
                    objectFit="contain"
                    className='
                        h-full object-contain object-left
                        w-[50%] cursor-pointer
                    '
                    src="/images/FURIGANA_LANGUAGE.png"
                    alt='FURIGANA LANGUAGE'
                    onClick={()=>{
                        setflag(false);
                        window.location.href = "/";
                    }}
                    unoptimized={true}
                />
            </div>
            <div
                className='
                    w-fit h-full
                    flex flex-col
                    items-center
                '
            >
                <div className='mt-3'>
                    {
                        UserID ? 
                        <div>
                            <a href='/mypage'>
                                MyPage
                            </a>
                        </div> :
                        <div>
                            <a href='/Login'>
                                Login
                            </a>/
                            <a href='/signin'>
                                signin
                            </a>
                        </div>
                    }
                </div>
                <Dropdown
                    Lang={conf.lang}
                    setLang={setlang}
                    DropDownTitle="Language Mode"
                    className="mt-2"
                />
            </div>
        </div>
    );
}