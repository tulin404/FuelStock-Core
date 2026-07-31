import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Product } from "@dashboard/types/types";
import { User } from "./components/User";
import logo from "@dashboard/assets/logo-header.png";
import { LogoutModal } from "./components/LogoutModal";
import { Overlay } from "@/components/Overlay";
import { Greetings } from "./components/Greetings";
import { AddStokcButton } from "./components/AddStockButton";
import { AddStockPanel } from "./components/AddStockPanel";
import { SuccessToast } from "@/components/SuccessToast";

export function Header({ isEdit, setStocks }: { isEdit: boolean, setStocks: Dispatch<SetStateAction<Product[] | null>> }) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isAddStockPanelOpen, setIsAddStockPanelOpen] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    return (
        <>
            <header className="bg-surface relative py-4 px-8 shadow-sm z-10 flex justify-between items-center">
                <div id="header-left">
                    <img className="h-22 sm:h-24 md:h-28" src={logo} />
                </div>

                <div id="header-right" className="flex items-center gap-6">
                    <Greetings />
                    {!isEdit && <AddStokcButton setIsAddStockPanelOpen={setIsAddStockPanelOpen} />}
                    <User setIsLogoutModalOpen={setIsLogoutModalOpen} />
                </div>
            </header>
            {isLogoutModalOpen && <LogoutModal setIsLogoutModalOpen={setIsLogoutModalOpen} />}
            {isAddStockPanelOpen && <AddStockPanel setIsAddStockPanelOpen={setIsAddStockPanelOpen} setStocks={setStocks} setSuccess={setSuccess} />}
            <Overlay active={isLogoutModalOpen || isAddStockPanelOpen} />
            {success && <SuccessToast message={success} onClose={setSuccess} />}
        </>
    );
};