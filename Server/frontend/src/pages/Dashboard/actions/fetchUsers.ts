import { UserService } from "@/services/user.service";
import type { User } from "@/types/types";

export async function getUsers() {
    const data: User[] = await UserService.getUsers();

    const mapped = data.map((user: User) => {
        const splitted = user.name.split(" ");

        if (splitted.length <= 1) {
            return {
                ...user,
                name: `${splitted[0]}`
            };
        };

        if (splitted[1].length <= 2) {
            return {
                ...user,
                name: `${splitted[0]} ${splitted[2]}`    
            };
        };

        return {
            ...user,
            name: `${splitted[0]} ${splitted[1]}`
        };
    });

    return mapped;
};