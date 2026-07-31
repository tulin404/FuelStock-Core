import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { ErrorToast } from "@/components/ErrorToast";
import type { Dispatch, SetStateAction } from "react";
import { AuthService } from "@/services/auth.service";

export function LogoutModal({ setIsLogoutModalOpen }: { setIsLogoutModalOpen: Dispatch<SetStateAction<boolean>> }) {
    const root = document.getElementById("root");
    const modalRoot = document.getElementById("modal-root");

    const navigate = useNavigate();
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    
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

    async function handleLogout() {
        try {
            setIsLoading(true);
            await AuthService.logout();
            navigate("/login");
        } catch(error) {
            setError(error);
        } finally {
            setIsLoading(false);
        };
    };
    
    return createPortal(
        <>
            <div className={`${hasLoaded ? "scale-100 opacity-100" : "scale-0 opacity-0"} fixed top-1/2 left-1/2 -translate-1/2 flex flex-col justify-center items-center gap-4 transition-all duration-400 z-30 bg-surface p-4 rounded-xl sm:w-auto w-[90%]`}>
                <h2 className="font-main font-semibold text-3xl text-text text-center">Deseja mesmo sair?</h2>
                <p className="text-text-muted text-center text-balance text-lg max-w-80">Você será desconectado da sua conta. Para acessá-la novamente, precisará inserir suas credenciais.</p>
                <div className="font-main flex flex-col gap-2 w-full">
                    <button disabled={isLoading} onClick={handleLogout} type="submit" className="bg-danger-surface text-danger w-full text-xl font-bold transition-colors duration-200 border-3 border-danger-border active:bg-danger-surface-active sm:hover:bg-danger-surface-hover rounded-md py-0.5">Sair</button>
                    <button disabled={isLoading} onClick={() => setIsLogoutModalOpen(prev => !prev)} type="button" className="text-text-muted w-full text-xl font-semibold transition-colors duration-200 sm:hover:bg-background rounded-md py-0.5">Cancelar</button>
                </div>
            </div>
            {error && <ErrorToast error={error} onClose={setError} />}
        </>,
        modalRoot
    );
};