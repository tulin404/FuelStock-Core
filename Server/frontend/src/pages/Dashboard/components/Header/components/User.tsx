import { useAuthStore } from "@/stores/auth.store";
import { UserIcon, LogOut, LucideIdCard, AtSign, Shield } from "lucide-react";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

export function User({ setIsLogoutModalOpen }: { setIsLogoutModalOpen: Dispatch<SetStateAction<boolean>> }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null)
    const user = useAuthStore((state) => state.user);
    
    useEffect(() => {
        if (!open) return;
        
        function handleClick(e: MouseEvent) {
            const target = e.target as HTMLElement;
            
            if (menuRef.current && !menuRef.current?.contains(target)) {
                setOpen(false);
            };
        };
        
        window.addEventListener("click", handleClick);

        return () => window.removeEventListener("click", handleClick);
    }, [open]);
    
    return (
        <div ref={menuRef} className="relative flex items-center">
            <button id="open-user-menu" aria-label="Abrir menu de usuário" className="rounded-full" onClick={() => setOpen(prev => !prev)}>
                <UserIcon size={26} className="box-content text-text p-1 bg-surface-hover border-2 border-border rounded-full hover:bg-border transition-colors duration-200" />
            </button>
            <div id="user-menu" className={`${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} absolute right-2 w-max top-12 transition-opacity duration-200 z-20 border border-border bg-surface p-3 rounded-lg flex flex-col gap-2`}>
                <div className="flex flex-col gap-1">
                    <span className="font-secondary text-text font-semibold text-lg flex items-center gap-2"><LucideIdCard />{user.name}</span>
                    <span className="font-secondary text-text flex items-center gap-1"><Shield size={16} />{user.role === "admin" ? "Administrador" : "Usuário"}</span>
                    <span className="font-secondary text-text italic flex items-center gap-1"><AtSign size={16} />{user.email}</span>
                </div>
                <span className="w-full h-0.5 bg-border" />
                <button type="submit" className="flex items-center gap-3 p-1 sm:hover:bg-danger-surface border-2 border-transparent sm:hover:border-danger-border active:translate-y-0.5 rounded-lg transition-all duration-200" title="Sair" onClick={() => setIsLogoutModalOpen(true)}>
                    <LogOut className="text-danger h-5" />
                    <span className="text-danger text-lg font-medium font-secondary">Sair</span>
                </button>    
            </div>
        </div>
    )
};