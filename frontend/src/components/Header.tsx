
import Image from 'next/image';

export
function Header() {
    return (
        <div
            className="w-full h-[97px] bg-white"
        >
            <div
                className="
                    h-full w-[50%]
                    relative
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