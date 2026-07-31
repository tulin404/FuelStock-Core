import { Overlay } from "@/components/Overlay";
import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { DashboardSpinner } from "../../DashboardSpinner";
import { ErrorToast } from "@/components/ErrorToast";
import { createPortal } from "react-dom";
import { uploadStock } from "@/pages/Dashboard/actions/uploadStock";
import { StockService } from "@/services/stock.service";
import type { Product } from "@dashboard/types/types";

export function AddStockPanel(
    {
        setIsAddStockPanelOpen,
        setStocks,
        setSuccess
    }:
    {
        setIsAddStockPanelOpen: Dispatch<SetStateAction<boolean>>,
        setStocks: Dispatch<SetStateAction<Product[] | null>>,
        setSuccess: Dispatch<SetStateAction<string | null>>
    }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const root = document.getElementById("root");
    const modalRoot = document.getElementById("modal-root");

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
    
    async function handleAdd(formData: FormData) {
        try {
            setIsLoading(true);
            const message = await uploadStock(formData);
            const newStocks = await StockService.getStocks();
            setSuccess(message);
            setStocks(newStocks);
            setIsAddStockPanelOpen(false);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        };
    };
    
    return createPortal(
        <>
            <form action={handleAdd} className={`${hasLoaded ? "scale-100 opacity-100" : "scale-0 opacity-0"} fixed top-1/2 left-1/2 -translate-1/2 flex flex-col justify-center items-center gap-7 transition-all duration-400 z-30 bg-surface px-4 py-6 rounded-xl w-100 shadow-xs`}>
                <div className="flex flex-col gap-2">
                    <h2 className="text-text font-main text-3xl font-semibold self-center">Adicionar Estoque</h2>
                    <p className="text-text font-secondary">Adicione um <strong>documento .xls com o formato esperado</strong> para adicionar um novo estoque.</p>
                </div>
                <div>
                    {!file && <label htmlFor="file" className="cursor-pointer text-text font-secondary border-2 border-border rounded-lg px-2 py-1 bg-background">Selecionar arquivo</label>}
                    {file && <span className="text-text font-secondary">{file.name}</span>}
                    <input name="file" id="file" type="file" accept=".xls, application/vnd.ms-excel" onChange={(e) => setFile(e.target.files[0] ?? null)} className="hidden" />
                </div>
                <div className="flex flex-col w-full items-center gap-2">
                    <button type="submit" aria-label="Enviar estoque" className={`${file ? "bg-button hover:bg-button-hover active:bg-button-active text-button-text" : "bg-background text-text-disabled"} w-[90%] py-2 font-secondary font-semibold rounded-lg transition-colors duration-200`}>Enviar</button>
                    <button type="button" onClick={() => setIsAddStockPanelOpen(false)} className="bg-surface text-text-muted py-1 lg:py-1.5 w-[90%] text-sm rounded-lg self-center font-secondary hover:bg-background transition-colors duration-200">Cancelar</button>
                </div>
            </form>
            
            <Overlay active={isLoading} variant="modal" />
            {isLoading && <DashboardSpinner />}
            {error && <ErrorToast error={error} onClose={setError} />}
        </>,
        modalRoot
    );
};