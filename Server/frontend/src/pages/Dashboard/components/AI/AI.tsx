import type { Dispatch, SetStateAction } from "react";
import type { AIAnalysis } from "@dashboard/types/types";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Orbit, X } from "lucide-react";
import { AIService } from "@/services/ai.service";
import { Markdown } from "./components/Markdown";

const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    month: 'numeric'
});

export function AI({ setIsAIOpen, AIAnalyses, setAIAnalyses }: { setIsAIOpen: Dispatch<SetStateAction<boolean>>, AIAnalyses: AIAnalysis[], setAIAnalyses: Dispatch<SetStateAction<AIAnalysis[] | null>> }) {
    const root = document.getElementById("root");
    const AIRoot = document.getElementById("ai-root");

    const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null | "home">("home");
    const [newAnalysis, setNewAnalysis] = useState<AIAnalysis | null>(() => AIAnalyses[0]?.month >= Number(formatter.format(new Date())) - 1 ? AIAnalyses[0] : null);
    const [displayedText, setDisplayedText] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    const [hasLoaded, setHasLoaded] = useState(false);

    const closeTimeout = useRef<number | null>(null);

    const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"] as const;

    // OPEN ANIMATION
    useEffect(() => {
        const animate = setTimeout(() => {
            setHasLoaded(true);
        }, 50);
        root.setAttribute("inert", "");
        document.documentElement.classList.add("overflow-hidden");

        return () => {
            clearTimeout(animate);
            root.removeAttribute("inert");
            document.documentElement.classList.remove("overflow-hidden");
        };
    }, [root]);

    // CLEAR TIMEOUT JUST FOR CLEAN CODE
    useEffect(() => {
        return () => closeTimeout.current && clearTimeout(closeTimeout.current);
    }, []);

    // TYPING ANIMATION
    useEffect(() => {
        if (!selectedAnalysis || selectedAnalysis === "home") {
            setDisplayedText(""); // eslint-disable-line
            return;
        };

        let i = 0;
        const words = selectedAnalysis.analysis_text.split(" ");

        const typingInterval = window.setInterval(() => {
            i += 1;

            setDisplayedText(words.slice(0, i).join(" "));

            if (i >= words.length) {
                clearInterval(typingInterval);
            };
        }, 40);

        return () => clearInterval(typingInterval);
    }, [selectedAnalysis]);

    function closeAI() {
        setHasLoaded(false);
        closeTimeout.current = setTimeout(() => {
            setIsAIOpen(false);
        }, 600);
    };

    async function handleNewAnalysis() {
        if (newAnalysis) {
            setSelectedAnalysis(AIAnalyses[0]);
            return;
        };
        setSelectedAnalysis(null);
        const fakeAnalysis: AIAnalysis = {
            year: null,
            month: null,
            analysis_text: null
        };
        setAIAnalyses(prevAnalyses => [...prevAnalyses, fakeAnalysis]);
        try {
            const data = await AIService.generateAnalysis();
            setNewAnalysis(data);
            setAIAnalyses(prevAnalyses => [...prevAnalyses.slice(0, -1), data]);
            setSelectedAnalysis(data);
        } catch (error) {
            const errorAnalysis: AIAnalysis = {
                year: null,
                month: null,
                analysis_text: error.message
            };
            setAIAnalyses(prevAnalyses => [...prevAnalyses.slice(0, -1), errorAnalysis]);
            setSelectedAnalysis(errorAnalysis);
            setIsDisabled(true);
        };
    };

    return createPortal(
        <section className={`${hasLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-40"} fixed inset-0 flex flex-col bg-red-200 z-40 transition-all duration-600 will-change-transform overflow-clip max-h-dvh`}>
            <div className="relative py-6 md:py-8 flex justify-center items-center bg-surface shadow-md z-20">
                <h2 className="font-main font-medium text-text text-3xl">Chat</h2>
                <button onClick={closeAI} className="absolute right-6 md:right-8"><X size={28} /></button>
            </div>
            <div className="size-full min-h-0 flex">
                <div className="hidden lg:flex bg-surface w-52 xl:w-58 h-full shadow-sm pl-4 pr-4 z-10 flex-col gap-12">
                    <button
                        onClick={() => setSelectedAnalysis("home")}
                        className={`
                            ${selectedAnalysis === "home" ? "bg-text-disabled/15" : "sm:hover:bg-text-disabled/10 active:bg-text-disabled/20!"}
                            flex items-center w-full font-main gap-2 text-xl mt-16 rounded-lg pl-2 py-1 transition-colors duration-200
                        `}
                    >
                        <Orbit className="text-primary animate-[spin_6s_linear_infinite]" size={20} />
                        <span className="text-text">Início</span>
                    </button>
                    {AIAnalyses.length > 0 &&
                        <div className="flex flex-col">
                            <span className="relative w-min text-text text-xl font-main font-medium pl-2 py-1 after:bg-background after:h-0.5 after:absolute after:left-0 after:-right-7 after:-bottom-1 after:rounded-full">Análises</span>
                            <div className="mt-2 flex flex-col gap-px">
                                {AIAnalyses.map(analysis => 
                                    analysis.month && analysis.year
                                        ?
                                        <button
                                            key={`${analysis.month}/${analysis.year}`}
                                            onClick={() => setSelectedAnalysis(analysis)}
                                            className={`
                                                ${selectedAnalysis === analysis ? "bg-text-disabled/15" : "sm:hover:bg-text-disabled/10 active:bg-text-disabled/20!"}
                                                text-text pl-2 py-1 rounded-lg font-main w-full text-left transition-colors duration-200
                                            `}
                                        >
                                            Análise de {
                                                MONTHS[analysis.month - 1].length >= 5
                                                ?
                                                MONTHS[analysis.month - 1].slice(0, 3)
                                                :
                                                MONTHS[analysis.month - 1]
                                            }/{analysis.year}
                                        </button>
                                        :
                                        <button
                                            key={crypto.randomUUID()}
                                            onClick={() => setSelectedAnalysis(analysis)}
                                            className={`
                                                ${selectedAnalysis === analysis ? "bg-text-disabled/15" : "sm:hover:bg-text-disabled/10 active:bg-text-disabled/20!"}
                                                text-text pl-2 py-1 rounded-lg font-main w-full text-left transition-colors duration-200
                                            `}
                                        >
                                            Nova análise
                                        </button>
                                )}
                            </div>
                        </div>
                    }
                </div>
                {!selectedAnalysis
                    ?
                    <div className="w-full bg-background overflow-y-scroll">
                        <div className="flex flex-col gap-4 px-6 py-4">
                            <div className="flex justify-end">
                                <span className="max-w-[85%] sm:max-w-[75%] rounded-2xl bg-surface px-4 py-3 text-text text-[15px] leading-7">Preciso de uma análise completa das vendas deste mês. Me mostre os principais insights do negócio, riscos, oportunidades de crescimento e ações práticas que eu deveria tomar para aumentar o lucro da loja.</span>
                            </div>
                            
                            <div className="flex justify-start">
                                {newAnalysis
                                    ?
                                    <p className="sm:max-w-[75%] h-min rounded-2xl sm:bg-surface px-4 py-3 text-text whitespace-pre-wrap"></p>
                                    :
                                    <div className="flex flex-col gap-1 justify-start">
                                        <span className="flex items-center gap-1 text-primary/60 font-main font-medium">
                                            Analisando
                                            <div className="flex gap-px">
                                                <span className="animate-bounce">.</span>
                                                <span className="animate-bounce [animation-delay:150ms]">.</span>
                                                <span className="animate-bounce [animation-delay:300ms]">.</span>
                                            </div>
                                        </span>
                                        <Orbit size={26} className="text-primary animate-[spin_6s_linear_infinite,pulse_2s_ease-in-out_infinite]" />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    selectedAnalysis === "home"
                    ?
                    <div className="relative size-full bg-background flex flex-col items-center justify-center gap-6 pb-32">
                        <Orbit className="text-primary animate-[spin_6s_linear_infinite,pulse_2s_ease-in-out_infinite]" size={40} />
                        <div className="flex flex-col items-center justify-center gap-3 z-20">
                            <h3 className="text-5xl font-main font-semibold text-text text-center pl-1">Análises Inteligentes</h3>
                            <h4 className="text-lg max-w-160 text-center text-pretty font-secondary tracking-tight">
                                Descubra <i className="text-primary font-semibold">padrões de vendas</i>, <i className="text-primary font-semibold">comportamento do estoque </i>
                                e <i className="text-primary font-semibold">oportunidades de melhoria</i> automaticamente com <span className="text-primary font-semibold">IA</span>.
                            </h4>
                        </div>
                        <button onClick={handleNewAnalysis} className={`${isDisabled ? "hidden pointer-events-none" : "block pointer-events-auto"} text-button-text shadow-[0_6px_18px_rgba(244,128,4,0.20),0_0_30px_rgba(244,128,4,0.12)] bg-button sm:hover:shadow-[0_10px_28px_rgba(244,128,4,0.28),0_0_40px_rgba(244,128,4,0.18)] sm:hover:scale-105 sm:active:scale-100 active:scale-95 active:bg-button-active rounded-xl text-2xl font-semibold px-6 py-2 transition-all duration-200 mt-6`}>Gerar análise</button>
                        
                        {/* GRADIENTS */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,128,4,0.10),transparent_25%)] pointer-events-none"/>
                        <div className="absolute left-1/2 top-1/2 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl pointer-events-none"/>
                    </div>
                    :
                    <div className="w-full bg-background overflow-y-scroll">
                        <div className="flex flex-col gap-4 px-6 py-4">
                                <div className="flex justify-end">
                                    <span className="max-w-[85%] sm:max-w-[75%] rounded-2xl bg-surface px-4 py-3 text-text">Preciso de uma análise completa das vendas deste mês. Me mostre os principais insights do negócio, riscos, oportunidades de crescimento e ações práticas que eu deveria tomar para aumentar o lucro da loja.</span>
                                </div>
                            
                                <div className="flex sm:justify-start justify-center">
                                    <Markdown displayedText={displayedText} />
                                </div>
                            </div>
                    </div>
                }
            </div>
        </section>,
        AIRoot
    );
};