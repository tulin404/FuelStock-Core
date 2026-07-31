import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";
import { createUser } from "../../../actions/createUser";
import { ErrorToast } from "@/components/ErrorToast";
import { Overlay } from "@/components/Overlay";
import { DashboardSpinner } from "../../DashboardSpinner";
import { createPortal } from "react-dom";
import type { User } from "@/types/types";
import { Eye, EyeOff } from "lucide-react";

export function CreateUserPanel({ setIsCreatePanelOpen, setUsers, setSuccess }: { setIsCreatePanelOpen: Dispatch<SetStateAction<boolean>>, setUsers: Dispatch<SetStateAction<User[] | []>>, setSuccess: Dispatch<SetStateAction<string | null>> }) {
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
    
    async function handleCreate(formData: FormData) {
        try {
            setIsLoading(true);
            const response = await createUser(formData);
            setSuccess(response.message);
            setUsers(prev => [...prev, response.newUser]);
            setIsCreatePanelOpen(false);
        } catch(error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <>
            <form action={handleCreate} className={`${hasLoaded ? "scale-100 opacity-100" : "scale-0 opacity-0"} fixed top-1/2 left-1/2 -translate-1/2 flex flex-col justify-center items-center gap-6 transition-all duration-400 z-30 bg-surface px-4 py-6 rounded-xl w-auto shadow-xs`}>
                <div className="flex flex-col items-start gap-1">
                    <h2 className="text-text font-main text-3xl font-semibold self-center">Criar usuário</h2>
                    <div className="flex flex-col w-full">
                        <label className="text-text text-lg font-main font-medium" htmlFor="name">Nome</label>
                        <input max={20} name="name" type="text" placeholder="João Silva" id="name" required className="outline-0 ring-0 border-2 border-input-border focus:border-input-border-focus transition-colors duration-200 rounded-md py-0.5 px-1" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-text text-lg font-main font-medium" htmlFor="email">Email</label>
                        <input min={15} max={40} name="email" type="email" placeholder="joao.silva@empresa.com.br" id="email" required className="outline-0 ring-0 border-2 border-input-border focus:border-input-border-focus transition-colors duration-200 rounded-md py-0.5 px-1" />
                    </div>
                    <div className="flex flex-col relative w-full">
                        <label htmlFor="password" className="text-lg font-medium font-main text-text">Senha</label>
                        <input name="password" min={8} max={15} type={showPassword ? "text" : "password"} placeholder="••••••••" required className="outline-0 ring-0 border-2 pr-9 box-border border-border focus:border-input-border-focus transition-colors duration-200 rounded-md py-0.5 pl-1" />
                        <button onClick={() => {setShowPassword(prev => !prev)}} className="z-10 absolute bottom-1.5 right-2 transition-opacity duration-200" type="button">
                            {showPassword ? <div><span className="-left-1.5 absolute bg-border w-0.5 h-full rounded-full" /><EyeOff strokeWidth={1.5} size={20} /></div> : <div><span className="-left-1.5 absolute bg-border w-0.5 h-full rounded-full" /><Eye strokeWidth={1.5} size={20} /></div>}
                        </button>
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="role" className="text-lg font-medium font-main text-text">Cargo</label>
                        <select name="role" id="role" className="outline-0 ring-0 border-2 pr-9 box-border border-border focus:border-input-border-focus transition-colors duration-200 rounded-md py-0.5 pl-1">
                            <option value={null} disabled selected hidden></option>
                            <option value="admin" className="text-text text-sm">Administrador</option>
                            <option value="user" className="text-text text-sm">Usuário</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col w-full gap-2">
                    <button type="submit" className="bg-button font-secondary font-semibold text-lg text-button-text w-full py-1 lg:py-1.5 rounded-lg self-center hover:bg-button-hover sm:hover:-translate-y-1 active:scale-95 active:bg-button-active transition-all duration-200">Criar</button>
                    <button type="button" onClick={() => setIsCreatePanelOpen(false)} className="bg-surface text-text-muted py-1 lg:py-1.5 text-sm rounded-lg self-center font-secondary w-full hover:bg-background transition-colors duration-200">Cancelar</button>
                </div>
            </form>
            <Overlay active={isLoading} variant="modal" />
            {isLoading && <DashboardSpinner />}
            {error && <ErrorToast error={error} onClose={setError} />}
        </>,
        modalRoot
    );
};