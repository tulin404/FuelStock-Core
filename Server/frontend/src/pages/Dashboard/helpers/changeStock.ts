import type { ChangeProduct, Product } from "@dashboard/types/types";
import type { Dispatch, SetStateAction } from "react";

export function incrementStock(product: Product, setProductsToChange:  Dispatch<SetStateAction<ChangeProduct[]>>) {
    setProductsToChange(prev => {
        const existing = prev.find(changeProduct => changeProduct.id === product.product_id);

        if (existing) {
            return prev.map(changeProduct => 
                changeProduct.id === product.product_id
                ?
                {
                    ...changeProduct,
                    change: changeProduct.change + 1,
                    newStock: changeProduct.newStock + 1
                }
                :
                changeProduct
            );
        };

        return [
            ...prev,
            {
                id: product.product_id,
                change: 1,
                newStock: product.current_stock + 1
            }
        ];
    });
};

export function decrementStock(product: Product, setProductsToChange:  Dispatch<React.SetStateAction<ChangeProduct[]>>) {
    setProductsToChange(prev => {
        const existing = prev.find(changeProduct => changeProduct.id === product.product_id);

        if (existing) {
            return prev.map(changeProduct => 
                changeProduct.id === product.product_id
                ?
                {
                    ...changeProduct,
                    newStock: Math.max(changeProduct.newStock - 1, 0),
                    change: changeProduct.newStock > 0 ? changeProduct.change - 1 : changeProduct.change
                }
                :
                changeProduct
            );
        };

        return [
            ...prev,
            {
                id: product.product_id,
                newStock: Math.max(product.current_stock - 1, 0),
                change: product.current_stock > 0 ? -1 : 0
            }
        ];
    });
};