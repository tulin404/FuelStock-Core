import type { User } from "@/types/types";
import { UserIcon, Users, UserStar } from "lucide-react";
import { useEffect, useState } from "react";
import { getUsers } from "../../actions/fetchUsers";
import { DeleteUserButton } from "./components/DeleteUserButton";
import { SuccessToast } from "@/components/SuccessToast";
import { CreateUserButton } from "./components/CreateUserButton";
import { Overlay } from "@/components/Overlay";
import { CreateUserPanel } from "./components/CreateUserPanel";

export function UsersPanel() {
    const [users, setUsers] = useState<User[] | []>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);

    useEffect(() => {
        async function fetchUsers() {
            const data = await getUsers();
            setUsers(data);
        };

        fetchUsers();
    }, []);
    
    return (
        <section className="p-4 bg-surface shadow-xs rounded-xl h-min border-2 border-border sm:hover:border-border-hover transition-colors duration-200 w-full xs:w-auto 2.5xl:w-full">
            <div className="flex items-center justify-between gap-8 pb-2">
                <div className="flex items-center gap-2">
                    <Users />
                    <h2 className="font-main font-semibold text-2xl text-text">Usuários</h2>
                </div>
                <CreateUserButton setIsCreatePanelOpen={setIsCreatePanelOpen} />
            </div>
            {users.length > 0
                ?
                <table className="table-fixed divide-y border-collapse border-b-0">
                    <thead>
                        <tr className="border-b border-b-border">
                            <th className="text-left font-secondary w-1/3 pb-1 pr-10 text-text">Nome</th>
                            <th className="text-left font-secondary w-1/3 pb-1 pr-10 text-text">Email</th>
                            <th className="text-center font-secondary w-1/3 pb-1 pr-2 text-text">Cargo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: User) => 
                            <tr key={user.id}>
                                <td className="text-sm tracking-tight text-text">
                                    {user.name}
                                </td>
                                <td className="text-sm tracking-tight text-text">
                                    <span title={user.email} className="2xl:truncate inline-block 2xl:w-25">
                                        {user.email}
                                    </span>
                                </td>
                                <td className="text-sm tracking-tight">
                                    <div className="flex items-center justify-center text-text">
                                        {user.role === "admin"
                                            ?
                                            <UserStar aria-label="Administrador" />
                                            :
                                            <UserIcon aria-label="Usuário" />
                                        }
                                    </div>
                                </td>
                                <td className="flex items-center justify-center pt-0.5">
                                    <DeleteUserButton user={user} setUsers={setUsers} setSuccess={setSuccess} />
                                </td>
                            </tr>
                        )}  
                    </tbody>
                </table>
                :
                <div className="flex items-center">
                    <span className="text-text font-secondary whitespace-nowrap text-center w-full">Sem usuários</span>
                </div>
            }
            {isCreatePanelOpen && <CreateUserPanel setIsCreatePanelOpen={setIsCreatePanelOpen} setUsers={setUsers} setSuccess={setSuccess} />}
            <Overlay active={isCreatePanelOpen} />
            {/* ON DELETE SUCCESS */}
            {success && <SuccessToast message={success} onClose={setSuccess} />}
        </section>
    );
};