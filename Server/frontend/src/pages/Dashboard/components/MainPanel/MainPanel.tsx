import { useState } from "react";
import { Pencil, X } from "lucide-react";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";
import type { Sorts, Product, ChangeProduct } from "@dashboard/types/types";
import { productSorter } from "@dashboard/helpers/productSorter";
import { decrementStock, incrementStock } from "@dashboard/helpers/changeStock";
import { SortNameButton } from "./components/SortNameButton";
import { SortStockButton } from "./components/SortStockButton";
import { SortSoldButton } from "./components/SortSoldButton";
import { SortRevenueButton } from "./components/SortRevenueButton";
import { SortProfitButton } from "./components/SortProfitButton";
import { SortMarginButton } from "./components/SortMarginButton";
import { Badge } from "./components/Badge";
import { DeleteProductButton } from "./components/DeleteProductButton";
import { SuccessToast } from "@/components/SuccessToast";
import { SaveStockButton } from "./components/SaveStockButton";
import { CategoryDropdown } from "./components/CategoryDropdown";
import { useAuthStore } from "@/stores/auth.store";

export function MainPanel(
    {
        stocks,
        setStocks,
        isEdit,
        setIsEdit,
        filters,
        setFilters,
        categories
    }:
    {
        stocks: Product[] | null,
        setStocks: Dispatch<SetStateAction<Product[] | null>>,
        isEdit: boolean,
        setIsEdit: Dispatch<SetStateAction<boolean>>,
        filters: string[],
        setFilters: Dispatch<SetStateAction<string[]>>,
        categories: Set<string>
    }) {
    const [limit, setLimit] = useState(15);
    const [sortType, setSortType] = useState<Sorts | null>(null);
    const [search, setSearch] = useState("");
    const [productsToChange, setProductsToChange] = useState<ChangeProduct[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const isAdmin = useAuthStore((state) => state.user.role === "admin");

    const filtered = filters.length > 0 ? stocks.filter(product => filters.includes(product.product_category)) : stocks;
    const searched = filtered.filter(product => product.product_name.toLowerCase().includes(search.toLowerCase()));
    const sorted = productSorter(searched, sortType);

    function handleSearch(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.currentTarget.value);
    };
    
    return (
        <section className="bg-surface rounded-xl p-6 sm:p-10 md:p-12 shadow-xs w-full sm:w-auto h-min border-2 border-border sm:hover:border-border-hover transition-colors duration-200 mt-8 sm:mt-0">
            <header className="flex gap-12 justify-between">
                <h1 className="font-main text-3xl md:text-4xl font-semibold text-text">Visão de Produtos</h1>
                {isEdit
                    ?
                    (<div className="flex items-center gap-4">
                        <SaveStockButton productsToChange={productsToChange} setProductsToChange={setProductsToChange} setIsEdit={setIsEdit} setSuccess={setSuccess} setStocks={setStocks} />
                        <button title="Cancelar edição" aria-label="Cancelar edições" type="button" onClick={() => { setIsEdit(prev => !prev); setProductsToChange([]); }} className="transition-all duration-200 text-text-muted hover:-translate-y-0.5 hover:text-text"><X /></button>
                    </div>)
                    :
                    <button title="Editar estoque" aria-label="Editar estoque" type="button" onClick={() => setIsEdit(prev => !prev)} className="text-text-muted hover:text-text hover:-translate-y-0.5 transition-all duration-200"><Pencil /></button>
                }
            </header>

            <nav className="py-6 flex justify-between items-center relative gap-4">
                <input
                onChange={handleSearch}
                type="text"
                placeholder="Pesquisar produto..."
                className="bg-background w-full sm:w-[80%] text-sm px-2 py-1 border-2 border-border rounded-full placeholder:text-text-disabled"
                />
                <CategoryDropdown categories={categories} setFilters={setFilters} filters={filters} />
            </nav>

            <section>
              <table className="w-full border-collapse border-b-0">
                  <thead>
                      <tr className="border-b-2 border-b-border text-left">
                          <th className="font-secondary font-semibold text-lg px-4 pb-1.5">
                              <div className="flex items-center sm:justify-between gap-2 sm:gap-4">
                                  <span>Produto</span>
                                  <SortNameButton onClick={setSortType} sortType={sortType} />
                              </div>
                          </th>
                          <th className="font-secondary font-semibold text-lg px-4 pb-1.5">
                              <div className="flex items-center sm:justify-between gap-2 sm:gap-4">
                                  <span>Estoque</span>
                                  <SortStockButton onClick={setSortType} sortType={sortType} />
                              </div>
                          </th>
                          <th className="hidden lg:table-cell font-secondary font-semibold text-lg px-4 pb-1.5">
                              <div className="flex items-center justify-between gap-4">
                                  <span>Vendidos</span>
                                  <SortSoldButton onClick={setSortType} sortType={sortType} />
                              </div>
                          </th>
                          <th className="hidden sm:table-cell font-secondary font-semibold text-lg px-4 pb-1.5">
                              <div className="flex items-center justify-between gap-4">
                                  <span>Receita</span>
                                  <SortRevenueButton onClick={setSortType} sortType={sortType} />
                              </div>
                          </th>
                          <th className="hidden sm:table-cell font-secondary font-semibold text-lg px-4 pb-1.5">
                              <div className="flex items-center justify-between gap-4">
                                  <span>Lucro</span>
                                  <SortProfitButton onClick={setSortType} sortType={sortType} />
                              </div>
                          </th>
                          <th className="hidden lg:table-cell font-secondary font-semibold text-lg px-4 pb-1.5">
                              <div className="flex items-center justify-between gap-4">
                                  <span>Margem</span>
                                  <SortMarginButton onClick={setSortType} sortType={sortType} />
                              </div>
                          </th>
                          <th className="hidden xl:table-cell font-secondary font-semibold text-lg px-4 pb-1.5">Atualizado</th>
                      </tr>
                  </thead>
                  <tbody className="border divide-y divide-border border-x-0">
                      {
                          sorted.slice(0, limit).map(product => {

                              const hasChanged = productsToChange?.find(changeProduct => changeProduct.id === product.product_id);
                              const displayedStock = hasChanged ? hasChanged.newStock : product.current_stock;
                              
                              return (
                                  <tr key={product.product_id} className="border-b-2 border-border hover:bg-surface-hover transition-colors duration-200 text-center">
                                    <td className="font-secondary px-5 py-3 text-sm text-text max-w-50 text-start lg:truncate" title={product.product_name}>{product.product_name}</td>
                                    <td className="font-secondary px-5 py-3 text-base text-text-muted">
                                        {isEdit
                                            ?
                                            (<div className="flex gap-2 sm:gap-3 items-center mr-7">
                                                <button onClick={() => decrementStock(product, setProductsToChange)} className="text-text font-main">-</button>
                                                <span>{displayedStock}</span>
                                                <button onClick={() => incrementStock(product, setProductsToChange)} className="text-text font-main">+</button>
                                            </div>)
                                            :
                                            <Badge variant="stock" product={product} />
                                        }
                                    </td>
                                    <td className="hidden lg:table-cell font-secondary px-5 py-3 text-base text-text-muted">{product?.sold_qty}</td>
                                    <td className="hidden sm:table-cell font-secondary px-5 py-3 text-base text-text-muted">{product.revenue}</td>
                                    <td className="hidden sm:table-cell font-secondary px-5 py-3 text-base text-text-muted">
                                        {isEdit && isAdmin && !productsToChange.some(changeProduct => changeProduct.id === product.product_id)
                                            ?
                                            <div className="hidden sm:flex items-center justify-center gap-2">
                                                <span>R$ {product.profit}</span>
                                                <div className="self-center lg:hidden">
                                                    <DeleteProductButton product={product} setStocks={setStocks} setSuccess={setSuccess} />
                                                </div>
                                            </div>
                                            :
                                            <span>R$ {product.profit}</span>
                                        }
                                    </td>
                                    <td className="hidden lg:table-cell font-secondary px-5 py-3 text-base text-text-muted"><Badge variant="margin" product={product} /></td>
                                    <td className="hidden xl:table-cell font-secondary px-5 py-3 text-base text-text-disabled">
                                        {isEdit && isAdmin && !productsToChange.some(changeProduct => changeProduct.id === product.product_id)
                                            ?
                                            <div className="flex items-center justify-center gap-2">
                                                <span>{product.last_updated.split("-").reverse().join("/")}</span>
                                                <DeleteProductButton product={product} setStocks={setStocks} setSuccess={setSuccess} />
                                            </div>
                                            :
                                            product.last_updated.split("-").reverse().join("/")
                                        }
                                    </td>
                              </tr>
                              );
                          })
                      }
                  </tbody>
              </table>
              {limit < sorted.length && <button onClick={() => setLimit(prev => prev + 20)} className="font-secondary font-medium text-sm tracking-tight text-text-disabled hover:text-text-muted transition-colors duration-200">Ver mais...</button>}

              {/* ON DELETE SUCCESS */}
              {success && <SuccessToast message={success} onClose={setSuccess} />}
            </section>
        </section>
    );
};