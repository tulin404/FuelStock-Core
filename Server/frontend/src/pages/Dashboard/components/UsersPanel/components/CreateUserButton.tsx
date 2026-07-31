import type { Dispatch, SetStateAction } from "react";
import { UserPlus } from "lucide-react";

export function CreateUserButton({ setIsCreatePanelOpen }: { setIsCreatePanelOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <button onClick={() => setIsCreatePanelOpen(prev => !prev)} type="button" title="Criar usuário" aria-label="Criar usuário"><UserPlus className="text-text" /></button>
    );
};