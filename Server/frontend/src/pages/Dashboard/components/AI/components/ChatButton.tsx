import { Bot } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

export function ChatButton({ setIsAIOpen }: { setIsAIOpen: Dispatch<SetStateAction<boolean>> }) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        
        function handleScroll() {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 0) {
                setHidden(false);
            } else if (currentScrollY > lastScrollY) {
                setHidden(true);
            } else {
                setHidden(false);
            };

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    return (
        <button
        onClick={() => setIsAIOpen(true)}
        className={`
            ${hidden ? "translate-y-32 pointer-events-none" : "translate-y-0"}
            fixed bottom-1.5 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 w-max sm:w-auto items-center justify-center will-change-transform rounded-full text-button-text px-6 py-3 bg-primary sm:hover:shadow-primary shadow-[0_0_5px_var(--color-primary)] sm:hover:shadow-[0_0_20px_var(--color-primary)] sm:hover:scale-105 active:bg-button-active! active:scale-100! transition-all duration-200
        `}
        >
            <Bot size={38} />
            <span className="font-main text-xl sm:text-2xl font-medium">Analisar com IA</span>
        </button>
    );
};