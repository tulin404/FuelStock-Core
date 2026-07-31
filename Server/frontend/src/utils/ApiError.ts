export class ApiError extends Error {
    constructor(message: string, name = "Erro") {
        super(message);
        this.name = name;
    };
};