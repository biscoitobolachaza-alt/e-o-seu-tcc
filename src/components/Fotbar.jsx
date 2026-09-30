import Image from 'next/image'

export default function Aura67() {
    return (
        <div className="flex items-center gap-2">
            <Image
                src="/angulo-esquerdo.png"
                width={50}
                height={50}
                alt="Seta para a esquerda"
                priority
            />
            <Image
                src="/angulo-direito.png"
                width={50}
                height={50}
                alt="Seta para a direita"
                priority
            />
        </div>
    )
}