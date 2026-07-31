import { useState } from "react";
import type { Product, ChangeProduct } from "@/pages/Dashboard/types/types";
import type { Dispatch, SetStateAction } from "react";
import { StockService } from "@/services/stock.service";
import { ErrorToast } from "@/components/ErrorToast";
import { Overlay } from "@/components/Overlay";
import { DashboardSpinner } from "../../DashboardSpinner";
import { ApiError } from "@/utils/ApiError";

export function SaveStockButton(
    {
        productsToChange,
        setProductsToChange,
        setIsEdit,
        setSuccess,
        setStocks
    } : {
        productsToChange: ChangeProduct[],
        setProductsToChange: Dispatch<SetStateAction<ChangeProduct[]>>,
        setIsEdit: Dispatch<SetStateAction<boolean>>,
        setSuccess: Dispatch<SetStateAction<string | null>>,
        setStocks: Dispatch<SetStateAction<Product[]>>
    }) {
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSave() {
        if (productsToChange.length <= 0) {
            const error = new ApiError("Por favor, faça alterações antes de salvá-las.", "Sem alterações");
            setError(error);
            return;
        };
        
        try {
            setIsLoading(true);
            const message = await StockService.saveStock(productsToChange);
            const newStocks = await StockService.getStocks();
            setSuccess(message);
            setStocks(newStocks);
            setIsEdit(false);
            setProductsToChange([]);
        } catch {
            setError(error);
        } finally {
            setIsLoading(false);
        };
    };
    
    return (
        <>
            <button onClick={handleSave} aria-label="Salvar edições" type="button" className="bg-primary hover:bg-primary-hover active:bg-primary-active transition-all duration-200 sm:hover:-translate-y-0.5 text-button-text py-1 px-3 rounded-xl font-main text-lg">Salvar <span className="hidden sm:inline">estoque</span></button>
            <Overlay active={isLoading} />
            {isLoading && <DashboardSpinner />}
            {error && <ErrorToast error={error} onClose={setError} />} 
        </>
    );
};