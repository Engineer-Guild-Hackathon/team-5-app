import Image from 'next/image';
import { Dropdown } from './Dropdown';
import { useLang } from '@/hooks/lang_conf';

export
function Header() {

    const {conf, setlang} = useLang();

    return (
        <div
            className="w-full h-[10vh] bg-white flex flex-row overflow-visible z-10 pr-2.5"
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
                        w-[50%]
                    '
                    src="/images/FURIGANA_LANGUAGE.png"
                    alt='FURIGANA LANGUAGE'
                />
            </div>
            <Dropdown
                Lang={conf.lang}
                setLang={setlang}
                DropDownTitle="Language Mode"
            />
        </div>
    );
}