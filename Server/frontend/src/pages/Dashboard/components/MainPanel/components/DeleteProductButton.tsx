import type { Dispatch, SetStateAction } from "react";
import type { Product } from "@/pages/Dashboard/types/types";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Overlay } from "@/components/Overlay";
import { ErrorToast } from "@/components/ErrorToast";
import { DashboardSpinner } from "../../DashboardSpinner";
import { StockService } from "@/services/stock.service";

export function DeleteProductButton({ product, setStocks, setSuccess }: { product: Product, setStocks: Dispatch<SetStateAction<Product[] | null>>, setSuccess: Dispatch<SetStateAction<string | null>> }) {
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete() {
        try {
            setIsLoading(true);
            const message = await StockService.deleteProduct(product.product_id);
            setSuccess(message);
            setStocks(prev => prev.filter(prevProduct => prevProduct.product_id !== product.product_id));
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <>
            <button onClick={handleDelete} type="button" aria-label="Deletar produto"><Trash2 className="text-danger" /></button>
            <Overlay active={isLoading} />
            {isLoading && <DashboardSpinner />}
            {error && <ErrorToast error={error} onClose={setError} />}
        </>
    );
};