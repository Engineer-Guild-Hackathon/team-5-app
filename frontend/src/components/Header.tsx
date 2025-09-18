
import Image from 'next/image';

export
function Header() {
    return (
        <div
            className="w-full h-[10vh] bg-white flex flex-row"
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
        </div>
    );
}