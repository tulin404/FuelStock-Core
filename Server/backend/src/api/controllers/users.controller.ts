import { UsersService } from "../services/users.service.js";
import { client } from "../../db/prisma.js";
// EXPLICIT IMPORT FOR TYPE CHECK
import type { Request, Response } from "express";

const usersService = new UsersService(client);

export class UsersController {
    static async getUsers(req: Request, res: Response) {
        const requesterId = req.user.id;
        const tenant_id = req.user.tenant_id;
        
        const users = await usersService.getUsers(tenant_id);
        const filteredUsers = users.filter(user => user.id !== requesterId);

        return res.status(200).json({ data: filteredUsers });
    };
    
    static async delete(req: Request, res: Response) {
        const requesterId = req.user.id;
        const user_id = String(req.params.user_id);

        if (!user_id) {
            return res.status(400).json({
                name: "ID ausente",
                message: "Por favor, envie o ID do usuário que deseja excluir."
            });
        };

        if (user_id === requesterId) {
            return res.status(400).json({
                name: "Operação inválida",
                message: "Não é possível deletar seu próprio usuário."
            });
        };

        try {
            await usersService.delete(user_id);
            return res.status(200).json({ message: "Usuário deletado." });
        } catch(error) {
            // CUSTOM ERROR MESSAGE SINCE PRISMA THROWS RAW ERROR
            // DEBUG IN CASE OF DEEP ERRORS
            return res.status(400).json({
                name: "Falha ao deletar usuário",
                message: "Não foi possível deletar o usuário. Por favor, tente novamente.",
                debug: error instanceof Error ? error.message : "Erro desconhecido."
            });
        };
    };
};