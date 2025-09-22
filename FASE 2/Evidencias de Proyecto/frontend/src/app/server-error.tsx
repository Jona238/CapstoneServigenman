'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { JSX } from 'react/jsx-dev-runtime'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}): JSX.Element {
    const router = useRouter()

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-lg w-full text-center sm:text-left">
                {/* Número 500 */}
                <div className="mb-8">
                    <h1 className="text-9xl font-extrabold text-foreground/10 dark:text-white/[.06] select-none">
                        500
                    </h1>
                </div>

                {/* Mensaje principal */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        ¡Error del servidor!
                    </h2>
                    <ol className="font-mono list-inside list-decimal text-sm/6 text-foreground/70">
                        <li className="mb-2 tracking-[-.01em]">
                            Ha ocurrido un error interno en el servidor.
                        </li>
                        <li className="tracking-[-.01em]">
                            Por favor, intenta de nuevo más tarde.
                        </li>
                    </ol>
                </div>
                {/* Botones de acción con el estilo de la página principal */}
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <button
                        onClick={() => reset()}
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Reintentar
                    </button>

                    <Link
                        href="/"
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Ir al inicio
                    </Link>
                </div>
            </main>
        </div>
    )
}