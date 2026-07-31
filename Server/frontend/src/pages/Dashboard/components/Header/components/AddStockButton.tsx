import type { Dispatch, SetStateAction } from "react";

export function AddStokcButton({ setIsAddStockPanelOpen }: { setIsAddStockPanelOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <button onClick={() => setIsAddStockPanelOpen(prev => !prev)} type="button" title="Adicionar estoque" aria-label="Adicionar estoque" className="hidden md:inline text-xl text-button-text py-2 px-4 rounded-xl font-main bg-primary hover:bg-button-hover active:bg-button-active transition-all duration-200 sm:hover:-translate-y-0.5">Adicionar estoque</button>
    );
};