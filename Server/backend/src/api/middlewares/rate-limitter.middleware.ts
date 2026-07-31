import rateLimit from "express-rate-limit";

export const registerRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Muitas tentativas de registro. Tente novamente em alguns minutos."
    }
});

export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Muitas tentativas de login. Tente novamente em alguns minutos."
    }
});

export const apiRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Limite de requisições excedido. Tente novamente em instantes."
    }
});

export const importRateLimit = rateLimit({
    windowMs: 24 * 60 * 1000,
    limit: 2, // GRANT THAT FEW MINUTES DOESNT BREAK THE SYSTEM
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Muitas importações em pouco tempo. Aguarde um momento antes de tentar novamente."
    }
});